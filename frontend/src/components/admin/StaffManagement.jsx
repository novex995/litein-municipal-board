import { useState, useEffect } from 'react'
import { Users, Search, UserPlus, Edit, Trash2, Shield, AlertCircle, CheckCircle, X, Camera, Upload, Building2, Briefcase, Hash } from 'lucide-react'

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionUser, setActionUser] = useState(null)
  const [actionType, setActionType] = useState('') // 'disable', 'enable', 'delete'
  const [processing, setProcessing] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showEditStaffModal, setShowEditStaffModal] = useState(false)
  const [editStaff, setEditStaff] = useState(null)
  const [newStaff, setNewStaff] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'municipal_staff',
    avatar_url: '',
    department: '',
    position: '',
    employee_id: '',
    category: '' // 'board_member' or 'staff_member'
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)

  // Fetch staff list from API
  useEffect(() => {
    fetchStaff()
  }, [roleFilter, statusFilter])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`
      const params = new URLSearchParams()
      
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      console.log('🔄 Fetching staff from:', url)
      console.log('🔑 Token:', token ? 'Present' : 'Missing')

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ API Response:', result)
        setStaffList(result.data || [])
      } else {
        const errorText = await response.text()
        console.error('❌ Failed to fetch staff:', response.status, errorText)
        alert(`Failed to fetch staff: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('❌ Error fetching staff:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    setProcessing(true)
    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_active: newStatus })
        }
      )

      if (response.ok) {
        // Update local state
        setStaffList(prevList =>
          prevList.map(staff =>
            staff.id === userId ? { ...staff, is_active: newStatus } : staff
          )
        )
        showNotification(`User ${newStatus ? 'enabled' : 'disabled'} successfully!`, 'success')
      } else {
        const error = await response.json()
        showNotification(error.error || 'Failed to update user status', 'error')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showNotification('Failed to update user status', 'error')
    } finally {
      setProcessing(false)
      setShowConfirmDialog(false)
      setActionUser(null)
    }
  }

  const handleDelete = async (userId) => {
    setProcessing(true)
    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const result = await response.json()

      if (response.ok) {
        // Remove from local state
        setStaffList(prevList => prevList.filter(staff => staff.id !== userId))
        showNotification('User deleted successfully!', 'success')
      } else {
        // Handle specific error cases
        if (result.suggestion === 'disable') {
          // User has related records - suggest disabling instead
          const shouldDisable = confirm(
            `${result.details || result.error}\n\nWould you like to disable this user account instead? This will prevent login while preserving their data.`
          )
          
          if (shouldDisable) {
            // Close current dialog and trigger disable
            setShowConfirmDialog(false)
            setActionUser(null)
            setProcessing(false)
            // Trigger disable action
            const staff = staffList.find(s => s.id === userId)
            if (staff) {
              openConfirmDialog(staff, 'disable')
            }
            return
          }
        } else {
          showNotification(result.details || result.error || 'Failed to delete user', 'error')
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      showNotification('Failed to delete user. Please try again.', 'error')
    } finally {
      setProcessing(false)
      setShowConfirmDialog(false)
      setActionUser(null)
    }
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const token = localStorage.getItem('auth_token')

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newStaff)
        }
      )

      const result = await response.json()

      if (response.ok) {
        // Reset form and close modal
        setNewStaff({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'municipal_staff',
          avatar_url: '',
          department: '',
          position: '',
          employee_id: '',
          category: ''
        })
        setImagePreview(null)
        setShowAddStaffModal(false)
        
        // Refresh staff list
        fetchStaff()
        
        // Show success notification
        setTimeout(() => {
          showNotification(`${result.data?.full_name || 'Staff member'} has been added successfully!`, 'success')
        }, 300)
      } else {
        // Show specific error from backend
        const errorMessage = result.error || result.message || 'Failed to add staff member'
        console.error('Backend error:', result)
        showNotification(errorMessage, 'error')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      showNotification('Failed to add staff member. Please try again.', 'error')
    } finally {
      setProcessing(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // In production, you would upload to storage and get URL
        setNewStaff({ ...newStaff, avatar_url: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
        setEditStaff({ ...editStaff, avatar_url: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditModal = (staff) => {
    setEditStaff({
      id: staff.id,
      email: staff.email || '',
      full_name: staff.full_name || '',
      phone: staff.phone || '',
      role: staff.role || 'municipal_staff',
      avatar_url: staff.avatar_url || '',
      department: staff.department || '',
      position: staff.position || '',
      employee_id: staff.employee_id || ''
    })
    setEditImagePreview(staff.avatar_url || null)
    setShowEditStaffModal(true)
  }

  const handleEditStaff = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const token = localStorage.getItem('auth_token')

      // Prepare update data (exclude password and id)
      const updateData = {
        full_name: editStaff.full_name,
        phone: editStaff.phone,
        role: editStaff.role,
        avatar_url: editStaff.avatar_url,
        department: editStaff.department,
        position: editStaff.position,
        employee_id: editStaff.employee_id
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${editStaff.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      )

      if (response.ok) {
        const result = await response.json()
        
        // Update local state
        setStaffList(prevList =>
          prevList.map(staff =>
            staff.id === editStaff.id ? { ...staff, ...updateData } : staff
          )
        )
        
        // Reset and close modal
        setEditStaff(null)
        setEditImagePreview(null)
        setShowEditStaffModal(false)
        
        // Refresh staff list to get latest data
        fetchStaff()
        
        // Show success message AFTER modal closes
        setTimeout(() => {
          showNotification(`${editStaff.full_name} has been updated successfully!`, 'success')
        }, 300)
      } else {
        const error = await response.json()
        showNotification(error.error || 'Failed to update staff member', 'error')
      }
    } catch (error) {
      console.error('Error updating staff:', error)
      showNotification('Failed to update staff member. Please try again.', 'error')
    } finally {
      setProcessing(false)
    }
  }

  // Notification system
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const openConfirmDialog = (user, type) => {
    setActionUser(user)
    setActionType(type)
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (!actionUser) return

    if (actionType === 'disable') {
      handleStatusChange(actionUser.id, false)
    } else if (actionType === 'enable') {
      handleStatusChange(actionUser.id, true)
    } else if (actionType === 'delete') {
      handleDelete(actionUser.id)
    }
  }

  // Filter staff by search term
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = 
      staff.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800'
      case 'municipal_manager':
        return 'bg-blue-100 text-blue-800'
      case 'department_head':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role) => {
    const roleMap = {
      'super_admin': 'Super Admin',
      'municipal_manager': 'Manager',
      'department_head': 'Dept Head',
      'municipal_staff': 'Staff',
      'citizen': 'Citizen'
    }
    return roleMap[role] || role
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600 mt-1">Manage municipal staff members and their accounts</p>
        </div>
        <button
          onClick={() => setShowAddStaffModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add New Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Staff</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{staffList.length}</p>
          <p className="text-sm text-gray-500 mt-1">All accounts</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Active</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {staffList.filter(s => s.is_active !== false).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Can log in</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Disabled</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {staffList.filter(s => s.is_active === false).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Blocked access</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Admins</span>
            <Shield className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {staffList.filter(s => s.role === 'super_admin' || s.role === 'municipal_manager').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Admin roles</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Staff Members</h3>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="municipal_manager">Manager</option>
                <option value="department_head">Dept Head</option>
                <option value="municipal_staff">Staff</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading staff members...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No staff members found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {staff.full_name?.charAt(0) || staff.email?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.full_name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">ID: {staff.id?.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(staff.role)}`}>
                        {getRoleLabel(staff.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.is_active !== false ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => openEditModal(staff)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      
                      {staff.is_active !== false ? (
                        <button 
                          onClick={() => openConfirmDialog(staff, 'disable')}
                          className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1"
                          disabled={processing}
                        >
                          <AlertCircle className="w-4 h-4" />
                          Disable
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => openConfirmDialog(staff, 'enable')}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                            disabled={processing}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Enable
                          </button>
                          <button 
                            onClick={() => openConfirmDialog(staff, 'delete')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            disabled={processing}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && actionUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {actionType === 'delete' ? (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                ) : actionType === 'disable' ? (
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {actionType === 'delete' && 'Delete User Account'}
                    {actionType === 'disable' && 'Disable User Account'}
                    {actionType === 'enable' && 'Enable User Account'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {actionUser.full_name} ({actionUser.email})
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${
                actionType === 'delete' ? 'bg-red-50 border border-red-200' :
                actionType === 'disable' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <p className="text-sm text-gray-700">
                  {actionType === 'delete' && (
                    <>
                      <strong>Warning:</strong> This will permanently delete the user account. 
                      This action cannot be undone. All user data will be removed from the system.
                    </>
                  )}
                  {actionType === 'disable' && (
                    <>
                      This will prevent {actionUser.full_name} from logging in. 
                      Their data will be preserved and you can re-enable the account later.
                    </>
                  )}
                  {actionType === 'enable' && (
                    <>
                      This will allow {actionUser.full_name} to log in again. 
                      They will regain access to their dashboard and functions.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false)
                    setActionUser(null)
                  }}
                  disabled={processing}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={processing}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'disable' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-green-600 hover:bg-green-700'
                  } disabled:opacity-50`}
                >
                  {processing ? 'Processing...' : 
                    actionType === 'delete' ? 'Delete Permanently' :
                    actionType === 'disable' ? 'Disable Account' :
                    'Enable Account'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Add New Staff Member</h3>
                  <p className="text-green-100 text-sm mt-0.5">Fill in the details to create a new staff account</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddStaffModal(false)
                  setImagePreview(null)
                  setNewStaff({
                    email: '',
                    password: '',
                    full_name: '',
                    phone: '',
                    role: 'municipal_staff',
                    avatar_url: '',
                    department: '',
                    position: '',
                    employee_id: '',
                    category: ''
                  })
                }}
                disabled={processing}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddStaff} className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8 space-y-8">
                
                {/* Profile Photo Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-600" />
                        Profile Photo
                      </h4>
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-green-500 transition-all cursor-pointer text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Square image, 400x400px min. JPG/PNG (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Selection - NEW */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Category Selection
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Is this person a Board Member or Staff Member? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setNewStaff({ 
                            ...newStaff, 
                            category: 'board_member',
                            department: 'Board Leadership' // Auto-set department
                          })
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          newStaff.category === 'board_member'
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-300 bg-white hover:border-blue-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">🏛️</div>
                          <div className={`font-semibold ${
                            newStaff.category === 'board_member' ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            Board Member
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Will appear on Board Leadership page
                          </div>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setNewStaff({ 
                            ...newStaff, 
                            category: 'staff_member',
                            department: '' // Reset department
                          })
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          newStaff.category === 'staff_member'
                            ? 'border-green-600 bg-green-50 shadow-md'
                            : 'border-gray-300 bg-white hover:border-green-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">👥</div>
                          <div className={`font-semibold ${
                            newStaff.category === 'staff_member' ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            Staff Member
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Regular municipal staff
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStaff.full_name}
                        onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        placeholder="e.g., John Kamau Mwangi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={newStaff.employee_id}
                          onChange={(e) => setNewStaff({ ...newStaff, employee_id: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                          placeholder="e.g., EMP-2026-001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        placeholder="john.kamau@litein.go.ke"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        placeholder="+254 712 345 678"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Employment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position/Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStaff.position}
                        onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        placeholder="e.g., Senior ICT Officer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={newStaff.department}
                          onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                          disabled={!newStaff.category || newStaff.category === 'board_member'}
                        >
                          {!newStaff.category && <option value="">First select category above</option>}
                          
                          {newStaff.category === 'board_member' && (
                            <option value="Board Leadership">Board Leadership</option>
                          )}
                          
                          {newStaff.category === 'staff_member' && (
                            <>
                              <option value="">Select Department</option>
                              <option value="Agriculture, Livestock and Fisheries">Agriculture, Livestock and Fisheries</option>
                              <option value="Health Services">Health Services</option>
                              <option value="Water, Environment, Energy">Water, Environment, Energy</option>
                              <option value="ICT & E-Governance">ICT & E-Governance</option>
                              <option value="Public Works, Roads and Transport">Public Works, Roads and Transport</option>
                              <option value="Public Service Management">Public Service Management</option>
                              <option value="Trade & Industrialization">Trade & Industrialization</option>
                              <option value="Finance and Economic Planning">Finance and Economic Planning</option>
                              <option value="Education & Social Services">Education & Social Services</option>
                              <option value="Lands & Housing">Lands & Housing</option>
                            </>
                          )}
                        </select>
                      </div>
                      {newStaff.category === 'board_member' && (
                        <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                          <span>ℹ️</span>
                          <span>Board members are automatically assigned to "Board Leadership"</span>
                        </p>
                      )}
                      {!newStaff.category && (
                        <p className="text-xs text-gray-500 mt-2">
                          Please select a category above first
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={newStaff.role}
                          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                        >
                          <option value="municipal_staff">Staff Member</option>
                          <option value="department_head">Department Head</option>
                          <option value="municipal_manager">Municipal Manager</option>
                          <option value="super_admin">Super Administrator</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Determines access level and permissions in the system
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        placeholder="Minimum 8 characters"
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Staff will be required to change this on first login
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Important Information</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Login credentials will be sent to the staff member's email</li>
                        <li>They must change their password on first login</li>
                        <li>Account will be active immediately after creation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-6 flex items-center justify-end gap-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStaffModal(false)
                    setImagePreview(null)
                  }}
                  disabled={processing}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding Staff...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Add Staff Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Staff Modal */}
      {showEditStaffModal && editStaff && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Edit Staff Member</h3>
                  <p className="text-blue-100 text-sm mt-0.5">Update staff information and details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditStaffModal(false)
                  setEditStaff(null)
                  setEditImagePreview(null)
                }}
                disabled={processing}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleEditStaff} className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8 space-y-8">
                
                {/* Profile Photo Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {editImagePreview ? (
                          <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-3xl font-bold">
                            {editStaff.full_name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        id="edit-avatar-upload"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-600" />
                        Profile Photo
                      </h4>
                      <label
                        htmlFor="edit-avatar-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all cursor-pointer text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Change Photo
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Square image, 400x400px min. JPG/PNG (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editStaff.full_name}
                        onChange={(e) => setEditStaff({ ...editStaff, full_name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        placeholder="e.g., John Kamau Mwangi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editStaff.employee_id}
                          onChange={(e) => setEditStaff({ ...editStaff, employee_id: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                          placeholder="e.g., EMP-2026-001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editStaff.email}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        placeholder="john.kamau@litein.go.ke"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={editStaff.phone}
                        onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        placeholder="+254 712 345 678"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Employment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position/Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editStaff.position}
                        onChange={(e) => setEditStaff({ ...editStaff, position: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        placeholder="e.g., Senior ICT Officer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={editStaff.department}
                          onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Board Leadership">Board Leadership</option>
                          <option value="Agriculture, Livestock and Fisheries">Agriculture, Livestock and Fisheries</option>
                          <option value="Health Services">Health Services</option>
                          <option value="Water, Environment, Energy">Water, Environment, Energy</option>
                          <option value="ICT & E-Governance">ICT & E-Governance</option>
                          <option value="Public Works, Roads and Transport">Public Works, Roads and Transport</option>
                          <option value="Public Service Management">Public Service Management</option>
                          <option value="Trade & Industrialization">Trade & Industrialization</option>
                          <option value="Finance and Economic Planning">Finance and Economic Planning</option>
                          <option value="Education & Social Services">Education & Social Services</option>
                          <option value="Lands & Housing">Lands & Housing</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={editStaff.role}
                          onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                        >
                          <option value="municipal_staff">Staff Member</option>
                          <option value="department_head">Department Head</option>
                          <option value="municipal_manager">Municipal Manager</option>
                          <option value="super_admin">Super Administrator</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Determines access level and permissions in the system
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-900">
                      <p className="font-semibold mb-1">Update Information</p>
                      <ul className="list-disc list-inside space-y-1 text-amber-800">
                        <li>Email address cannot be changed for security reasons</li>
                        <li>Changes will take effect immediately</li>
                        <li>Staff member will be notified of role changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-6 flex items-center justify-end gap-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStaffModal(false)
                    setEditStaff(null)
                    setEditImagePreview(null)
                  }}
                  disabled={processing}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Update Staff Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[320px] ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffManagement
