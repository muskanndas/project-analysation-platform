import mongoose from 'mongoose';

const projectReviewSchema = new mongoose.Schema(
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
    action: {
      type: String,
      enum: ['approved', 'rejected', 'changes_requested'],
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    version: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

projectReviewSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('ProjectReview', projectReviewSchema);
