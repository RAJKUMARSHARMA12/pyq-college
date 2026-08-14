import mongoose from 'mongoose';

/**
 * Subject Model
 * Maps individual curriculum subjects to a specific Course and Semester.
 */
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Parent course reference is required'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester number is required'],
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of subject code per course
subjectSchema.index({ code: 1, course: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
