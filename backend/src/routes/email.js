import express from 'express'
import {
  sendTestEmail,
  sendWelcomeEmail,
  sendComplaintConfirmation,
  sendPasswordResetEmail,
  sendCustomEmail
} from '../controllers/emailController.js'

const router = express.Router()

/**
 * @route POST /api/email/test
 * @desc Send a test email to verify Brevo setup
 * @body {string} email - Recipient email address
 */
router.post('/test', sendTestEmail)

/**
 * @route POST /api/email/welcome
 * @desc Send welcome email to new user
 * @body {string} userName - User's name
 * @body {string} email - User's email address
 */
router.post('/welcome', sendWelcomeEmail)

/**
 * @route POST /api/email/complaint-confirmation
 * @desc Send complaint confirmation email
 * @body {string} email - Recipient email
 * @body {string} complaintId - Complaint ID
 * @body {string} subject - Complaint subject
 * @body {string} submittedDate - Date submitted
 */
router.post('/complaint-confirmation', sendComplaintConfirmation)

/**
 * @route POST /api/email/password-reset
 * @desc Send password reset email
 * @body {string} email - Recipient email
 * @body {string} resetLink - Password reset link
 * @body {string} userName - User's name
 */
router.post('/password-reset', sendPasswordResetEmail)

/**
 * @route POST /api/email/send
 * @desc Send custom email
 * @body {string} to - Recipient(s)
 * @body {string} subject - Email subject
 * @body {string} html - HTML content
 * @body {string} [text] - Text content
 * @body {string|Object} [cc] - CC recipient(s)
 * @body {string|Object} [bcc] - BCC recipient(s)
 */
router.post('/send', sendCustomEmail)

export default router
