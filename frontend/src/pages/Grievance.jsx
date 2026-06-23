import { useState } from 'react'
import { AlertCircle, CheckCircle, Send, FileText, Clock, CheckSquare, Users, ArrowRight, Shield, Zap, Search, List } from 'lucide-react'

const Grievance = () => {
  const [activeTab, setActiveTab] = useState('process')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ward: '',
    id_number: '',
    grievance_type: '',
    department: '',
    subject: '',
    description: '',
    date_occurred: '',
    attachments: null
  })
  
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState({ type: '', message: '' })
  const [isTracking, setIsTracking] = useState(false)
  const [complaintData, setComplaintData] = useState(null)

  // Sample resolved complaints data
  const resolvedComplaints = [
    {
      ref: 'LMB-2024-001',
      subject: 'Street Light Malfunction',
      department: 'Infrastructure',
      dateSubmitted: '2024-01-15',
      dateResolved: '2024-01-22',
      status: 'Resolved'
    },
    {
      ref: 'LMB-2024-002',
      subject: 'Waste Collection Delay',
      department: 'Environment',
      dateSubmitted: '2024-01-18',
      dateResolved: '2024-01-25',
      status: 'Resolved'
    },
    {
      ref: 'LMB-2024-003',
      subject: 'Road Repair Request',
      department: 'Public Works',
      dateSubmitted: '2024-01-20',
      dateResolved: '2024-02-05',
      status: 'Resolved'
    }
  ]

  const grievanceTypes = [
    'Service Delivery Failure',
    'Staff Misconduct',
    'Corruption',
    'Infrastructure Issues',
    'Land and Property Issues',
    'Environmental Concerns',
    'Planning and Building Issues',
    'Public Health Issues',
    'Financial Irregularities',
    'Other'
  ]

  const departments = [
    'Agriculture, Livestock and Fisheries',
    'Health Services',
    'Water, Environment, Energy, and Natural Resources',
    'Information Communication Technology & E-Governance',
    'Public Works, Roads and Transport',
    'Public Service Management',
    'Trade, Industrialization, Cooperative Management, Tourism and Wildlife',
    'Finance and Economic Planning',
    'Education, Culture and Social Services',
    'Lands, Housing and Physical Planning'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0] ? e.target.files[0].name : null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      // Validate CAPTCHA
      if (!captchaChecked) {
        setStatus({
          type: 'error',
          message: 'Please verify that you are not a robot'
        })
        setIsSubmitting(false)
        return
      }

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.description) {
        setStatus({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        setIsSubmitting(false)
        return
      }

      // Submit to backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit grievance')
      }

      setStatus({
        type: 'success',
        message: `Your grievance has been submitted successfully! A confirmation email with your tracking number (${result.data.reference_number}) has been sent to ${formData.email}. Please check your email for details.`
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ward: '',
        id_number: '',
        grievance_type: '',
        department: '',
        subject: '',
        description: '',
        date_occurred: '',
        attachments: null
      })
      setCaptchaChecked(false)

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Submission error:', error)
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit grievance. Please try again or contact us directly at grievances@liteinmunicipal.go.ke'
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle complaint tracking
  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setTrackingStatus({
        type: 'error',
        message: 'Please enter a tracking number'
      })
      return
    }

    setIsTracking(true)
    setTrackingStatus({ type: '', message: '' })
    setComplaintData(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/reference/${trackingNumber.trim()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Complaint not found')
      }

      setComplaintData(result.data)
      setTrackingStatus({
        type: 'success',
        message: 'Complaint found successfully!'
      })
    } catch (error) {
      console.error('Tracking error:', error)
      setTrackingStatus({
        type: 'error',
        message: error.message || 'Could not find complaint with that tracking number. Please check and try again.'
      })
      setComplaintData(null)
    } finally {
      setIsTracking(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-10 h-10 text-green-200 opacity-80" />
            <Zap className="w-10 h-10 text-green-200 opacity-60" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Grievance Redress Mechanism
          </h1>
          <p className="text-lg text-green-100 mb-4 max-w-3xl leading-relaxed">
            Your voice matters. Litein Municipality is committed to addressing your concerns with transparency, fairness, and swift action.
          </p>
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 w-fit text-sm">
            <CheckSquare className="w-4 h-4 text-green-600" />
            <span className="text-gray-900 font-semibold">Confidential • Transparent • Efficient</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow-md">
          {[
            { id: 'process', icon: Clock, label: 'Grievance Process' },
            { id: 'submit', icon: Send, label: 'Lodge a Complaint' },
            { id: 'track', icon: Search, label: 'Complaint Tracking' },
            { id: 'resolved', icon: CheckSquare, label: 'Log of Resolved Complaints' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submit Grievance Tab */}
        {activeTab === 'submit' && (
          <div className="space-y-8">
            {/* Status Messages */}
            {status.message && (
              <div className={`p-6 rounded-xl border-l-4 backdrop-blur-sm ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}>
                <div className="flex items-start gap-4">
                  {status.type === 'success' ? (
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{status.type === 'success' ? 'Success!' : 'Please Note'}</p>
                    <p className="mt-1 text-sm leading-relaxed">{status.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Section 1: Complainant Information */}
              <div className="p-8 md:p-12 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="+254 712 345 678"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="id_number" className="block text-sm font-semibold text-gray-900">
                      ID/Passport Number
                    </label>
                    <input
                      type="text"
                      id="id_number"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your ID number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ward" className="block text-sm font-semibold text-gray-900">
                      Ward/Location
                    </label>
                    <input
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your ward or location"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date_occurred" className="block text-sm font-semibold text-gray-900">
                      Date Issue Occurred
                    </label>
                    <input
                      type="date"
                      id="date_occurred"
                      name="date_occurred"
                      value={formData.date_occurred}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Grievance Details */}
              <div className="p-8 md:p-12 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Grievance Details</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label htmlFor="grievance_type" className="block text-sm font-semibold text-gray-900">
                        Type of Grievance <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="grievance_type"
                        name="grievance_type"
                        value={formData.grievance_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      >
                        <option value="">Select grievance type</option>
                        {grievanceTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="department" className="block text-sm font-semibold text-gray-900">
                        Department/Office <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Brief subject of your grievance"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="10"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      placeholder="Please provide a detailed description of your grievance. Include what happened, when, where, who was involved, and what resolution you seek..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Be as specific as possible. Include dates, locations, names, and any relevant details.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="attachments" className="block text-sm font-semibold text-gray-900">
                      Supporting Documents <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="attachments"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      📎 Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB)
                    </p>
                  </div>

                  {/* CAPTCHA */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Proof that you are not a robot by ticking the CAPTCHA below
                    </label>
                    <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                      <input
                        type="checkbox"
                        id="captcha"
                        checked={captchaChecked}
                        onChange={(e) => setCaptchaChecked(e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor="captcha" className="text-sm font-medium text-gray-700 cursor-pointer">
                        I'm not a robot
                      </label>
                      <div className="ml-auto">
                        <div className="flex flex-col items-end text-xs text-gray-500">
                          <span>reCAPTCHA</span>
                          <span className="text-[10px]">Privacy - Terms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidentiality Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-8 md:p-12">
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Confidentiality Assured</p>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Your grievance will be handled with strict confidentiality. All information provided will be used solely for grievance resolution purposes. You will receive a reference number for tracking your case.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-8 md:p-12 bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg hover:scale-105 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaint Tracking Tab */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Track Your Complaint</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Enter your complaint tracking number to check the status of your submission.
            </p>

            <div className="max-w-2xl">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter tracking number (e.g., GRV-2026-001)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={handleTrack}
                  disabled={isTracking}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isTracking ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track
                    </>
                  )}
                </button>
              </div>

              {/* Tracking Status Message */}
              {trackingStatus.message && (
                <div className={`p-4 rounded-lg border-l-4 mb-6 ${
                  trackingStatus.type === 'success' 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}>
                  <div className="flex items-start gap-3">
                    {trackingStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm font-medium ${
                      trackingStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {trackingStatus.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Complaint Details */}
              {complaintData && (
                <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{complaintData.title || complaintData.subject}</h3>
                      <p className="text-sm text-gray-600">Reference: <span className="font-mono font-bold text-blue-600">{complaintData.reference_number}</span></p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(complaintData.status)}`}>
                      {complaintData.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-green-200">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Category</p>
                      <p className="text-gray-900 font-semibold">{complaintData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Priority</p>
                      <p className="text-gray-900 font-semibold capitalize">{complaintData.priority || 'Medium'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Date Submitted</p>
                      <p className="text-gray-900 font-semibold">{formatDate(complaintData.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                      <p className="text-gray-900 font-semibold">{formatDate(complaintData.updated_at)}</p>
                    </div>
                  </div>

                  {complaintData.description && (
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
                      <p className="text-gray-900 bg-white p-4 rounded-lg">{complaintData.description}</p>
                    </div>
                  )}

                  {complaintData.resolution_notes && (
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Resolution Notes</p>
                      <p className="text-gray-900 bg-white p-4 rounded-lg">{complaintData.resolution_notes}</p>
                    </div>
                  )}

                  {complaintData.resolved_at && (
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-sm text-gray-600 font-medium">Resolved On</p>
                      <p className="text-gray-900 font-semibold">{formatDate(complaintData.resolved_at)}</p>
                    </div>
                  )}

                  {/* Status Timeline */}
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-600 font-medium mb-3">Status Progress</p>
                    <div className="flex items-center justify-between">
                      {['submitted', 'under_review', 'in_progress', 'resolved'].map((step, index) => {
                        const isActive = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'].indexOf(complaintData.status) >= index
                        const isCurrent = complaintData.status === step || (step === 'in_progress' && complaintData.status === 'assigned')
                        
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCurrent ? 'bg-blue-600 text-white animate-pulse' :
                                isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                              }`}>
                                {isActive && !isCurrent ? <CheckCircle className="w-5 h-5" /> : index + 1}
                              </div>
                              <p className={`text-xs mt-2 text-center font-medium ${
                                isCurrent ? 'text-blue-600' : isActive ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                            {index < 3 && (
                              <div className={`h-1 flex-1 ${isActive ? 'bg-green-600' : 'bg-gray-300'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Your tracking number was provided via email after submitting your complaint. 
                  If you cannot find it, please contact us at <a href="mailto:info@liteinmunicipal.go.ke" className="underline font-semibold">info@liteinmunicipal.go.ke</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Complaints Log Tab */}
        {activeTab === 'resolved' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <List className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Log of Resolved Complaints</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              View the history of complaints that have been successfully resolved by Litein Municipality.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Reference No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date Resolved</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {resolvedComplaints.map((complaint, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{complaint.ref}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{complaint.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{complaint.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{complaint.dateSubmitted}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{complaint.dateResolved}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {resolvedComplaints.length} resolved complaints
              </p>
              <p className="text-sm text-gray-600">
                For more information, contact: <a href="tel:0800-720-464" className="text-green-600 font-semibold">0800-720-464</a>
              </p>
            </div>
          </div>
        )}

        {/* Process & Timeline Tab */}
        {activeTab === 'process' && (
          <div className="space-y-4">
            {/* Grievance Process Flowchart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Stages of the Complaints Management Process</h2>
              
              {/* First Row - Launch to Assessment */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex items-center justify-center gap-2 min-w-max px-2">
                  {/* Launch of Complaint */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Launch of Complaint
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Complaint Received and Acknowledged */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Complaint Received and Acknowledged
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Complaint Documentation */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Complaint Documentation
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Complaint Assessment */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Complaint Assessment
                    </div>
                  </div>
                </div>
              </div>

              {/* Down Arrow */}
              <div className="flex justify-center mb-8">
                <svg className="w-6 h-8" viewBox="0 0 8 24">
                  <path d="M4 0 L4 20 M2 18 L4 22 L6 18" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Second Row - Response to Closeout */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex items-center justify-center gap-2 min-w-max px-2">
                  {/* Response to Complainant */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Response to Complainant
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Review of Findings */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Review of Findings
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Launch of Investigation */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Launch of Investigation
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Taking of Action */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Taking of Action
                    </div>
                  </div>
                </div>
              </div>

              {/* Down Arrow */}
              <div className="flex justify-center mb-8">
                <svg className="w-6 h-8" viewBox="0 0 8 24">
                  <path d="M4 0 L4 20 M2 18 L4 22 L6 18" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Third Row - Final Steps */}
              <div className="overflow-x-auto">
                <div className="flex items-center justify-center gap-2 min-w-max px-2">
                  {/* Complaint Closed */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Complaint Closed
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* System Audit and Review */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      System Audit and Review
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-1" viewBox="0 0 24 8">
                      <path d="M0 4 L20 4 M18 2 L22 4 L18 6" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Follow Up */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-center text-xs px-2">
                      Follow Up
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t-2 border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 text-xs mb-2">
                    <strong>Want to launch a complaint?</strong> <a href="#submit" onClick={() => setActiveTab('submit')} className="text-blue-600 hover:text-blue-700 underline">Click here</a> or email us via <a href="mailto:complaints@litein.go.ke" className="text-blue-600 hover:text-blue-700 underline">complaints@litein.go.ke</a>
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-700 text-xs">
                    <strong>Call us on our Toll Free number:</strong><br/>
                    <span className="text-base font-bold text-green-600">0800-720-464</span><br/>
                    <span className="text-xs text-gray-600">For any further assistance. Your feedback is highly valued.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Timeline Info */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-lg text-sm">
              <div className="flex gap-2">
                <div className="text-lg flex-shrink-0">⏱️</div>
                <div>
                  <p className="font-semibold text-gray-900">Standard Resolution Time</p>
                  <p className="text-gray-700 text-xs">
                    Most grievances are resolved within <strong>30 days</strong>. Complex cases may take longer, and you will be kept informed of progress at each stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: 'What is a Grievance Redress Mechanism?',
                  a: 'A system that allows citizens to file complaints about municipal services and ensures fair, transparent, and timely resolution.',
                  icon: '❓'
                },
                {
                  q: 'Who can file a grievance?',
                  a: 'Any member of the public who has been negatively affected by the municipality or its staff.',
                  icon: '👥'
                },
                {
                  q: 'How long does it take to resolve?',
                  a: 'Most grievances are resolved within 30 days, depending on complexity.',
                  icon: '⏰'
                },
                {
                  q: 'Is my grievance confidential?',
                  a: 'Yes. All grievances are handled with strict confidentiality for grievance resolution purposes only.',
                  icon: '🔒'
                },
                {
                  q: 'Will I get feedback?',
                  a: 'Yes. You receive regular updates and a final resolution feedback with a reference number.',
                  icon: '📧'
                },
                {
                  q: 'What if unsatisfied?',
                  a: 'You can appeal within 14 days by submitting an appeal through the same system.',
                  icon: '🔄'
                },
                {
                  q: 'Can I file anonymously?',
                  a: 'We encourage providing contact information for updates, but contact us for anonymous procedures.',
                  icon: '🕵️'
                },
                {
                  q: 'What issues can I report?',
                  a: 'Service failures, staff misconduct, corruption, infrastructure, planning issues, and any municipal concern.',
                  icon: '📋'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-t-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.q}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow border-t-4 border-green-500">
            <div className="text-3xl mb-2">✉️</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3 text-xs">Send your grievance directly</p>
            <a href="mailto:grievances@liteinmunicipal.go.ke" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 group text-xs">
              grievances@liteinmunicipal.go.ke
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow border-t-4 border-green-500">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3 text-xs">Speak with our team</p>
            <a href="tel:+254712345678" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 group text-xs">
              +254 712 345 678
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow border-t-4 border-green-500">
            <div className="text-3xl mb-2">🕐</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Office Hours</h3>
            <p className="text-gray-700 font-semibold text-xs">Monday - Friday</p>
            <p className="text-gray-600 text-xs">8:00 AM - 5:00 PM EAT</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Grievance
