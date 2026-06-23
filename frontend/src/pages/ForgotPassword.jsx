import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { API_URL } from '../config/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setEmail('')
      } else {
        setError(data.error || 'An error occurred. Please try again.')
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '448px' }}
      >
        {/* Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(to right, #0066cc, #0052a3)', padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Mail style={{ width: '24px', height: '24px' }} />
              Reset Password
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '8px' }}>
              We'll send you instructions to reset your password
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center' }}
              >
                {/* Success Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle style={{ width: '32px', height: '32px', color: '#059669' }} />
                  </div>
                </div>

                {/* Success Message */}
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                  Check Your Email
                </h2>
                <p style={{ color: '#4b5563', marginBottom: '24px' }}>
                  If an account exists with this email, we've sent a password reset link.
                  Please check your inbox and spam folder.
                </p>

                {/* Info Box */}
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#1e3a8a' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0' }}>Reset Link Details:</p>
                  <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>✓ The link expires in 1 hour</li>
                    <li>✓ For security, never share this link</li>
                    <li>✓ If you didn't request this, ignore the email</li>
                  </ul>
                </div>

                {/* Back to Login Button */}
                <Link
                  to="/staff-login"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: '#0066cc', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  Back to Login
                </Link>

                {/* Help Text */}
                <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '16px' }}>
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{ color: '#0066cc', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}
                  >
                    Try again
                  </button>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                    onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Enter the email address associated with your account
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#991b1b' }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#a3a3a3' : '#0066cc', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                {/* Back to Login Link */}
                <div style={{ textAlign: 'center' }}>
                  <Link
                    to="/staff-login"
                    style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Footer Info */}
          <div style={{ backgroundColor: '#f9fafb', padding: '16px 32px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', margin: 0 }}>
              🔒 Your account security is important to us. This link is secure and encrypted.
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#4b5563' }}
        >
          <p style={{ margin: 0 }}>Need help? <a href="/contact" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>Contact Support</a></p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
