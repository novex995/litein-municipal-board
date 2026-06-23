// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://litein-municipal-board-production.up.railway.app'
export const API_URL = `${API_BASE_URL}/api`

// API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
  RESET_PASSWORD: '/auth/reset-password',
  STAFF: '/auth/staff',
  STAFF_BY_ID: (id) => `/auth/staff/${id}`
}

export const COMPLAINTS_ENDPOINTS = {
  LIST: '/complaints',
  CREATE: '/complaints',
  GET: (id) => `/complaints/${id}`,
  UPDATE: (id) => `/complaints/${id}`,
  DELETE: (id) => `/complaints/${id}`
}

export const PROJECTS_ENDPOINTS = {
  LIST: '/projects',
  CREATE: '/projects',
  GET: (id) => `/projects/${id}`,
  UPDATE: (id) => `/projects/${id}`,
  DELETE: (id) => `/projects/${id}`
}

export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  OVERVIEW: '/dashboard/overview'
}

export const EMAIL_ENDPOINTS = {
  TEST: '/email/test',
  WELCOME: '/email/welcome',
  COMPLAINT_CONFIRMATION: '/email/complaint-confirmation',
  PASSWORD_RESET: '/email/password-reset',
  SEND: '/email/send'
}

export const ACTIVITY_LOG_ENDPOINTS = {
  LIST: '/activity-logs',
  STATS: '/activity-logs/stats',
  CREATE: '/activity-logs',
  EXPORT: '/activity-logs/export'
}

export const SETTINGS_ENDPOINTS = {
  LIST: '/settings',
  BY_CATEGORY: (category) => `/settings/category/${category}`,
  BY_KEY: (key) => `/settings/${key}`,
  UPDATE: (key) => `/settings/${key}`,
  UPDATE_MULTIPLE: '/settings',
  RESET: '/settings/reset',
  TEST_EMAIL: '/settings/test-email',
  SYSTEM_INFO: '/settings/system-info'
}
