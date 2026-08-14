import { asyncHandler } from '../middleware/errorMiddleware.js';
import uploadPYQUseCase from '../usecases/pyq/UploadPYQUseCase.js';
import approvePYQUseCase from '../usecases/pyq/ApprovePYQUseCase.js';
import rejectPYQUseCase from '../usecases/pyq/RejectPYQUseCase.js';
import getApprovedPYQsUseCase from '../usecases/pyq/GetApprovedPYQsUseCase.js';
import bookmarkPYQUseCase from '../usecases/pyq/BookmarkPYQUseCase.js';
import getAdminStatsUseCase from '../usecases/admin/GetAdminStatsUseCase.js';
import questionPaperRepo from '../repositories/QuestionPaperRepository.js';

/**
 * Question Paper Controllers
 */

import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Upload a new Previous Year Question Paper (Pending Admin Approval)
// @route   POST /api/v1/pyqs/upload
export const uploadPYQ = asyncHandler(async (req, res) => {
  let fileUrl = req.body.fileUrl;
  if (req.file) {
    fileUrl = await uploadToCloudinary(req.file.path, 'prores_pyqs');
  }

  const payload = {
    ...req.body,
    fileUrl,
    user: req.user,
  };

  const result = await uploadPYQUseCase.execute(payload);
  res.status(201).json(result);
});

// @desc    Get Published / Approved PYQs for Students
// @route   GET /api/v1/pyqs
export const getApprovedPYQs = asyncHandler(async (req, res) => {
  const result = await getApprovedPYQsUseCase.execute(req.query);
  res.status(200).json(result);
});

// @desc    Get Pending PYQs for Admin Moderation Dashboard
// @route   GET /api/v1/admin/pyqs/pending
export const getPendingPYQs = asyncHandler(async (req, res) => {
  const pendingPapers = await questionPaperRepo.findPendingPapers();
  res.status(200).json({
    success: true,
    count: pendingPapers.length,
    data: pendingPapers,
  });
});

// @desc    Get Admin Dashboard Stats Analytics
// @route   GET /api/v1/admin/stats
export const getAdminStats = asyncHandler(async (req, res) => {
  const result = await getAdminStatsUseCase.execute();
  res.status(200).json(result);
});

// @desc    Get Student's Own Submissions
// @route   GET /api/v1/pyqs/my-submissions
export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await questionPaperRepo.findUserSubmissions(req.user._id);
  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
});

// @desc    Approve a Question Paper (Admin Only)
// @route   PUT /api/v1/admin/pyqs/:id/approve
export const approvePYQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await approvePYQUseCase.execute(id, req.user);
  res.status(200).json(result);
});

// @desc    Reject a Question Paper with Feedback (Admin Only)
// @route   PUT /api/v1/admin/pyqs/:id/reject
export const rejectPYQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const result = await rejectPYQUseCase.execute(id, req.user, reason);
  res.status(200).json(result);
});

// @desc    Toggle Bookmark Paper for Student
// @route   POST /api/v1/pyqs/:id/bookmark
export const toggleBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await bookmarkPYQUseCase.toggle(req.user._id, id);
  res.status(200).json(result);
});

// @desc    Get Student Bookmarks
// @route   GET /api/v1/pyqs/user/bookmarks
export const getUserBookmarks = asyncHandler(async (req, res) => {
  const result = await bookmarkPYQUseCase.getUserBookmarks(req.user._id);
  res.status(200).json(result);
});

// @desc    Increment View Counter & Return Details
// @route   GET /api/v1/pyqs/:id
export const getPYQById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const paper = await questionPaperRepo.findById(id, 'subject course uploadedBy');
  if (!paper) {
    return res.status(404).json({ success: false, message: 'Question paper not found' });
  }

  await questionPaperRepo.incrementViews(id);

  res.status(200).json({
    success: true,
    data: paper,
  });
});

// @desc    Increment Download Counter
// @route   POST /api/v1/pyqs/:id/download
export const trackDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await questionPaperRepo.incrementDownloads(id);
  res.status(200).json({
    success: true,
    message: 'Download recorded',
    downloadsCount: updated ? updated.downloadsCount : 1,
  });
});
