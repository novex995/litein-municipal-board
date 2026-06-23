import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/usersController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public endpoint to get staff list (no auth required for public pages)
// MUST be defined BEFORE authentication middleware
router.get('/public', async (req, res, next) => {
  try {
    // Only return active users with limited fields for public display
    req.query.status = 'active'
    await getAllUsers(req, res, next)
  } catch (error) {
    next(error)
  }
})

// All other routes below require authentication and super_admin or municipal_manager role
router.use(authenticate)
router.use(requireRole(['super_admin', 'municipal_manager']))

// Get all users (admin only)
router.get('/', getAllUsers)

// Get single user by ID
router.get('/:id', getUserById)

// Create new user (staff)
router.post('/', createUser)

// Update user status (enable/disable)
router.patch('/:id/status', updateUserStatus)

// Update user role
router.patch('/:id/role', updateUserRole)

// Update user details (general update)
router.patch('/:id', updateUser)

// Delete user (permanent)
router.delete('/:id', deleteUser)

export default router
