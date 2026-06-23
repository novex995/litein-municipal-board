import express from 'express'
import { 
  getActivityLogs, 
  getActivityStats, 
  createActivityLog,
  exportActivityLogs 
} from '../controllers/activityLogController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireRole(['super_admin', 'municipal_manager']))

// Get activity logs with filtering and pagination
router.get('/', getActivityLogs)

// Get activity statistics
router.get('/stats', getActivityStats)

// Create activity log (for manual logging)
router.post('/', createActivityLog)

// Export activity logs as CSV
router.get('/export', exportActivityLogs)

export default router
