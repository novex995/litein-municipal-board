import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, EyeOff, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { API_URL } from '../config/api'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const [validations, setValidations] = useState({
    length: false,
    match: false
  })

  // Get token from URL and verify it
  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (!urlToken) {
      setError('Invalid or missing reset token')
      setVerifying(false)
      return
    }

    setToken(urlToken)
    verifyToken(urlToken)
  }, [searchParams])

  // Verify the reset token
  const verifyToken = async (resetToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Invalid reset token')
      }
    } catch (err) {
      console.error('Token verification error:', err)
      setError('Failed to verify reset token')
    } finally {
      setVerifying(false)
    }
  }

  // Validate form
  useEffect(() => {
    const passwordLength = formData.newPassword.length >= 6
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword !== ''

    setValidations({
      length: passwordLength,
      match: passwordsMatch
    })
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Final validation
    if (!validations.length || !validations.match) {
      setError('Please ensure your passwords meet all requirements')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({ newPassword: '', confirmPassword: '' })
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/staff-login')
        }, 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Verifying token state
  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #d1d5db', borderTop: '4px solid #0066cc', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4b5563' }}>Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  // Error state - invalid token
  if (error && !success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '448px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', padding: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#111827', marginBottom: '12px' }}>
            Reset Link Invalid
          </h1>
          <p style={{ color: '#4b5563', textAlign: 'center', marginBottom: '24px' }}>
            {error}
          </p>
          <Link
            to="/forgot-password"
            style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#0066cc', color: 'white', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600' }}
          >
            Request New Reset Link
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '448px' }}
      >
        {success ? (
          // Success State
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to right, #16a34a, #15803d)', padding: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <CheckCircle style={{ width: '24px', height: '24px' }} />
                Password Reset Successfully
              </h1>
            </div>

            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle style={{ width: '32px', height: '32px', color: '#059669' }} />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                You're All Set!
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '24px' }}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>

              <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#166534' }}>
                Redirecting to login page in a moment...
              </div>

              <Link
                to="/staff-login"
                style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#0066cc', color: 'white', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600' }}
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          // Reset Form
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(to right, #0066cc, #0052a3)', padding: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Lock style={{ width: '24px', height: '24px' }} />
                Create New Password
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '8px' }}>
                Enter a new password for your account
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '32px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px', paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: validations.length ? '#16a34a' : '#6b7280' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: validations.length ? '#16a34a' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white' }}>
                        {validations.length ? '✓' : ''}
                      </div>
                      At least 6 characters
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '14px', paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      {showConfirm ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>

                  {/* Password Match Check */}
                  {formData.confirmPassword && (
                    <div style={{ marginTop: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: validations.match ? '#16a34a' : '#dc2626' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: validations.match ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white' }}>
                        {validations.match ? '✓' : '✕'}
                      </div>
                      {validations.match ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  )}
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
                  disabled={loading || !validations.length || !validations.match}
                  style={{ width: '100%', padding: '12px', backgroundColor: loading || !validations.length || !validations.match ? '#a3a3a3' : '#0066cc', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: loading || !validations.length || !validations.match ? 'not-allowed' : 'pointer', opacity: loading || !validations.length || !validations.match ? 0.5 : 1 }}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </div>

            {/* Footer Info */}
            <div style={{ backgroundColor: '#f9fafb', padding: '16px 32px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', margin: 0 }}>
                🔒 Your password will be securely encrypted and stored.
              </p>
            </div>
          </div>
        )}

        {/* Additional Help */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#4b5563' }}
          >
            <p style={{ margin: 0 }}>
              Remember your password?{' '}
              <Link to="/staff-login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>
                Back to Login
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ResetPassword
