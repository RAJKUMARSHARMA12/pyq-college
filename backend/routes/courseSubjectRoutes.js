import express from 'express';
import {
  getCourses,
  getSubjects,
  createCourse,
  createSubject,
} from '../controllers/courseSubjectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for dropdown filters
router.get('/courses', getCourses);
router.get('/subjects', getSubjects);

// Admin creation routes
router.post('/courses', protect, authorize('admin'), createCourse);
router.post('/subjects', protect, authorize('admin'), createSubject);

export default router;
