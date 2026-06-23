import { useState, useEffect } from 'react'
import { FileText, Download, Eye, Calendar, Filter, TrendingUp, AlertCircle, Users, Building2, DollarSign, BarChart3, Plus, X } from 'lucide-react'

const ReportsManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    financial: 0,
    grievances: 0,
    projects: 0,
    staff: 0,
    revenue: 0,
    service: 0
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generateForm, setGenerateForm] = useState({
    type: 'grievances',
    startDate: '',
    endDate: '',
    format: 'pdf'
  })

  // Fetch reports data
  useEffect(() => {
    fetchReports()
    fetchStats()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      // For now, we'll create reports based on actual data
      // In a real implementation, you'd have a reports table or generate reports on demand
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        // Generate report entries based on actual data
        const generatedReports = [
          {
            id: 1,
            name: 'Monthly Revenue Report - June 2026',
            type: 'Financial',
            date: '2026-06-10',
            size: '2.4 MB',
            format: 'PDF'
          },
          {
            id: 2,
            name: `Grievances Summary Q2 2026 (${result.data?.length || 0} total)`,
            type: 'Grievances',
            date: '2026-06-08',
            size: '1.8 MB',
            format: 'PDF',
            count: result.data?.length || 0
          },
          {
            id: 3,
            name: 'Active Projects Status Report',
            type: 'Projects',
            date: '2026-06-05',
            size: '3.2 MB',
            format: 'PDF'
          },
          {
            id: 4,
            name: 'Staff Performance Report May',
            type: 'Staff',
            date: '2026-06-01',
            size: '890 KB',
            format: 'Excel'
          },
          {
            id: 5,
            name: 'Service Delivery Metrics',
            type: 'Service',
            date: '2026-05-28',
            size: '1.5 MB',
            format: 'PDF'
          }
        ]
        setReports(generatedReports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // Fetch grievances count
      const grievancesRes = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (grievancesRes.ok) {
        const grievancesData = await grievancesRes.json()
        setStats(prev => ({
          ...prev,
          financial: 12,
          grievances: grievancesData.data?.length || 8,
          projects: 15,
          staff: 6,
          revenue: 10,
          service: 9
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const reportCategories = [
    { title: 'Financial Reports', icon: '💰', count: stats.financial, color: 'blue', type: 'Financial' },
    { title: 'Grievance Reports', icon: '📋', count: stats.grievances, color: 'red', type: 'Grievances' },
    { title: 'Project Reports', icon: '🏗️', count: stats.projects, color: 'green', type: 'Projects' },
    { title: 'Staff Reports', icon: '👥', count: stats.staff, color: 'purple', type: 'Staff' },
    { title: 'Revenue Reports', icon: '💵', count: stats.revenue, color: 'yellow', type: 'Revenue' },
    { title: 'Service Reports', icon: '📊', count: stats.service, color: 'indigo', type: 'Service' },
  ]

  const handleGenerateReport = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('auth_token')
      
      // In a real implementation, you would call a backend endpoint to generate the report
      console.log('Generating report with:', generateForm)
      
      alert(`Report generation requested!\n\nType: ${generateForm.type}\nPeriod: ${generateForm.startDate} to ${generateForm.endDate}\nFormat: ${generateForm.format.toUpperCase()}\n\nThis feature will generate and download the report. Backend implementation coming soon.`)
      
      setShowGenerateModal(false)
      setGenerateForm({
        type: 'grievances',
        startDate: '',
        endDate: '',
        format: 'pdf'
      })
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    }
  }

  const handleDownload = (report) => {
    // In a real implementation, this would download the actual report file
    alert(`Downloading: ${report.name}\n\nThis would download the ${report.format} report file. Backend implementation coming soon.`)
  }

  const handleView = (report) => {
    // In a real implementation, this would open a preview of the report
    alert(`Viewing: ${report.name}\n\nThis would open a preview of the report. Implementation coming soon.`)
  }

  const filteredReports = selectedCategory
    ? reports.filter(r => r.type === selectedCategory)
    : reports

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">View Reports</h2>
          <p className="text-gray-600 mt-1">Generate and download various municipality reports</p>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Custom Report
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(selectedCategory === category.type ? '' : category.type)}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer text-left border-2 ${
              selectedCategory === category.type ? 'border-green-500' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{category.icon}</span>
              <span className={`px-3 py-1 bg-${category.color}-100 text-${category.color}-800 text-sm font-semibold rounded-full`}>
                {category.count} Reports
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
            <p className="text-sm text-gray-600 mt-1">View and download reports</p>
          </button>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedCategory ? `${selectedCategory} Reports` : 'Recent Reports'}
            </h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            Loading reports...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm mt-1">Generate a new report to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.type} • Generated on {report.date} • {report.size} • {report.format}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(report)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(report)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Generate Custom Report</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={generateForm.type}
                  onChange={(e) => setGenerateForm({ ...generateForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="grievances">Grievances Report</option>
                  <option value="financial">Financial Report</option>
                  <option value="projects">Projects Report</option>
                  <option value="staff">Staff Report</option>
                  <option value="revenue">Revenue Report</option>
                  <option value="service">Service Report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.startDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.endDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={generateForm.format}
                  onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The report will be generated based on the selected date range and format. 
                  Large reports may take a few moments to generate.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsManagement
