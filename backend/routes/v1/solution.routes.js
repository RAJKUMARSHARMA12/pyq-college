import express from 'express';
import {
  uploadSolution,
  getApprovedSolutions,
  toggleUpvote,
  getPendingSolutions,
  updateSolutionStatus,
} from '../../controllers/solutionController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';
import { uploadPYQFile } from '../../middleware/uploadMiddleware.js';
import { validateObjectId } from '../../middleware/validationMiddleware.js';

const router = express.Router({ mergeParams: true });

// Student Routes
router.get('/pyqs/:id/solutions', validateObjectId('id'), getApprovedSolutions);
router.post('/pyqs/:id/solutions', protect, uploadPYQFile.single('file'), validateObjectId('id'), uploadSolution);
router.post('/solutions/:id/upvote', protect, validateObjectId('id'), toggleUpvote);

// Admin Moderation Routes
router.get('/admin/solutions/pending', protect, authorize('admin'), getPendingSolutions);
router.put('/admin/solutions/:id/status', protect, authorize('admin'), validateObjectId('id'), updateSolutionStatus);

export default router;
