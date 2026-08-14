import express from 'express';
import {
  getCourses,
  getSubjects,
  createCourse,
  createSubject,
} from '../../controllers/courseSubjectController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/catalog/courses
 * @desc    Get list of academic degree programs & departments
 * @access  Public
 */
router.get('/courses', getCourses);

/**
 * @route   GET /api/v1/catalog/subjects
 * @desc    Get list of subjects mapped to course & semester
 * @access  Public
 */
router.get('/subjects', getSubjects);

/**
 * @route   POST /api/v1/catalog/courses
 * @desc    Create new Course (Admin Only)
 * @access  Private (Admin Only)
 */
router.post('/courses', protect, authorize('admin'), createCourse);

/**
 * @route   POST /api/v1/catalog/subjects
 * @desc    Create new Subject (Admin Only)
 * @access  Private (Admin Only)
 */
router.post('/subjects', protect, authorize('admin'), createSubject);

export default router;
