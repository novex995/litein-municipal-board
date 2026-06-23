import nodemailer from 'nodemailer'

/**
 * Create Gmail SMTP transporter
 */
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Gmail credentials not configured')
    throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })
}

/**
 * Send an email using Gmail SMTP
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML email content
 * @param {string} [params.text] - Text email content
 * @param {Object} [params.cc] - CC recipients {email, name}
 * @param {Object} [params.bcc] - BCC recipients {email, name}
 * @param {string} [params.from] - Sender email (optional, uses default if not provided)
 * @param {string} [params.fromName] - Sender name (optional)
 * @returns {Promise<Object>} - Response from nodemailer
 */
export const sendEmail = async (params) => {
  try {
    const {
      to,
      subject,
      html,
      text,
      cc = null,
      bcc = null,
      from = process.env.GMAIL_USER,
      fromName = 'Litein Municipal Board'
    } = params

    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, html')
    }

    // Create transporter
    const transporter = createTransporter()

    // Prepare email options
    const mailOptions = {
      from: `"${fromName}" <${from}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || subject,
      replyTo: 'info@liteinmunicipal.go.ke'
    }

    // Add CC if provided
    if (cc) {
      mailOptions.cc = cc
    }

    // Add BCC if provided
    if (bcc) {
      mailOptions.bcc = bcc
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log('✓ Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject
    })

    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    }
  } catch (error) {
    console.error('✗ Error sending email:', error.message)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

/**
 * Send a templated email (for future use with custom templates)
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.templateName - Template name from emailTemplates
 * @param {Object} [params.params] - Template variables
 * @returns {Promise<Object>} - Response from nodemailer
 */
export const sendTemplateEmail = async (params) => {
  try {
    const {
      to,
      templateName,
      params: templateParams = {}
    } = params

    // Validate required fields
    if (!to || !templateName) {
      throw new Error('Missing required parameters: to, templateName')
    }

    // Get template
    const template = emailTemplates[templateName]
    if (!template) {
      throw new Error(`Template '${templateName}' not found`)
    }

    // Generate email content from template
    const emailContent = template(templateParams)

    // Send email using sendEmail function
    return await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    })
  } catch (error) {
    console.error('✗ Error sending template email:', error.message)
    throw new Error(`Template email sending failed: ${error.message}`)
  }
}

/**
 * Pre-built email templates for common scenarios
 */
export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (userName, email) => ({
    subject: 'Welcome to Litein Municipality Portal',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0;">Welcome to Litein Municipality</h1>
          </div>
          
          <p>Hello ${userName},</p>
          
          <p>Thank you for registering on the Litein Municipality Digital Portal. Your account has been successfully created.</p>
          
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Account Details:</strong></p>
            <p>Email: ${email}</p>
          </div>
          
          <p>You can now access our online services including:</p>
          <ul>
            <li>Business Licensing</li>
            <li>Building Approvals</li>
            <li>Market Services</li>
            <li>Land & Rates</li>
            <li>Public Complaints</li>
          </ul>
          
          <p>If you have any questions, please contact us at <a href="mailto:support@liteintownboard.com">support@liteintownboard.com</a></p>
          
          <p>Best regards,<br/>Litein Municipality Team</p>
        </div>
      </div>
    `,
    text: `Welcome to Litein Municipality\n\nHello ${userName},\n\nThank you for registering. Your account has been successfully created with email: ${email}\n\nBest regards, Litein Municipality Team`
  }),

  /**
   * Complaint confirmation email template
   */
  complaintConfirmation: (complaintId, subject, submittedDate) => ({
    subject: 'Complaint Received - Reference #' + complaintId,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0;">Complaint Received</h1>
          </div>
          
          <p>We have received your complaint and it is being reviewed.</p>
          
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Complaint Details:</strong></p>
            <p>Reference Number: <strong>${complaintId}</strong></p>
            <p>Subject: ${subject}</p>
            <p>Submitted: ${submittedDate}</p>
            <p>Status: <span style="color: #ff9800; font-weight: bold;">SUBMITTED</span></p>
          </div>
          
          <p>You can track the status of your complaint using the reference number above in our portal.</p>
          
          <p>Thank you for helping us improve our services.</p>
          
          <p>Best regards,<br/>Litein Municipality Team</p>
        </div>
      </div>
    `,
    text: `Complaint Received\n\nReference: ${complaintId}\nSubject: ${subject}\nDate: ${submittedDate}\n\nThank you for your feedback.`
  }),

  /**
   * Password reset email template
   */
  passwordReset: (resetLink, userName) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0066cc;">Password Reset Request</h1>
          
          <p>Hello ${userName},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p><strong>This link expires in 24 hours.</strong></p>
          
          <p>If you didn't request this, please ignore this email.</p>
          
          <p>Best regards,<br/>Litein Municipality Team</p>
        </div>
      </div>
    `,
    text: `Password Reset Request\n\nClick the link to reset your password: ${resetLink}\n\nThis link expires in 24 hours.\n\nIf you didn't request this, please ignore this email.`
  })
}

export default {
  sendEmail,
  sendTemplateEmail,
  emailTemplates
}
