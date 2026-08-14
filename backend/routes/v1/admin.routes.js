import express from 'express';
import {
  getPendingPYQs,
  approvePYQ,
  rejectPYQ,
  getAdminStats,
} from '../../controllers/pyqController.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../../controllers/userController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';
import { validateObjectId } from '../../middleware/validationMiddleware.js';

const router = express.Router();

// Apply Authentication & Admin Role Guards to all Admin Routes
router.use(protect);
router.use(authorize('admin'));

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get admin dashboard metrics & analytics
 * @access  Private (Admin Only)
 */
router.get('/stats', getAdminStats);

/**
 * @route   GET /api/v1/admin/pyqs/pending
 * @desc    Fetch pending question papers queue for admin review
 * @access  Private (Admin Only)
 */
router.get('/pyqs/pending', getPendingPYQs);

/**
 * @route   PUT /api/v1/admin/pyqs/:id/approve
 * @desc    Approve a pending question paper submission
 * @access  Private (Admin Only)
 */
router.put('/pyqs/:id/approve', validateObjectId('id'), approvePYQ);

/**
 * @route   PUT /api/v1/admin/pyqs/:id/reject
 * @desc    Reject a pending question paper submission with feedback
 * @access  Private (Admin Only)
 */
router.put('/pyqs/:id/reject', validateObjectId('id'), rejectPYQ);

/**
 * User Management Routes (Admin Only)
 */
router.get('/users', getAllUsers);
router.put('/users/:id/role', validateObjectId('id'), updateUserRole);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

export default router;
