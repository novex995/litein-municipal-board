import express from 'express'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../config/supabase.js'
import { sendEmail, emailTemplates } from '../services/gmailService.js'
import ActivityLogger from '../utils/activityLogger.js'

const router = express.Router()

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password
    })

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message || 'Invalid email or password'
      })
    }

    // Get user profile from public.users table
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      return res.status(400).json({
        success: false,
        error: 'User profile not found'
      })
    }

    // Generate custom JWT token
    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        full_name: userProfile.full_name,
        role: userProfile.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    )

    // Log login activity
    await ActivityLogger.log({
      userId: data.user.id,
      userEmail: data.user.email,
      userName: userProfile.full_name,
      action: 'login',
      entityType: 'auth',
      description: `User logged in: ${data.user.email}`,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    })

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name,
        role: userProfile.role,
        phone: userProfile.phone,
        avatar_url: userProfile.avatar_url
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    })
  }
})

// Forgot password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (userError || !user) {
      // Don't reveal if user exists (security best practice)
      return res.json({
        success: true,
        message: 'If this email exists in our system, a password reset link has been sent.'
      })
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '1h' } // Token valid for 1 hour
    )

    // Create reset link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`

    // Send reset email
    try {
      const emailTemplate = emailTemplates.passwordReset(resetLink, user.full_name || 'User')
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
    } catch (emailError) {
      console.error('Error sending reset email:', emailError)
      // Still return success to not expose email sending issues
    }

    return res.json({
      success: true,
      message: 'If this email exists in our system, a password reset link has been sent.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    })
  }
})

// Verify reset token
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required'
      })
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )

    return res.json({
      success: true,
      message: 'Token is valid',
      userId: decoded.id,
      email: decoded.email
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        error: 'Reset token has expired. Please request a new one.'
      })
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid reset token'
    })
  }
})

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token, new password, and confirmation are required'
      })
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      })
    }

    // Validate password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      )
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          error: 'Reset token has expired. Please request a new one.'
        })
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      })
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      decoded.id,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      return res.status(400).json({
        success: false,
        error: 'Failed to reset password. Please try again.'
      })
    }

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    })
  }
})

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')

    // Get user profile from database
    const { data: userProfile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single()

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name,
        role: userProfile.role,
        phone: userProfile.phone,
        avatar_url: userProfile.avatar_url,
        created_at: userProfile.created_at
      }
    })
  } catch (error) {
    console.error('Error getting user profile:', error)
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    })
  }
})

// Get all staff (for admin purposes - requires admin role)
router.get('/staff', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')

    // Check if user is admin
    if (decoded.role !== 'super_admin' && decoded.role !== 'municipal_manager') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      })
    }

    // Get all staff members
    const { data: staff, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, phone, created_at')
      .in('role', ['municipal_staff', 'department_head', 'municipal_manager', 'super_admin'])

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch staff members'
      })
    }

    res.json({
      success: true,
      data: staff,
      total: staff.length
    })
  } catch (error) {
    console.error('Error fetching staff:', error)
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    })
  }
})

// Get staff member by ID
router.get('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: staff, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, phone, created_at')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      })
    }

    res.json({
      success: true,
      data: staff
    })
  } catch (error) {
    console.error('Error fetching staff:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff member'
    })
  }
})

// Logout (optional - mainly for frontend)
router.post('/logout', (req, res) => {
  // Token is managed on frontend, backend just confirms logout
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

export default router
