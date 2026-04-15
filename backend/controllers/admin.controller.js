import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const createMentor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminDept = req.user.department;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const mentor = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'mentor',
      department: adminDept
    });

    await mentor.save();

    res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
      data: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        department: mentor.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getDepartmentOverview = async (req, res) => {
  try {
    const dept = req.user.department;
    const [studentCount, mentorCount] = await Promise.all([
      User.countDocuments({ role: 'student', department: dept }),
      User.countDocuments({ role: 'mentor', department: dept })
    ]);

    res.json({
      success: true,
      data: {
        department: dept,
        studentCount,
        mentorCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

