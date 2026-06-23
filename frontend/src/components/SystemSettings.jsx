import { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  CreditCard,
  Shield,
  Database,
  Globe,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
  Send,
  Info
} from 'lucide-react'
import axios from 'axios'
import { API_URL, SETTINGS_ENDPOINTS } from '../config/api'

const SystemSettings = () => {
  const [settings, setSettings] = useState({})
  const [originalSettings, setOriginalSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showPasswords, setShowPasswords] = useState({})
  const [testEmailTo, setTestEmailTo] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)
  const [notification, setNotification] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Category configurations
  const categories = [
    { id: 'general', name: 'General Settings', icon: Globe, color: 'blue' },
    { id: 'email', name: 'Email Configuration', icon: Mail, color: 'green' },
    { id: 'sms', name: 'SMS Configuration', icon: Smartphone, color: 'purple' },
    { id: 'payment', name: 'Payment Gateway', icon: CreditCard, color: 'yellow' },
    { id: 'security', name: 'Security Settings', icon: Shield, color: 'red' },
    { id: 'backup', name: 'Backup & Restore', icon: Database, color: 'indigo' },
    { id: 'files', name: 'File Upload', icon: Database, color: 'pink' }
  ]

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await axios.get(`${API_URL}${SETTINGS_ENDPOINTS.LIST}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setSettings(response.data.data)
        setOriginalSettings(JSON.parse(JSON.stringify(response.data.data)))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      showNotification('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Check if there are unsaved changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    setHasChanges(changed)
  }, [settings, originalSettings])

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle setting change
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category]?.map(setting =>
        setting.setting_key === key
          ? { ...setting, setting_value: value }
          : setting
      )
    }))
  }

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')

      // Collect all changed settings
      const changedSettings = []
      
      Object.keys(settings).forEach(category => {
        settings[category]?.forEach(setting => {
          const original = originalSettings[category]?.find(
            s => s.setting_key === setting.setting_key
          )
          
          if (original && original.setting_value !== setting.setting_value) {
            changedSettings.push({
              key: setting.setting_key,
              value: setting.setting_value
            })
          }
        })
      })

      if (changedSettings.length === 0) {
        showNotification('No changes to save', 'info')
        return
      }

      const response = await axios.put(
        `${API_URL}${SETTINGS_ENDPOINTS.UPDATE_MULTIPLE}`,
        { settings: changedSettings },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        showNotification(`Successfully updated ${changedSettings.length} settings`, 'success')
        // Refresh settings to get updated values
        await fetchSettings()
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showNotification(error.response?.data?.error || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Reset to original
  const handleReset = () => {
    setSettings(JSON.parse(JSON.stringify(originalSettings)))
    showNotification('Changes discarded', 'info')
  }

  // Toggle password visibility
  const togglePasswordVisibility = (key) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Test email configuration
  const handleTestEmail = async () => {
    if (!testEmailTo) {
      showNotification('Please enter a recipient email', 'error')
      return
    }

    try {
      setTestingEmail(true)
      const token = localStorage.getItem('token')

      const response = await axios.post(
        `${API_URL}${SETTINGS_ENDPOINTS.TEST_EMAIL}`,
        { to: testEmailTo },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        showNotification('Test email sent successfully! Check your inbox.', 'success')
        setTestEmailTo('')
      }
    } catch (error) {
      console.error('Error testing email:', error)
      showNotification(error.response?.data?.error || 'Failed to send test email', 'error')
    } finally {
      setTestingEmail(false)
    }
  }

  // Render input field based on setting type
  const renderInput = (setting, category) => {
    const value = setting.setting_value || ''
    const isPassword = setting.setting_key.includes('password') || 
                      setting.setting_key.includes('secret') || 
                      setting.setting_key.includes('key')

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <button
              onClick={() => handleSettingChange(
                category,
                setting.setting_key,
                value === 'true' ? 'false' : 'true'
              )}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value === 'true' ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-600">
              {value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(category, setting.setting_key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        )

      case 'text':
      default:
        if (isPassword && value === '********') {
          return (
            <div className="flex items-center gap-2">
              <input
                type={showPasswords[setting.setting_key] ? 'text' : 'password'}
                value={value}
                onChange={(e) => handleSettingChange(category, setting.setting_key, e.target.value)}
                placeholder="Enter new value to update"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={() => togglePasswordVisibility(setting.setting_key)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords[setting.setting_key] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )
        }
        
        return (
          <input
            type={isPassword && !showPasswords[setting.setting_key] ? 'password' : 'text'}
            value={value}
            onChange={(e) => handleSettingChange(category, setting.setting_key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        )
    }
  }

  // Get category color classes
  const getCategoryColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      pink: 'text-pink-600 bg-pink-100'
    }
    return colors[color] || colors.blue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">Configure system preferences and settings</p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Discard Changes
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border-l-4 ${
          notification.type === 'success' ? 'bg-green-50 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 border-red-500' :
          'bg-blue-50 border-blue-500'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
            <p className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-800' :
              notification.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeTab === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {settings[activeTab] && settings[activeTab].length > 0 ? (
            <div className="space-y-6">
              {settings[activeTab].map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900">
                        {setting.setting_key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </label>
                      {setting.description && (
                        <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    {renderInput(setting, activeTab)}
                  </div>
                </div>
              ))}

              {/* Email Test Section */}
              {activeTab === 'email' && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Email Configuration</h3>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Send test email to:
                      </label>
                      <input
                        type="email"
                        value={testEmailTo}
                        onChange={(e) => setTestEmailTo(e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleTestEmail}
                      disabled={testingEmail || !testEmailTo}
                      className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testingEmail ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      Save your email configuration changes before testing to ensure the test uses your new settings.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No settings available for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
