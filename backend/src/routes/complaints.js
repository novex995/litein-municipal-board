import express from 'express'
import {
  createComplaint,
  getComplaints,
  getComplaintByReference,
  updateComplaintStatus,
  addComplaintComment,
  getComplaintStats
} from '../controllers/complaintsController.js'
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/', optionalAuth, createComplaint)
router.get('/reference/:referenceNumber', getComplaintByReference)

// Protected routes
router.get('/', authenticate, getComplaints)
router.get('/stats', authenticate, requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']), getComplaintStats)
router.patch('/:id/status', authenticate, requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']), updateComplaintStatus)
router.post('/:id/comments', authenticate, addComplaintComment)

export default router
