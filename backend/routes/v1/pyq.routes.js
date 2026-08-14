import express from 'express';
import {
  getApprovedPYQs,
  getPYQById,
  uploadPYQ,
  getMySubmissions,
  trackDownload,
  toggleBookmark,
  getUserBookmarks,
} from '../../controllers/pyqController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { uploadPYQFile } from '../../middleware/uploadMiddleware.js';
import { validateObjectId } from '../../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/pyqs
 * @desc    Get published/approved PYQs with search & filters
 * @access  Public
 */
router.get('/', getApprovedPYQs);

/**
 * @route   GET /api/v1/pyqs/my-submissions
 * @desc    Get student's own paper submission history & statuses
 * @access  Private (Student)
 */
router.get('/my-submissions', protect, getMySubmissions);

/**
 * @route   GET /api/v1/pyqs/user/bookmarks
 * @desc    Get student bookmarked papers
 * @access  Private (Student)
 */
router.get('/user/bookmarks', protect, getUserBookmarks);

/**
 * @route   GET /api/v1/pyqs/:id
 * @desc    Get details for a specific PYQ and track view analytics
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), getPYQById);

/**
 * @route   POST /api/v1/pyqs/upload
 * @desc    Student uploads a new PYQ (saves file & sets status to pending)
 * @access  Private (Student)
 */
router.post('/upload', protect, uploadPYQFile.single('file'), uploadPYQ);

/**
 * @route   POST /api/v1/pyqs/:id/bookmark
 * @desc    Toggle paper bookmark for student
 * @access  Private (Student)
 */
router.post('/:id/bookmark', protect, validateObjectId('id'), toggleBookmark);

/**
 * @route   POST /api/v1/pyqs/:id/download
 * @desc    Track download count analytics
 * @access  Public
 */
router.post('/:id/download', validateObjectId('id'), trackDownload);

export default router;
