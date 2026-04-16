import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    type: {
      type: String,
      enum: ['weekly', 'final'],
      default: 'weekly'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

reportSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
