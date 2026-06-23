import { sendEmail, sendTemplateEmail, emailTemplates } from '../services/emailService.js'

/**
 * Send a test email
 * @route POST /api/email/test
 */
export const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      })
    }

    const template = emailTemplates.welcome('Test User', email)

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    return res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Send welcome email to new user
 * @route POST /api/email/welcome
 */
export const sendWelcomeEmail = async (req, res) => {
  try {
    const { userName, email } = req.body

    if (!userName || !email) {
      return res.status(400).json({
        success: false,
        error: 'userName and email are required'
      })
    }

    const template = emailTemplates.welcome(userName, email)

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    return res.json({
      success: true,
      message: 'Welcome email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Send complaint confirmation email
 * @route POST /api/email/complaint-confirmation
 */
export const sendComplaintConfirmation = async (req, res) => {
  try {
    const { email, complaintId, subject, submittedDate } = req.body

    if (!email || !complaintId || !subject || !submittedDate) {
      return res.status(400).json({
        success: false,
        error: 'email, complaintId, subject, and submittedDate are required'
      })
    }

    const template = emailTemplates.complaintConfirmation(complaintId, subject, submittedDate)

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    return res.json({
      success: true,
      message: 'Complaint confirmation email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending complaint confirmation:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Send password reset email
 * @route POST /api/email/password-reset
 */
export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email, resetLink, userName } = req.body

    if (!email || !resetLink || !userName) {
      return res.status(400).json({
        success: false,
        error: 'email, resetLink, and userName are required'
      })
    }

    const template = emailTemplates.passwordReset(resetLink, userName)

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    return res.json({
      success: true,
      message: 'Password reset email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * Send custom email
 * @route POST /api/email/send
 */
export const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, html, text, cc, bcc } = req.body

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'to, subject, and html are required'
      })
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      cc,
      bcc
    })

    return res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending custom email:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export default {
  sendTestEmail,
  sendWelcomeEmail,
  sendComplaintConfirmation,
  sendPasswordResetEmail,
  sendCustomEmail
}
