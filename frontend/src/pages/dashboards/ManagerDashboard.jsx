import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, AlertCircle, TrendingUp, BarChart3, LogOut, Menu, X, Home,
  Building2, Bell, HelpCircle, ChevronRight, Search, CheckCircle, Clock, DollarSign,
  FileText, Target, Calendar, MessageSquare, FolderOpen, Settings, Download,
  Filter, ThumbsUp, Award, Briefcase
} from 'lucide-react'

const ManagerDashboard = () => {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/manager`, {
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
    { id: 'my-tasks', label: 'My Tasks', icon: CheckCircle, badge: 5 },
    { id: 'project-oversight', label: 'Project Oversight', icon: Building2 },
    { id: 'department-monitoring', label: 'Department Monitoring', icon: Users },
    { id: 'financial-summary', label: 'Financial Summary', icon: DollarSign },
    { id: 'complaint-review', label: 'Complaint Review', icon: AlertCircle, badge: 8 },
    { id: 'staff-performance', label: 'Staff Performance', icon: Award },
    { id: 'strategic-reports', label: 'Strategic Reports', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
  ]

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-bold text-gray-900">Manager Portal</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className={`p-4 border-b border-gray-200 ${!sidebarOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.full_name?.charAt(0) || 'M'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">Municipal Manager</p>
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${
                      isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {sidebarOpen && isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
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

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeMenu === 'dashboard' && (
            <>
              {/* KPI Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Active Projects</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.activeProjects || 0}</p>
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        85% completion rate
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Revenue Collection</p>
                      <p className="text-3xl font-bold text-gray-900">KES 12.4M</p>
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +18% this month
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Pending Approvals</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.pendingApprovals || 0}</p>
                      <p className="text-sm text-yellow-600 mt-2">Requires immediate action</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Department Performance</p>
                      <p className="text-3xl font-bold text-gray-900">87%</p>
                      <p className="text-sm text-purple-600 mt-2">8 of 9 on target</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Citizen Satisfaction</p>
                      <p className="text-3xl font-bold text-gray-900">92%</p>
                      <p className="text-sm text-indigo-600 mt-2 flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        Excellent rating
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Award className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Open Complaints</p>
                      <p className="text-3xl font-bold text-gray-900">32</p>
                      <p className="text-sm text-red-600 mt-2">8 high priority</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveMenu('project-oversight')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="p-3 bg-blue-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Approve Project</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('complaint-review')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                  >
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Review Complaint</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('strategic-reports')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="p-3 bg-green-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Generate Report</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('my-tasks')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Assign Task</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Tasks Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Pending Approvals Table */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          Pending Approvals
                        </h3>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            { project: 'Road Rehabilitation - Main Street', dept: 'Public Works', amount: 'KES 2.5M', priority: 'High' },
                            { project: 'Water Supply Extension', dept: 'Utilities', amount: 'KES 1.8M', priority: 'Medium' },
                            { project: 'Market Stall Construction', dept: 'Trade', amount: 'KES 950K', priority: 'High' },
                          ].map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.project}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{item.dept}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.amount}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.priority}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                    Approve
                                  </button>
                                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                                    Review
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Recent Activities
                    </h3>
                    <div className="space-y-4">
                      {loading ? (
                        <p className="text-gray-500">Loading activities...</p>
                      ) : stats?.recentActivities?.length > 0 ? (
                        stats.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">{activity.status} • {new Date(activity.updated_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No recent activities</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                  {/* Calendar Widget */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      Upcoming Events
                    </h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Board Meeting', date: 'Today, 2:00 PM', type: 'meeting' },
                        { title: 'Budget Review', date: 'Tomorrow, 10:00 AM', type: 'review' },
                        { title: 'Site Visit - Road Project', date: 'Friday, 9:00 AM', type: 'visit' },
                      ].map((event, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            event.type === 'meeting' ? 'bg-blue-500' :
                            event.type === 'review' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-yellow-600" />
                        Notifications
                      </span>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        5
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { msg: 'New project proposal from Public Works', time: '10 min ago', priority: 'high' },
                        { msg: 'Budget report ready for review', time: '1 hour ago', priority: 'medium' },
                        { msg: 'Staff performance report submitted', time: '2 hours ago', priority: 'low' },
                      ].map((notif, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          notif.priority === 'high' ? 'bg-red-50 border-red-500' :
                          notif.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-blue-50 border-blue-500'
                        }`}>
                          <p className="text-sm text-gray-900">{notif.msg}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">This Month</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-90">Projects Approved</span>
                        <span className="text-2xl font-bold">14</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-90">Tasks Completed</span>
                        <span className="text-2xl font-bold">47</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-90">Meetings Attended</span>
                        <span className="text-2xl font-bold">12</span>
                      </div>
                    </div>
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
                    const Icon = menuItems.find(item => item.id === activeMenu)?.icon || Settings
                    return <Icon className="w-8 h-8 text-gray-400" />
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-600 mb-6">This section is under development. Content will be available soon.</p>
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
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

export default ManagerDashboard
