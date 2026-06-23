import { useState, useEffect } from 'react'
import { AlertCircle, Search, Eye, Edit, CheckCircle, Clock, XCircle, Filter, X, Users, FileText } from 'lucide-react'

const GrievancesManagement = () => {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedGrievance, setSelectedGrievance] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Fetch grievances from API
  useEffect(() => {
    fetchGrievances()
    fetchStats()
  }, [statusFilter, categoryFilter])

  const fetchGrievances = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints`
      const params = new URLSearchParams()
      
      if (statusFilter) params.append('status', statusFilter)
      if (categoryFilter) params.append('category', categoryFilter)
      params.append('limit', '50')
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      console.log('🔄 Fetching grievances from:', url)

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Grievances data:', result)
        setGrievances(result.data || [])
      } else {
        const errorText = await response.text()
        console.error('❌ Failed to fetch grievances:', response.status, errorText)
      }
    } catch (error) {
      console.error('❌ Error fetching grievances:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setStats({
            total: result.data.total || 0,
            submitted: result.data.submitted || 0,
            inProgress: result.data.inProgress || 0,
            resolved: result.data.resolved || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'submitted': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Submitted', icon: Clock },
      'under_review': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review', icon: Eye },
      'assigned': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Assigned', icon: Edit },
      'in_progress': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'In Progress', icon: AlertCircle },
      'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved', icon: CheckCircle },
      'closed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed', icon: XCircle },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: XCircle }
    }
    
    return statusMap[status] || statusMap['submitted']
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-KE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewDetails = async (grievance) => {
    setSelectedGrievance(grievance)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedGrievance(null)
  }

  // Filter grievances by search term
  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = 
      grievance.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Grievances Management</h2>
        <p className="text-gray-600 mt-1">Monitor and manage citizen grievances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Grievances</span>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">All submissions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Pending Review</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.submitted}</p>
          <p className="text-sm text-yellow-600 mt-1">Needs attention</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">In Progress</span>
            <Edit className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-sm text-orange-600 mt-1">Being handled</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Resolved</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
          <p className="text-sm text-green-600 mt-1">Completed</p>
        </div>
      </div>

      {/* Grievances Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Grievances</h3>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search grievances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="Service Delivery Failure">Service Delivery</option>
                <option value="Staff Misconduct">Staff Misconduct</option>
                <option value="Corruption">Corruption</option>
                <option value="Infrastructure Issues">Infrastructure</option>
                <option value="Environmental Concerns">Environment</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            Loading grievances...
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No grievances found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complainant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrievances.map((grievance) => {
                  const statusInfo = getStatusBadge(grievance.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <tr key={grievance.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{grievance.reference_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{grievance.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{grievance.location || 'No location'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{grievance.contact_name}</div>
                        <div className="text-xs text-gray-500">{grievance.contact_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{grievance.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(grievance.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => viewDetails(grievance)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      {grievances.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Email Notifications Active</p>
              <p className="mt-1">
                Administrators are automatically notified via email when new grievances are submitted. 
                Complainants receive confirmation emails with their tracking numbers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Details Modal */}
      {showDetailsModal && selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Grievance Details</h3>
                <p className="text-sm text-gray-600 mt-1">Reference: {selectedGrievance.reference_number}</p>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status and Category */}
              <div className="flex items-center gap-4">
                <div>
                  {(() => {
                    const statusInfo = getStatusBadge(selectedGrievance.status)
                    const StatusIcon = statusInfo.icon
                    return (
                      <span className={`px-4 py-2 inline-flex items-center gap-2 text-sm font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    )
                  })()}
                </div>
                <div className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                  {selectedGrievance.category}
                </div>
              </div>

              {/* Grievance Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Grievance Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subject</p>
                    <p className="text-sm font-medium text-gray-900">{selectedGrievance.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">{selectedGrievance.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedGrievance.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Priority</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedGrievance.priority || 'Medium'}</p>
                  </div>
                </div>
              </div>

              {/* Complainant Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Complainant Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedGrievance.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{selectedGrievance.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">{selectedGrievance.contact_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Attachments Section */}
              {(() => {
                // Extract attachment information from description
                const attachmentMatch = selectedGrievance.description.match(/Attachments:\s*([^\n]+)/i)
                const attachmentText = attachmentMatch ? attachmentMatch[1].trim() : null
                
                return attachmentText && attachmentText !== 'null' && attachmentText !== 'undefined' ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Attachments
                    </h4>
                    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-200">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachmentText}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Uploaded document</p>
                      </div>
                      <div className="text-xs text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        File reference
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Note:</strong> File upload system is being implemented. Currently showing file reference only. 
                        Contact the complainant at <a href={`mailto:${selectedGrievance.contact_email}`} className="underline font-medium">{selectedGrievance.contact_email}</a> to request the actual document.
                      </p>
                    </div>
                  </div>
                ) : null
              })()}

              {/* Assignment Information (if assigned) */}
              {(selectedGrievance.assigned_to || selectedGrievance.assigned_department) && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Assignment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedGrievance.assigned_department && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assigned Department</p>
                        <p className="text-sm font-medium text-gray-900">{selectedGrievance.assigned_department}</p>
                      </div>
                    )}
                    {selectedGrievance.assigned_to && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assigned To</p>
                        <p className="text-sm font-medium text-gray-900">{selectedGrievance.assigned_to}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resolution (if resolved) */}
              {selectedGrievance.resolution_notes && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Resolution</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedGrievance.resolution_notes}
                  </p>
                  {selectedGrievance.resolved_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Resolved on: {formatDateTime(selectedGrievance.resolved_at)}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    onClick={() => alert('Update status functionality coming soon')}
                  >
                    <Edit className="w-4 h-4" />
                    Update Status
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                    onClick={() => alert('Assign functionality coming soon')}
                  >
                    <Users className="w-4 h-4" />
                    Assign
                  </button>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GrievancesManagement
