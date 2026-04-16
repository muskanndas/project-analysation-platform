import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['backend', 'frontend', 'design', 'docs', 'testing'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open'
    }
  },
  { timestamps: true }
);

feedbackSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('Feedback', feedbackSchema);
