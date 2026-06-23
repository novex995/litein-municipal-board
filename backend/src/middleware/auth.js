import { supabase, supabaseAdmin } from '../config/supabase.js'
import jwt from 'jsonwebtoken'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)

    // Try to verify as custom JWT first
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      )
      
      console.log('✓ JWT token decoded:', { id: decoded.id, email: decoded.email, role: decoded.role })
      
      // Get user role from database to ensure it's current
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role, email, full_name, is_active')
        .eq('id', decoded.id)
        .single()

      // If user doesn't exist in public.users, create them
      if (userError) {
        if (userError.code === 'PGRST116') {
          console.log(`User ${decoded.email} not found in public.users, creating...`)
          
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{
              id: decoded.id,
              email: decoded.email,
              full_name: decoded.full_name || decoded.email.split('@')[0],
              role: decoded.role || 'municipal_staff',
              is_active: true
            }])
            .select()
            .single()
          
          if (insertError) {
            console.error('Error creating user in public.users:', insertError)
            return res.status(500).json({ error: 'Error creating user profile' })
          }
          
          console.log('✓ Created user in public.users:', newUser)
          req.user = {
            id: decoded.id,
            email: decoded.email,
            role: newUser.role,
            is_active: newUser.is_active
          }
        } else {
          console.error('Error fetching user data:', userError)
          return res.status(500).json({ error: 'Error fetching user data' })
        }
      } else {
        // Check if user account is active
        if (userData.is_active === false) {
          console.log(`❌ User ${userData.email} account is disabled`)
          return res.status(403).json({ 
            error: 'Your account has been disabled. Please contact the administrator.',
            code: 'ACCOUNT_DISABLED'
          })
        }
        
        // User exists, use their data
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: userData.role,
          is_active: userData.is_active
        }
      }
      
      console.log('✓ User authenticated:', req.user)
      return next()
    } catch (jwtError) {
      console.log('JWT verification failed, trying Supabase token...')
      // If JWT verification fails, try Supabase token (for backwards compatibility)
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      // Get user role from database
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

      // If user doesn't exist in public.users, create them
      if (userError) {
        if (userError.code === 'PGRST116') {
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email.split('@')[0],
              role: 'municipal_staff',
              is_active: true
            }])
            .select()
            .single()
          
          if (insertError) {
            return res.status(500).json({ error: 'Error creating user profile' })
          }
          
          req.user = { ...user, role: newUser.role, is_active: newUser.is_active }
        } else {
          return res.status(500).json({ error: 'Error fetching user data' })
        }
      } else {
        // Check if user account is active
        if (userData.is_active === false) {
          return res.status(403).json({ 
            error: 'Your account has been disabled. Please contact the administrator.',
            code: 'ACCOUNT_DISABLED'
          })
        }
        
        req.user = { ...user, role: userData.role, is_active: userData.is_active }
      }
      
      next()
    }
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (user) {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        req.user = { ...user, role: userData?.role || 'citizen' }
      }
    }
    
    next()
  } catch (error) {
    next()
  }
}
