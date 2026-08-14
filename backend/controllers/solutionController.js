import { asyncHandler } from '../middleware/errorMiddleware.js';
import solutionRepo from '../repositories/SolutionRepository.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Submit a Solution / Answer Key for a Question Paper (Pending Admin Review or Admin Auto-Approved)
// @route   POST /api/v1/pyqs/:id/solutions
export const uploadSolution = asyncHandler(async (req, res) => {
  const { id: paperId } = req.params;
  const { solutionUrl, explanationText } = req.body;

  let finalSolutionUrl = solutionUrl;
  if (req.file) {
    finalSolutionUrl = await uploadToCloudinary(req.file.path, 'prores_solutions');
  }

  if (!finalSolutionUrl) {
    throw ApiError.badRequest('Solution PDF file or link is required');
  }

  // Admins auto-approve their own solutions; student solutions enter pending moderation queue
  const initialStatus = req.user && req.user.role === 'admin' ? 'approved' : 'pending';

  const solution = await solutionRepo.create({
    questionPaper: paperId,
    uploadedBy: req.user._id,
    solutionUrl: finalSolutionUrl,
    explanationText: explanationText || '',
    status: initialStatus,
  });

  res.status(201).json({
    success: true,
    message:
      initialStatus === 'approved'
        ? 'Solution published and visible immediately!'
        : 'Solution submitted successfully! It will appear after admin moderation approval.',
    data: solution,
  });
});

// @desc    Get Approved Solutions for a Question Paper
// @route   GET /api/v1/pyqs/:id/solutions
export const getApprovedSolutions = asyncHandler(async (req, res) => {
  const { id: paperId } = req.params;
  const solutions = await solutionRepo.findApprovedByPaper(paperId);
  res.status(200).json({
    success: true,
    count: solutions.length,
    data: solutions,
  });
});

// @desc    Toggle Upvote for a Solution (Logged-in Students Only)
// @route   POST /api/v1/solutions/:id/upvote
export const toggleUpvote = asyncHandler(async (req, res) => {
  const { id: solutionId } = req.params;
  const result = await solutionRepo.toggleUpvote(solutionId, req.user._id);

  if (!result) {
    throw ApiError.notFound('Solution not found');
  }

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get Pending Solutions Queue for Admin Moderation
// @route   GET /api/v1/admin/solutions/pending
export const getPendingSolutions = asyncHandler(async (req, res) => {
  const pending = await solutionRepo.findPendingSolutions();
  res.status(200).json({
    success: true,
    count: pending.length,
    data: pending,
  });
});

// @desc    Approve or Reject Solution (Admin Only)
// @route   PUT /api/v1/admin/solutions/:id/status
export const updateSolutionStatus = asyncHandler(async (req, res) => {
  const { id: solutionId } = req.params;
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    throw ApiError.badRequest("Status must be 'approved' or 'rejected'");
  }

  const updated = await solutionRepo.updateSolutionStatus(
    solutionId,
    req.user._id,
    status,
    rejectionReason || ''
  );

  if (!updated) {
    throw ApiError.notFound('Solution not found');
  }

  res.status(200).json({
    success: true,
    message: `Solution ${status} successfully`,
    data: updated,
  });
});
