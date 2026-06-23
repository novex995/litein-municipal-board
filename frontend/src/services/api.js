import axios from 'axios'
import { supabase, isSupabaseConfigured } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_ENDPOINTS = `${API_URL}/api`

// Create axios instance
const api = axios.create({
  baseURL: API_ENDPOINTS,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    if (!isSupabaseConfigured || !supabase) {
      return config
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

// Complaints API
export const complaintsApi = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getByReference: (referenceNumber) => api.get(`/complaints/reference/${referenceNumber}`),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  addComment: (id, data) => api.post(`/complaints/${id}/comments`, data),
  getStats: () => api.get('/complaints/stats'),
}

// Projects API
export const projectsApi = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  addUpdate: (id, data) => api.post(`/projects/${id}/updates`, data),
  getStats: () => api.get('/projects/stats'),
}

export default api
