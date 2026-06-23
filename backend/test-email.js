// Test Email Functionality
// Run this with: node test-email.js

import { sendEmail, emailTemplates } from './src/services/emailService.js'
import 'dotenv/config'

async function testEmail() {
  console.log('🧪 Testing Brevo Email Service...\n')

  // Check environment variables
  console.log('📋 Configuration Check:')
  console.log('  BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✓ Set' : '✗ Missing')
  console.log('  BREVO_EMAIL_FROM:', process.env.BREVO_EMAIL_FROM || 'Not set')
  console.log('')

  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not set in .env file')
    process.exit(1)
  }

  try {
    // Test 1: Send a simple test email
    console.log('📧 Test 1: Sending test email...')
    const testRecipient = process.env.BREVO_EMAIL_FROM // Send to yourself for testing
    
    const result = await sendEmail({
      to: testRecipient,
      subject: 'Test Email from Litein Municipal Board',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #0066cc;">Email Service Test</h1>
          <p>This is a test email from your Litein Municipal Board application.</p>
          <p>If you're reading this, your email service is working correctly! ✅</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test message. No reply is required.
          </p>
        </div>
      `,
      text: 'This is a test email. If you received this, your email service is working!'
    })

    console.log('✅ Test email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log('   Recipient:', testRecipient)
    console.log('')

    // Test 2: Send password reset email template
    console.log('📧 Test 2: Testing password reset template...')
    const resetLink = 'http://localhost:5173/reset-password?token=test-token-123'
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
    console.log('   (Also check spam folder if you don\'t see the emails)')

  } catch (error) {
    console.error('❌ Test failed!')
    console.error('   Error:', error.message)
    console.error('')
    console.error('Troubleshooting tips:')
    console.error('1. Verify your BREVO_API_KEY is correct in .env')
    console.error('2. Check that the sender email is verified in Brevo')
    console.error('3. Ensure your Brevo account is active')
    process.exit(1)
  }
}

testEmail()
