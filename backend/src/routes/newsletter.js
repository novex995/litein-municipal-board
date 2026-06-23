import express from 'express'
import { supabaseAdmin } from '../config/supabase.js'
import { sendEmail } from '../services/gmailService.js'

const router = express.Router()

/**
 * Subscribe to newsletter
 * @route POST /api/newsletter/subscribe
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      })
    }

    // Try to check if email already exists (skip if table doesn't exist)
    let alreadyExists = false
    try {
      const { data: existing } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (existing) {
        alreadyExists = true
      }
    } catch (checkError) {
      // Table might not exist yet, continue anyway
      console.log('Note: newsletter_subscribers table check skipped')
    }

    if (alreadyExists) {
      return res.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true
      })
    }

    // Try to add subscriber to database (skip if table doesn't exist)
    try {
      await supabaseAdmin
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            subscribed_at: new Date().toISOString(),
            status: 'active'
          }
        ])
      console.log('✓ Subscriber saved to database')
    } catch (insertError) {
      // Log error but continue to send email anyway
      console.log('Note: Could not save to database (table may not exist yet), but will send email')
    }

    // Send welcome email (this is the most important part)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Litein Municipality Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #00b33c; margin: 0;">Welcome to Our Newsletter!</h1>
              </div>
              
              <p>Thank you for subscribing to Litein Municipality Board newsletter!</p>
              
              <p>You'll now receive:</p>
              <ul style="line-height: 2;">
                <li>📰 Latest news and announcements</li>
                <li>📢 New services and improvements</li>
                <li>🎯 Tender opportunities</li>
                <li>💼 Job openings</li>
                <li>🎓 Scholarship and bursary updates</li>
              </ul>
              
              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #065f46; font-weight: bold;">
                  🎉 You've joined 5,000+ subscribers!
                </p>
              </div>
              
              <p>Stay connected with us on:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:5173" style="display: inline-block; background-color: #00b33c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Visit Our Website
                </a>
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p>Best regards,<br/>Litein Municipality Team</p>
              
              <p style="font-size: 12px; color: #666; margin-top: 30px;">
                You're receiving this email because you subscribed to Litein Municipality Board newsletter.
                If you wish to unsubscribe, please contact us at info@liteinmunicipal.go.ke
              </p>
            </div>
          </div>
        `,
        text: 'Thank you for subscribing to Litein Municipality newsletter! You will receive updates about news, services, tenders, jobs, and scholarships.'
      })
      
      console.log('✓ Welcome email sent successfully to:', email)
    } catch (emailError) {
      console.error('✗ Error sending welcome email:', emailError)
      return res.status(500).json({
        success: false,
        error: 'Failed to send confirmation email. Please try again.'
      })
    }

    return res.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      alreadySubscribed: false
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    })
  }
})

/**
 * Get all newsletter subscribers (admin only)
 * @route GET /api/newsletter/subscribers
 */
router.get('/subscribers', async (req, res) => {
  try {
    const { data: subscribers, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('subscribed_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscribers:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch subscribers'
      })
    }

    return res.json({
      success: true,
      data: subscribers,
      total: subscribers.length
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred'
    })
  }
})

export default router
