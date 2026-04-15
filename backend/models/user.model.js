import mongoose from 'mongoose';
import { isAuthorizedSeededAdmin } from '../constants/seededAdmins.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'mentor', 'student'],
    default: 'student'
  },
  department: {
    type: String,
    required: function () {
      return ['student', 'admin', 'mentor'].includes(this.role);
    }
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

userSchema.pre('validate', function () {
  if (this.role === 'admin' && !isAuthorizedSeededAdmin(this)) {
    this.invalidate(
      'email',
      'Only predefined seeded department admin accounts (Computer Science, AI, EC) are allowed.'
    );
  }
});

export default mongoose.model('User', userSchema);
