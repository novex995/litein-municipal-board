import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, LogOut } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    
    if (!userStr) {
      navigate('/staff-login')
      return
    }

    const user = JSON.parse(userStr)
    const role = user.role

    // Redirect based on role
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

    const redirectPath = roleRoutes[role]
    if (redirectPath) {
      navigate(redirectPath, { replace: true })
    } else {
      navigate('/staff-login')
    }
  }, [navigate])

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigate('/staff-login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600 mb-6">Loading your dashboard...</p>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
