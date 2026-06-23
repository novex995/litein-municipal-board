import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, AlertCircle, CheckCircle, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'

const StaffLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setStatus({
          type: 'error',
          message: 'Please enter your email and password'
        })
        setIsSubmitting(false)
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setStatus({
          type: 'error',
          message: 'Please enter a valid email address'
        })
        setIsSubmitting(false)
        return
      }

      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data.error || 'Login failed. Please check your credentials.'
        })
        setIsSubmitting(false)
        return
      }

      // Store token and user info
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setStatus({
        type: 'success',
        message: 'Login successful! Redirecting...'
      })
      
      // Immediately redirect with role-based routing
      const roleRoutes = {
        'super_admin': '/admin/dashboard',
        'municipal_manager': '/manager/dashboard',
        'department_head': '/department-head/dashboard',
        'municipal_staff': '/staff/dashboard',
        'finance_officer': '/finance/dashboard',
        'licensing_officer': '/licenses/dashboard',
        'grievance_officer': '/grievances/dashboard',
        'ict_officer': '/ict/dashboard',
        'content_editor': '/media/dashboard',
        'customer_service_officer': '/citizen-service/dashboard'
      }
      
      const redirectPath = roleRoutes[data.user.role] || '/dashboard'
      navigate(redirectPath)

      // Reset form
      setFormData({
        email: '',
        password: ''
      })
    } catch (error) {
      console.error('Login error:', error)
      setStatus({
        type: 'error',
        message: 'Login failed. Please make sure the server is running.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/kenya-kericho-logos.png" 
              alt="Kenya and Kericho County Logos" 
              className="h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LITEIN MUNICIPAL BOARD</h1>
          <p className="text-gray-600 text-lg font-medium">Authorized Staff Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Content */}
          <div className="p-8">
            {/* Status Messages */}
            {status.message && (
              <div className={`p-4 rounded-lg mb-6 border-l-4 flex items-start gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@liteinmunicipal.go.ke"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-xs text-blue-900">
                <strong>🔒 Secure Login:</strong> This is a secure login portal. Never share your credentials with anyone. Litein Municipality will never ask for your password via email or phone.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Don't have access? <a href="/contact" className="text-green-600 hover:text-green-700 font-medium">Contact IT Support</a>
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">Need assistance?</p>
          <div className="flex gap-3 justify-center">
            <a href="/contact" className="px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:border-green-600 hover:text-green-600 transition-colors font-medium text-sm">
              Help Center
            </a>
            <a href="/" className="px-4 py-2 text-green-600 font-medium text-sm hover:text-green-700">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffLogin
