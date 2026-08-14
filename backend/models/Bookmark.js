import mongoose from 'mongoose';

/**
 * Bookmark Model
 * Represents a student's saved / favorite Question Paper for quick access.
 */
const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    questionPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionPaper',
      required: [true, 'Question paper ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a user cannot bookmark the same paper twice
bookmarkSchema.index({ user: 1, questionPaper: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
