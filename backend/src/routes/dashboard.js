import express from 'express'
import {
  getAdminDashboardStats,
  getStaffDashboardStats,
  getManagerDashboardStats,
  getDepartmentHeadDashboardStats,
  getFinanceDashboardStats,
  getLicensesDashboardStats,
  getGrievancesDashboardStats,
  getMediaDashboardStats,
  getCitizenServiceDashboardStats,
  getICTDashboardStats
} from '../controllers/dashboardController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Admin endpoint - temporarily without auth for debugging
router.get('/admin', getAdminDashboardStats)

// All other routes require authentication
router.use(authenticate)

// Dashboard stats endpoints
router.get('/staff', getStaffDashboardStats)
router.get('/manager', getManagerDashboardStats)
router.get('/department-head', getDepartmentHeadDashboardStats)
router.get('/finance', getFinanceDashboardStats)
router.get('/licenses', getLicensesDashboardStats)
router.get('/grievances', getGrievancesDashboardStats)
router.get('/media', getMediaDashboardStats)
router.get('/citizen-service', getCitizenServiceDashboardStats)
router.get('/ict', getICTDashboardStats)

export default router
