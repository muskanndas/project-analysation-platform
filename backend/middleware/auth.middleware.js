import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { isAuthorizedSeededAdmin } from '../constants/seededAdmins.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

/** After auth + admin role: only the three seeded department admins may call admin APIs. */
export const seededAdminMiddleware = (req, res, next) => {
  if (!isAuthorizedSeededAdmin(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only seeded department administrators may use this resource.'
    });
  }
  next();
};
