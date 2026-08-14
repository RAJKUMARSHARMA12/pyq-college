import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Development', 'Design', 'Marketing', 'Documentation', 'DevOps'],
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'In Progress', 'Completed', 'Archived'],
    },
    priority: {
      type: String,
      default: 'Medium',
      enum: ['Low', 'Medium', 'High', 'Urgent'],
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
