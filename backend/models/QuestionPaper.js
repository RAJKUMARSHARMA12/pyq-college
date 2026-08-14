import mongoose from 'mongoose';

/**
 * PYQ (Previous Year Question) Paper Model
 * Manages student uploads, file locations, metadata, and admin approval workflows.
 */

export const PYQ_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const EXAM_TYPES = Object.freeze([
  'Mid-Sem',
  'End-Sem',
  'Quiz',
  'Model Paper',
  'Supplementary',
]);

const questionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question paper title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    academicYear: {
      type: Number,
      required: [true, 'Academic year is required (e.g. 2023)'],
      min: [2000, 'Year must be 2000 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
    examType: {
      type: String,
      enum: EXAM_TYPES,
      default: 'End-Sem',
    },
    fileUrl: {
      type: String,
      required: [true, 'Question paper file URL or path is required'],
      trim: true,
    },
    solutionUrl: {
      type: String,
      default: '',
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required'],
    },
    status: {
      type: String,
      enum: Object.values(PYQ_STATUS),
      default: PYQ_STATUS.PENDING,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance query execution on status and filters
questionPaperSchema.index({ status: 1, course: 1, subject: 1, academicYear: -1 });
questionPaperSchema.index({ uploadedBy: 1 });

/**
 * Instance Method: Approve Paper
 * SOLID (Single Responsibility): Encapsulates status transition logic within the domain model.
 */
questionPaperSchema.methods.approve = function (adminId) {
  this.status = PYQ_STATUS.APPROVED;
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.rejectionReason = '';
  return this.save();
};

/**
 * Instance Method: Reject Paper
 */
questionPaperSchema.methods.reject = function (adminId, reason = '') {
  this.status = PYQ_STATUS.REJECTED;
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

/**
 * Static Method: Find Approved Papers with Filters (DRY query helper)
 */
questionPaperSchema.statics.findApproved = function (filter = {}) {
  return this.find({ ...filter, status: PYQ_STATUS.APPROVED })
    .populate('subject', 'name code semester')
    .populate('course', 'name code degree')
    .populate('uploadedBy', 'name email avatar')
    .sort({ academicYear: -1, createdAt: -1 });
};

/**
 * Static Method: Find Pending Papers for Admin Review
 */
questionPaperSchema.statics.findPending = function () {
  return this.find({ status: PYQ_STATUS.PENDING })
    .populate('subject', 'name code semester')
    .populate('course', 'name code degree')
    .populate('uploadedBy', 'name email avatar')
    .sort({ createdAt: 1 });
};

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

export default QuestionPaper;
