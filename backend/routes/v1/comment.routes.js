import express from 'express';
import { getCommentsByPaper, addComment } from '../../controllers/commentController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { validateObjectId } from '../../middleware/validationMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/pyqs/:id/comments', validateObjectId('id'), getCommentsByPaper);
router.post('/pyqs/:id/comments', protect, validateObjectId('id'), addComment);

export default router;
