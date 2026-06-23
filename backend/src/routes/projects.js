import express from 'express'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectUpdate,
  getProjectStats
} from '../controllers/projectsController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getProjects)
router.get('/stats', getProjectStats)
router.get('/:id', getProject)

// Protected routes - Admin only
router.post('/', authenticate, requireRole(['municipal_manager', 'super_admin']), createProject)
router.put('/:id', authenticate, requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']), updateProject)
router.patch('/:id', authenticate, requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']), updateProject)
router.delete('/:id', authenticate, requireRole(['municipal_manager', 'super_admin']), deleteProject)
router.post('/:id/updates', authenticate, requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']), addProjectUpdate)

export default router
