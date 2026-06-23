// Environment configuration
// This provides a fallback to production URL if VITE_API_URL is not set

const getApiUrl = () => {
  // Check if we're in development
  const isDevelopment = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost'
  
  // Use environment variable if available, otherwise use production URL
  const apiUrl = import.meta.env.VITE_API_URL || 'https://litein-municipal.onrender.com'
  
  console.log('🌍 Environment:', import.meta.env.MODE)
  console.log('🔗 API URL:', apiUrl)
  
  return apiUrl
}

export const API_BASE_URL = getApiUrl()
export const API_URL = `${API_BASE_URL}/api`
