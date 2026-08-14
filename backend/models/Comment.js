import mongoose from 'mongoose';

/**
 * Comment Model
 * Manages Q&A discussion threads per Question Paper.
 */
const commentSchema = new mongoose.Schema(
  {
    questionPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionPaper',
      required: [true, 'Question paper ID is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ questionPaper: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
