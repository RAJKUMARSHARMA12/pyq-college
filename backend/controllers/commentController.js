import { asyncHandler } from '../middleware/errorMiddleware.js';
import commentRepo from '../repositories/CommentRepository.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get Discussion Comments for a Question Paper
// @route   GET /api/v1/pyqs/:id/comments
export const getCommentsByPaper = asyncHandler(async (req, res) => {
  const { id: paperId } = req.params;
  const comments = await commentRepo.findByPaper(paperId);
  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// @desc    Post a Comment / Discussion Question on a Paper
// @route   POST /api/v1/pyqs/:id/comments
export const addComment = asyncHandler(async (req, res) => {
  const { id: paperId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw ApiError.badRequest('Comment text cannot be empty');
  }

  const comment = await commentRepo.addComment(paperId, req.user._id, content.trim());

  res.status(201).json({
    success: true,
    message: 'Comment posted successfully',
    data: comment,
  });
});
