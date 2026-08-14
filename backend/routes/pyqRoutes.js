import express from 'express';
import {
  uploadPYQ,
  getApprovedPYQs,
  getPendingPYQs,
  getMySubmissions,
  approvePYQ,
  rejectPYQ,
  getPYQById,
  trackDownload,
} from '../controllers/pyqController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadPYQFile } from '../middleware/uploadMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public / Student Browsing Routes
router.get('/', getApprovedPYQs);
router.get('/:id', validateObjectId('id'), getPYQById);
router.post('/:id/download', validateObjectId('id'), trackDownload);

// Protected Student Upload & Submissions Routes
router.post('/upload', protect, uploadPYQFile.single('file'), uploadPYQ);
router.get('/user/my-submissions', protect, getMySubmissions);

// Protected Admin Moderation Routes
router.get('/admin/pending', protect, authorize('admin'), getPendingPYQs);
router.put('/:id/approve', protect, authorize('admin'), validateObjectId('id'), approvePYQ);
router.put('/:id/reject', protect, authorize('admin'), validateObjectId('id'), rejectPYQ);

export default router;
