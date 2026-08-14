import mongoose from 'mongoose';

/**
 * Student / Teacher Solution Model
 * Stores answer keys and solutions for Question Papers. Requires admin approval.
 */
const solutionSchema = new mongoose.Schema(
  {
    questionPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionPaper',
      required: [true, 'Question paper ID is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required'],
    },
    solutionUrl: {
      type: String,
      required: [true, 'Solution PDF file or link is required'],
      trim: true,
    },
    explanationText: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    upvotesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

solutionSchema.index({ questionPaper: 1, status: 1, upvotesCount: -1 });

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;
