import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

activityLogSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
