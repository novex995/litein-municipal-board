import express from 'express'
import {
  getPublishedNews,
  getNewsBySlug,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories
} from '../controllers/newsController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getPublishedNews)
router.get('/categories', getNewsCategories)

// TEMPORARY: Admin route without auth for testing
router.get('/admin/all-temp', getAllNews)

// Admin only routes (MUST come before /:slug)
router.get('/admin/all',
  authenticate,
  requireRole(['municipal_manager', 'super_admin']),
  getAllNews
)

// Public route with parameter (MUST come last)
router.get('/:slug', getNewsBySlug)

// Protected routes - Staff and above
router.post('/',
  authenticate,
  requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']),
  createNews
)

router.put('/:id',
  authenticate,
  requireRole(['municipal_staff', 'department_head', 'municipal_manager', 'super_admin']),
  updateNews
)

router.delete('/:id',
  authenticate,
  requireRole(['municipal_manager', 'super_admin']),
  deleteNews
)

export default router
