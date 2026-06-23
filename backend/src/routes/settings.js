import express from 'express'
import { 
  getAllSettings,
  getSettingsByCategory,
  getSettingByKey,
  updateSetting,
  updateMultipleSettings,
  resetSettings,
  testEmailConfig,
  getSystemInfo
} from '../controllers/settingsController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireRole(['super_admin', 'municipal_manager']))

// Get all settings grouped by category
router.get('/', getAllSettings)

// Get system info
router.get('/system-info', getSystemInfo)

// Get settings by category
router.get('/category/:category', getSettingsByCategory)

// Get single setting by key
router.get('/:key', getSettingByKey)

// Update single setting
router.put('/:key', updateSetting)

// Update multiple settings
router.put('/', updateMultipleSettings)

// Reset settings to default
router.post('/reset', resetSettings)

// Test email configuration
router.post('/test-email', testEmailConfig)

export default router
