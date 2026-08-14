import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes require Admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', validateObjectId('id'), updateUserRole);
router.delete('/:id', validateObjectId('id'), deleteUser);

export default router;
