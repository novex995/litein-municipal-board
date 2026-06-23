import { useState, useEffect } from 'react'
import { 
  Activity, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  RefreshCw,
  User,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Clock,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react'
import axios from 'axios'
import { API_URL, ACTIVITY_LOG_ENDPOINTS } from '../config/api'

const ActivityLog = () => {
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    action: 'all',
    entity_type: 'all',
    search: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  })
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Fetch activity logs
  const fetchActivityLogs = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await axios.get(`${API_URL}${ACTIVITY_LOG_ENDPOINTS.LIST}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setActivities(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}${ACTIVITY_LOG_ENDPOINTS.STATS}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Export activity logs
  const handleExport = async () => {
    try {
      setExporting(true)
      const token = localStorage.getItem('token')
      
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && key !== 'page' && key !== 'limit') {
          params.append(key, value)
        }
      })

      const response = await axios.get(
        `${API_URL}${ACTIVITY_LOG_ENDPOINTS.EXPORT}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `activity-logs-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exporting logs:', error)
    } finally {
      setExporting(false)
    }
  }

  // Load data on mount and filter change
  useEffect(() => {
    fetchActivityLogs()
    fetchStats()
  }, [filters.action, filters.entity_type, filters.start_date, filters.end_date, filters.page])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchActivityLogs()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchActivityLogs(false)
    fetchStats()
  }

  // Get icon for action type
  const getActionIcon = (action) => {
    switch (action) {
      case 'login': return <LogIn className="w-4 h-4" />
      case 'logout': return <LogOut className="w-4 h-4" />
      case 'create': return <Plus className="w-4 h-4" />
      case 'update': return <Edit className="w-4 h-4" />
      case 'delete': return <Trash2 className="w-4 h-4" />
      case 'view': return <Eye className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  // Get color for action type
  const getActionColor = (action) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800 border-green-200'
      case 'logout': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'create': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'update': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'delete': return 'bg-red-100 text-red-800 border-red-200'
      case 'view': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-gray-600 mt-1">Track system activities and user actions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Activities</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {stats.totalActivities.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <Activity className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Last 24 Hours</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.last24Hours.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Users</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {stats.topUsers?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Actions Today</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  {Object.values(stats.byAction).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Filter */}
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
            </select>

            {/* Entity Type Filter */}
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({ ...filters, entity_type: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="auth">Authentication</option>
              <option value="user">Users</option>
              <option value="complaint">Complaints</option>
              <option value="project">Projects</option>
              <option value="news">News</option>
              <option value="settings">Settings</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value, page: 1 })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.search || filters.action !== 'all' || filters.entity_type !== 'all' || filters.start_date) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Search: {filters.search}
                </span>
              )}
              {filters.action !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Action: {filters.action}
                </span>
              )}
              {filters.entity_type !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  Type: {filters.entity_type}
                </span>
              )}
              {filters.start_date && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  From: {filters.start_date}
                </span>
              )}
              <button
                onClick={() => setFilters({
                  action: 'all',
                  entity_type: 'all',
                  search: '',
                  start_date: '',
                  end_date: '',
                  page: 1,
                  limit: 20
                })}
                className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Activity List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Action Icon */}
                    <div className={`p-2 rounded-lg border ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {activity.user_name || activity.user_email}
                            </span>
                            {activity.entity_type && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {activity.entity_type}
                              </span>
                            )}
                            {activity.ip_address && (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {activity.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} activities
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                          let pageNum
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i
                          } else {
                            pageNum = pagination.page - 2 + i
                          }
                          
                          return (
                            <button
                              key={i}
                              onClick={() => setFilters({ ...filters, page: pageNum })}
                              className={`w-10 h-10 rounded-lg text-sm font-medium ${
                                pagination.page === pageNum
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>
                      
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityLog
