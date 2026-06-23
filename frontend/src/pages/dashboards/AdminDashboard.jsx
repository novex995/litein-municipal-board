import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  UserPlus, 
  Settings, 
  BarChart3, 
  Activity,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  ShieldCheck,
  Bell,
  HelpCircle,
  ChevronRight,
  Search
} from 'lucide-react'
import NewsManagement from '../../components/admin/NewsManagement'
import ProjectsManagement from '../../components/admin/ProjectsManagement'
import StaffManagement from '../../components/admin/StaffManagement'
import GrievancesManagement from '../../components/admin/GrievancesManagement'
import ReportsManagement from '../../components/admin/ReportsManagement'
import ActivityLog from '../../components/ActivityLog'
import SystemSettings from '../../components/SystemSettings'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'municipal_staff',
    department: '',
    password: 'Password@2026'
  })
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeComplaints: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    recentActivities: []
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // If no user, redirect to login
      navigate('/staff-login')
    }
  }, [navigate])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          console.error('No auth token found')
          return
        }

        console.log('🔄 Fetching dashboard stats from API...')

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('📡 API Response status:', response.status)

        if (response.ok) {
          const result = await response.json()
          console.log('📊 API Response data:', result)
          
          if (result.success && result.data) {
            console.log('✅ Setting dashboard stats:', result.data)
            setDashboardStats(result.data)
          } else {
            console.error('⚠️ API response missing success or data:', result)
          }
        } else {
          const errorText = await response.text()
          console.error('❌ Failed to fetch dashboard stats:', response.status, errorText)
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    // Redirect to home
    navigate('/')
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    
    try {
      // TODO: Replace with actual API call to backend
      console.log('Adding new staff:', newStaff)
      
      // For now, show success message
      alert(`Staff member ${newStaff.fullName} has been added successfully!`)
      
      // Reset form and close modal
      setNewStaff({
        fullName: '',
        email: '',
        phone: '',
        role: 'municipal_staff',
        department: '',
        password: 'Password@2026'
      })
      setShowAddStaffModal(false)
      
      // TODO: Refresh staff list from backend
    } catch (error) {
      console.error('Error adding staff:', error)
      alert('Failed to add staff member. Please try again.')
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'manage-news', label: 'Manage News', icon: FileText },
    { id: 'manage-staff', label: 'Manage Staff', icon: UserPlus },
    { id: 'grievances', label: 'Grievances', icon: AlertCircle },
    { id: 'projects', label: 'Projects', icon: Building2 },
    { id: 'view-reports', label: 'View Reports', icon: BarChart3 },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
    { id: 'activity-log', label: 'Activity Log', icon: Activity },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ]

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-bold text-gray-900">Litein Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-gray-200 ${!sidebarOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
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
                      isActive
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                    {sidebarOpen && isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Help */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Users */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loadingStats ? '...' : dashboardStats.totalUsers}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Registered citizens & staff</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Active Grievances */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Active Grievances</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loadingStats ? '...' : dashboardStats.activeComplaints}
                      </p>
                      <p className="text-sm text-red-600 mt-2">Require attention</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Active Projects</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loadingStats ? '...' : dashboardStats.activeProjects}
                      </p>
                      <p className="text-sm text-green-600 mt-2">In progress</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Pending Approvals</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loadingStats ? '...' : dashboardStats.pendingApprovals}
                      </p>
                      <p className="text-sm text-yellow-600 mt-2">Needs attention</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Grievances */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Grievances</h3>
                    <button 
                      onClick={() => setActiveMenu('grievances')}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {loadingStats ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading grievances...</p>
                      </div>
                    ) : dashboardStats.recentActivities.filter(a => a.type === 'warning').length > 0 ? (
                      dashboardStats.recentActivities.filter(a => a.type === 'warning').map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{activity.user}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                New Submission
                              </span>
                              <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveMenu('grievances')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No recent grievances</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveMenu('manage-staff')}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left flex items-center gap-3"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Add New Staff</span>
                    </button>
                    <button 
                      onClick={() => setActiveMenu('grievances')}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-left flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Review Grievances</span>
                    </button>
                    <button 
                      onClick={() => setActiveMenu('view-reports')}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left flex items-center gap-3"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Generate Report</span>
                    </button>
                    <button 
                      onClick={() => setActiveMenu('system-settings')}
                      className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left flex items-center gap-3"
                    >
                      <Settings className="w-5 h-5" />
                      <span>System Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'manage-news' && (
            <div>
              <NewsManagement />
            </div>
          )}

          {activeMenu === 'manage-staff' && (
            <div>
              <StaffManagement />
            </div>
          )}

          {activeMenu === 'view-reports' && (
            <ReportsManagement />
          )}

          {activeMenu === 'grievances' && (
            <GrievancesManagement />
          )}

          {activeMenu === 'projects' && (
            <ProjectsManagement />
          )}

          {activeMenu === 'system-settings' && (
            <SystemSettings />
          )}

          {activeMenu === 'activity-log' && (
            <ActivityLog />
          )}

          {activeMenu === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                <p className="text-gray-600 mt-1">Manage security and access control</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Policy */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Password Policy
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Minimum length', value: '12 characters' },
                      { label: 'Require uppercase', value: 'Enabled' },
                      { label: 'Require numbers', value: 'Enabled' },
                      { label: 'Require symbols', value: 'Enabled' },
                      { label: 'Password expiry', value: '90 days' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Update Policy
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔐</span>
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to staff accounts
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Optional
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Enabled Accounts</span>
                      <span className="text-sm font-medium text-gray-900">2 of 10</span>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Configure 2FA
                    </button>
                  </div>
                </div>

                {/* Session Management */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    Session Management
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Session timeout', value: '30 minutes' },
                      { label: 'Max concurrent sessions', value: '2 devices' },
                      { label: 'Remember me duration', value: '7 days' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Update Settings
                    </button>
                  </div>
                </div>

                {/* Login Attempts */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚫</span>
                    Login Security
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Max failed attempts', value: '5 tries' },
                      { label: 'Account lockout duration', value: '30 minutes' },
                      { label: 'IP whitelist', value: 'Disabled' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Configure Security
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Alerts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
                <div className="space-y-3">
                  {[
                    { event: 'Failed login attempt', user: 'Unknown', ip: '192.168.1.105', time: '5 min ago', severity: 'warning' },
                    { event: 'Password changed', user: 'manager@litein.go.ke', ip: '192.168.1.100', time: '2 hours ago', severity: 'info' },
                    { event: 'New device login', user: 'admin@litein.go.ke', ip: '192.168.1.101', time: '1 day ago', severity: 'info' },
                  ].map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{alert.event}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.user} • IP: {alert.ip} • {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!['dashboard', 'manage-news', 'manage-staff', 'view-reports', 'grievances', 'projects', 'system-settings', 'activity-log', 'security'].includes(activeMenu) && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = menuItems.find(item => item.id === activeMenu)?.icon || Settings
                    return <Icon className="w-8 h-8 text-gray-400" />
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-600 mb-6">
                  This section is under development. Content will be available soon.
                </p>
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New Staff Member</h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddStaff} className="p-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="staffname@litein.go.ke"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use official @litein.go.ke email address</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0800-720-XXX"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <optgroup label="Management">
                      <option value="super_admin">Super Administrator</option>
                      <option value="municipal_manager">Municipal Manager</option>
                    </optgroup>
                    <optgroup label="Department Heads">
                      <option value="department_head">Department Head</option>
                      <option value="dept_head_public_works">Dept Head - Public Works</option>
                      <option value="dept_head_health">Dept Head - Health Services</option>
                      <option value="dept_head_finance">Dept Head - Finance</option>
                      <option value="dept_head_planning">Dept Head - Planning</option>
                    </optgroup>
                    <optgroup label="Officers">
                      <option value="finance_officer">Finance Officer</option>
                      <option value="license_officer">License Officer</option>
                      <option value="grievance_officer">Grievance Officer</option>
                      <option value="ict_officer">ICT Officer</option>
                      <option value="media_officer">Media Officer</option>
                      <option value="citizen_service_officer">Citizen Service Officer</option>
                      <option value="procurement_officer">Procurement Officer</option>
                      <option value="revenue_officer">Revenue Officer</option>
                      <option value="legal_officer">Legal Officer</option>
                    </optgroup>
                    <optgroup label="Other Staff">
                      <option value="municipal_staff">Municipal Staff</option>
                      <option value="clerk">Clerk</option>
                      <option value="assistant">Assistant</option>
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select appropriate role based on responsibilities</p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department/Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Finance Officer, ICT Officer, Public Works"
                  />
                </div>

                {/* Default Password Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Default Password</p>
                      <p className="text-sm text-blue-700 mt-1">
                        The default password <span className="font-mono font-semibold">Password@2026</span> will be assigned to this account.
                        The user should change it after first login.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
