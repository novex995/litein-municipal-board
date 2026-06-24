import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react'

const NewsManagement = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    featured_image: '',
    published: false
  })

  // Fetch news from backend
  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage (custom JWT from login)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setError('No authentication token found. Please log in again.')
        setNews([])
        setLoading(false)
        return
      }
      
      console.log('Fetching news with token:', token.substring(0, 20) + '...')
      
      // TEMPORARY: Use public endpoint for testing
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/admin/all-temp`)
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      
      if (data.success) {
        console.log('News articles:', data.data)
        setNews(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch news')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setError(error.message || 'Failed to fetch news')
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNews = async (e) => {
    e.preventDefault()
    try {
      // Get token from localStorage (custom JWT from login)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Authentication required. Please log in again.')
        return
      }
      
      console.log('Creating news with token:', token.substring(0, 20) + '...')
      console.log('Form data:', formData)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        alert('News article created successfully!')
        setShowCreateModal(false)
        resetForm()
        fetchNews()
      } else {
        alert('Failed to create news article: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating news:', error)
      alert('Failed to create news article: ' + error.message)
    }
  }

  const handleUpdateNews = async (e) => {
    e.preventDefault()
    try {
      // Get token from localStorage (custom JWT from login)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Authentication required. Please log in again.')
        return
      }
      
      console.log('🔄 Updating news article:', {
        id: selectedNews.id,
        formData: formData
      })
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${selectedNews.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      console.log('📡 Response status:', response.status)
      
      const data = await response.json()
      console.log('📦 Response data:', data)
      
      if (data.success) {
        alert('News article updated successfully!')
        setShowEditModal(false)
        resetForm()
        fetchNews()
      } else {
        alert('Failed to update news article: ' + (data.error || 'Unknown error'))
        console.error('❌ Update failed:', data)
      }
    } catch (error) {
      console.error('❌ Error updating news:', error)
      alert('Failed to update news article: ' + error.message)
    }
  }

  const handleDeleteNews = async (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) return
    
    try {
      // Get token from localStorage (custom JWT from login)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Authentication required. Please log in again.')
        return
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('News article deleted successfully!')
        fetchNews()
      } else {
        alert('Failed to delete news article: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Failed to delete news article')
    }
  }

  const handlePublishToggle = async (newsItem) => {
    try {
      // Get token from localStorage (custom JWT from login)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Authentication required. Please log in again.')
        return
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${newsItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ published: !newsItem.published })
      })
      
      const data = await response.json()
      if (data.success) {
        alert(`News article ${newsItem.published ? 'unpublished' : 'published'} successfully!`)
        fetchNews()
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const openEditModal = (newsItem) => {
    setSelectedNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      category: newsItem.category,
      featured_image: newsItem.featured_image || '',
      published: newsItem.published
    })
    setImagePreview(newsItem.featured_image || null)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      featured_image: '',
      published: false
    })
    setImagePreview(null)
    setSelectedNews(null)
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target.result
          setImagePreview(dataUrl)
          setFormData({...formData, featured_image: dataUrl})
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select a valid image file')
      }
    }
  }

  // Handle paste event
  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target.result
            setImagePreview(dataUrl)
            setFormData({...formData, featured_image: dataUrl})
          }
          reader.readAsDataURL(blob)
          break
        }
      }
    }
  }

  // Handle URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData({...formData, featured_image: url})
    if (url) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  // Remove image
  const removeImage = () => {
    setImagePreview(null)
    setFormData({...formData, featured_image: ''})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === '' || item.category === filterCategory
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'published' && item.published) ||
      (filterStatus === 'draft' && !item.published)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(news.map(item => item.category))]
  const stats = {
    total: news.length,
    published: news.filter(n => n.published).length,
    drafts: news.filter(n => !n.published).length,
    totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-gray-600 mt-1">Create, edit, and manage news articles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Article
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.published}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.drafts}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalViews.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading news articles...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No news articles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.featured_image && (
                          <img 
                            src={item.featured_image} 
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">{item.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.published ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Published
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Eye className="w-4 h-4 inline mr-1" />
                      {item.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePublishToggle(item)}
                        className={item.published ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {item.published ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 p-6 border-b border-green-800 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-7 h-7" />
                  {showCreateModal ? 'Create New Article' : 'Edit Article'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={showCreateModal ? handleCreateNews : handleUpdateNews} className="p-8 space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter article title"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Development">Development</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="E-Services">E-Services</option>
                  <option value="Community">Community</option>
                  <option value="Education">Education</option>
                  <option value="Governance">Governance</option>
                  <option value="Environment">Environment</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              {/* Featured Image Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Featured Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Image Upload Options */}
                <div className="space-y-4">
                  {/* File Upload Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-100 transition-all"
                    >
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                  </div>

                  {/* URL Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={handleImageUrlChange}
                      onPaste={handlePaste}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Or paste image URL or Ctrl+V to paste image"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 flex items-start gap-2">
                      <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        You can upload an image file, paste an image URL, or press Ctrl+V to paste an image from your clipboard
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Excerpt Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Short summary (optional - auto-generated if empty)"
                ></textarea>
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                  placeholder="Enter article content..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Publish Checkbox */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {showCreateModal ? 'Create Article' : 'Update Article'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsManagement
