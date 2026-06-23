import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DollarSign, TrendingUp, FileText, CreditCard, LogOut, Menu, X, Home, BarChart3,
  Bell, HelpCircle, ChevronRight, Search, PieChart, Receipt, Wallet, Calendar,
  MessageSquare, FolderOpen, CheckCircle, Clock, Download, Filter, AlertCircle
} from 'lucide-react'

const FinanceDashboard = () => {
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
      const response = await fetch('http://localhost:5000/api/dashboard/finance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error:', error)
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
    { id: 'my-tasks', label: 'My Tasks', icon: CheckCircle, badge: 7 },
    { id: 'revenue-collection', label: 'Revenue Collection', icon: DollarSign },
    { id: 'payment-management', label: 'Payment Management', icon: CreditCard, badge: 12 },
    { id: 'budget-tracking', label: 'Budget Tracking', icon: PieChart },
    { id: 'financial-reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
  ]

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-bold text-gray-900">Finance Portal</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className={`p-4 border-b border-gray-200 ${!sidebarOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.full_name?.charAt(0) || 'F'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">Finance Officer</p>
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
                      isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
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
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg ${!sidebarOpen && 'justify-center'}`}>
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
              <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64" />
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
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Daily Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">KES 487K</p>
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +12% from yesterday
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : `KES ${(stats?.totalRevenue / 1000000).toFixed(1)}M`}</p>
                      <p className="text-sm text-blue-600 mt-2">Target: KES 15M</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Pending Payments</p>
                      <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats?.pendingPayments || 0}</p>
                      <p className="text-sm text-yellow-600 mt-2">KES 2.3M pending</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Budget Utilization</p>
                      <p className="text-3xl font-bold text-gray-900">73%</p>
                      <p className="text-sm text-purple-600 mt-2">KES 365M / 500M</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <PieChart className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Outstanding Balances</p>
                      <p className="text-3xl font-bold text-gray-900">KES 4.2M</p>
                      <p className="text-sm text-red-600 mt-2">87 accounts</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Revenue Trends</p>
                      <p className="text-3xl font-bold text-gray-900">+18%</p>
                      <p className="text-sm text-indigo-600 mt-2">vs last month</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveMenu('payment-management')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                  >
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Record Payment</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('revenue-collection')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Generate Invoice</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('payment-management')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Approve Transaction</span>
                  </button>

                  <button 
                    onClick={() => setActiveMenu('financial-reports')}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Download className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Export Report</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions Table */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-emerald-600" />
                          Recent Transactions
                        </h3>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                          ) : stats?.recentTransactions?.length > 0 ? (
                            stats.recentTransactions.map((transaction, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">TXN-{1000 + index}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{transaction.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">KES 5,000</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Revenue
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No transactions</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                  {/* Pending Approvals */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        Pending Approvals
                      </span>
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">7</span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { desc: 'Vendor Payment - ABC Suppliers', amount: 'KES 125K', priority: 'high' },
                        { desc: 'Refund Request - Citizen', amount: 'KES 2.5K', priority: 'medium' },
                        { desc: 'Budget Allocation - Health Dept', amount: 'KES 500K', priority: 'high' },
                      ].map((item, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          item.priority === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                        }`}>
                          <p className="text-sm font-medium text-gray-900">{item.desc}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.amount}</p>
                          <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">Review →</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Overview */}
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Budget Status</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm opacity-90">Revenue</span>
                          <span className="text-sm font-semibold">83%</span>
                        </div>
                        <div className="w-full bg-emerald-700 rounded-full h-2">
                          <div className="bg-white rounded-full h-2" style={{width: '83%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm opacity-90">Expenditure</span>
                          <span className="text-sm font-semibold">71%</span>
                        </div>
                        <div className="w-full bg-emerald-700 rounded-full h-2">
                          <div className="bg-white rounded-full h-2" style={{width: '71%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Summary */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Transactions</span>
                        <span className="text-lg font-bold text-gray-900">142</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Processed</span>
                        <span className="text-lg font-bold text-green-600">KES 487K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="text-lg font-bold text-yellow-600">KES 89K</span>
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
                    const Icon = menuItems.find(item => item.id === activeMenu)?.icon || DollarSign
                    return <Icon className="w-8 h-8 text-gray-400" />
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-600 mb-6">This module is under development. Content will be available soon.</p>
                <button onClick={() => setActiveMenu('dashboard')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
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

export default FinanceDashboard
