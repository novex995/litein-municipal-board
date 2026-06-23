import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AlertCircle, MessageSquare, Clock, CheckCircle, LogOut, Menu, X, Home, Search,
  Bell, HelpCircle, ChevronRight, UserCheck, TrendingUp, FileText
} from 'lucide-react'

const GrievancesDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/staff-login')
    }
  }, [navigate])

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:5000/api/dashboard/grievances', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      } else {
        console.error('Failed to fetch dashboard stats')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'complaints', label: 'All Complaints', icon: AlertCircle },
    { id: 'new-complaints', label: 'New Complaints', icon: MessageSquare },
    { id: 'in-progress', label: 'In Progress', icon: Clock },
    { id: 'resolved', label: 'Resolved', icon: CheckCircle },
    { id: 'follow-ups', label: 'Follow Ups', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
  ]

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-bold text-gray-900">Grievances Portal</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className={`p-4 border-b border-gray-200 ${!sidebarOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.full_name?.charAt(0) || 'G'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">Grievance Officer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                    {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                    {sidebarOpen && isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search complaints..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64" />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Complaints</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.totalComplaints || 0}</p>
                      <p className="text-sm text-green-600 mt-2">All time</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">New Complaints</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.newComplaints || 0}</p>
                      <p className="text-sm text-red-600 mt-2">Requires attention</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <MessageSquare className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.inProgress || 0}</p>
                      <p className="text-sm text-yellow-600 mt-2">Being handled</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Resolved</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.resolved || 0}</p>
                      <p className="text-sm text-green-600 mt-2">{loading ? '-' : stats?.resolutionRate || 0}% resolution rate</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-gray-500">Loading complaints...</p>
                    ) : stats?.recentComplaints?.length > 0 ? (
                      stats.recentComplaints.map((complaint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{complaint.title}</p>
                            <p className="text-xs text-gray-500">{complaint.status} • {new Date(complaint.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              complaint.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                              complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {complaint.priority || 'Normal'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No recent complaints</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => setActiveMenu('new-complaints')} className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-3">
                      <MessageSquare className="w-5 h-5" />
                      <span>Review New</span>
                    </button>
                    <button onClick={() => setActiveMenu('in-progress')} className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>Track Progress</span>
                    </button>
                    <button onClick={() => setActiveMenu('analytics')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5" />
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = menuItems.find(item => item.id === activeMenu)?.icon || AlertCircle
                    return <Icon className="w-8 h-8 text-gray-400" />
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-600 mb-6">This section is under development. Content will be available soon.</p>
                <button onClick={() => setActiveMenu('dashboard')} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default GrievancesDashboard
