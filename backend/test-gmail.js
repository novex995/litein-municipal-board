// Test Gmail Email Functionality
// Run this with: node test-gmail.js

import { sendEmail, emailTemplates } from './src/services/gmailService.js'
import 'dotenv/config'

async function testGmailEmail() {
  console.log('🧪 Testing Gmail SMTP Service...\n')

  // Check environment variables
  console.log('📋 Configuration Check:')
  console.log('  GMAIL_USER:', process.env.GMAIL_USER || '✗ Not set')
  console.log('  GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✓ Set' : '✗ Not set')
  console.log('')

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Gmail credentials not configured')
    console.error('Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file')
    process.exit(1)
  }

  try {
    // Test 1: Send a simple test email
    console.log('📧 Test 1: Sending test email...')
    const testRecipient = process.env.GMAIL_USER // Send to yourself for testing
    
    const result = await sendEmail({
      to: testRecipient,
      subject: 'Test Email from Litein Municipal Board',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #00b33c;">✅ Email Service Test Successful!</h1>
          <p>This is a test email from your Litein Municipal Board application.</p>
          <p><strong>If you're reading this, your Gmail SMTP service is working perfectly!</strong></p>
          
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46;">
              <strong>✓ Configuration Verified:</strong><br/>
              • Gmail SMTP: Connected<br/>
              • Sender: ${process.env.GMAIL_USER}<br/>
              • Status: Active
            </p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test message from Litein Municipality Board system.
          </p>
        </div>
      `,
      text: 'This is a test email. If you received this, your Gmail SMTP service is working!'
    })

    console.log('✅ Test email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log('   Recipient:', testRecipient)
    console.log('')

    // Test 2: Send password reset email template
    console.log('📧 Test 2: Testing password reset template...')
    const resetLink = 'http://localhost:5173/reset-password?token=test-token-123456'
    const template = emailTemplates.passwordReset(resetLink, 'Test User')
    
    const result2 = await sendEmail({
      to: testRecipient,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    console.log('✅ Password reset email sent successfully!')
    console.log('   Message ID:', result2.messageId)
    console.log('   Recipient:', testRecipient)
    console.log('')

    console.log('🎉 All tests passed!')
    console.log('📬 Check your inbox at:', testRecipient)
    console.log('   (Check spam folder if you don\'t see the emails)')
    console.log('')
    console.log('✅ Your email service is ready for production!')

  } catch (error) {
    console.error('❌ Test failed!')
    console.error('   Error:', error.message)
    console.error('')
    console.error('Troubleshooting tips:')
    console.error('1. Verify GMAIL_USER and GMAIL_APP_PASSWORD are correct in .env')
    console.error('2. Ensure 2-Step Verification is enabled on your Gmail account')
    console.error('3. Check that you created an App Password (not your regular Gmail password)')
    console.error('4. Generate a new App Password at: https://myaccount.google.com/apppasswords')
    process.exit(1)
  }
}

testGmailEmail()
