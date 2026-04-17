import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import Project from '../models/project.model.js';
import Ticket from '../models/ticket.model.js';

export const createMentor = async (req, res) => {
  try {
    const { name, email, password, department, expertise } = req.body;
    const adminDept = req.user.department;

    if (!name || !email || !password || !department || !expertise) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, department, and expertise are required'
      });
    }

    if (String(department).trim() !== adminDept) {
      return res.status(403).json({
        success: false,
        message: 'You can only create mentors for your own department'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
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
      department: adminDept,
      expertise: String(expertise).trim()
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
        department: mentor.department,
        expertise: mentor.expertise
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

export const getAdminDashboard = async (req, res) => {
  try {
    const [studentCount, mentorCount, totalProjects, pendingProjects, approvedProjects] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      Project.countDocuments({}),
      Project.countDocuments({ status: 'pending' }),
      Project.countDocuments({ status: 'approved' })
    ]);

    res.json({
      success: true,
      data: {
        studentCount,
        mentorCount,
        totalProjects,
        pendingProjects,
        approvedProjects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email department createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await Team.updateMany({ members: student._id }, { $pull: { members: student._id } });
    await User.findByIdAndDelete(student._id);

    res.json({ success: true, message: 'Student deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name email department expertise createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }

    await Project.updateMany({ mentor: mentor._id }, { $set: { mentor: null } });
    await User.findByIdAndDelete(mentor._id);

    res.json({ success: true, message: 'Mentor deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status).trim() : null;
    const query = status ? { status } : {};

    const projects = await Project.find(query)
      .populate('team', 'name')
      .populate('mentor', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects.map((p) => ({
        _id: p._id,
        title: p.title,
        status: p.status,
        team: p.team ? { id: p.team._id, name: p.team.name } : null,
        mentor: p.mentor ? { id: p.mentor._id, name: p.mentor.name, email: p.mentor.email } : null
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Ticket.find({})
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title status')
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({
      success: true,
      data: tasks.map((t) => ({
        _id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        deadline: t.deadline,
        assignedTo: t.assignedTo ? { id: t.assignedTo._id, name: t.assignedTo.name, email: t.assignedTo.email } : null,
        project: t.projectId ? { id: t.projectId._id, title: t.projectId.title, status: t.projectId.status } : null
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getMentorMonitoring = async (req, res) => {
  try {
    const projects = await Project.find({ mentor: { $ne: null } })
      .populate('team', 'name')
      .populate('mentor', 'name email department')
      .sort({ updatedAt: -1 });

    const projectIds = projects.map((p) => p._id);
    const ticketAgg = await Ticket.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: '$projectId',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      }
    ]);
    const map = new Map(ticketAgg.map((row) => [String(row._id), { total: row.total, completed: row.completed }]));

    res.json({
      success: true,
      data: projects.map((p) => {
        const counts = map.get(String(p._id)) || { total: 0, completed: 0 };
        const progress = counts.total === 0 ? 0 : Math.round((counts.completed / counts.total) * 100);
        return {
          _id: p._id,
          title: p.title,
          status: p.status,
          teamName: p.team?.name || 'Unknown Team',
          mentorName: p.mentor?.name || 'Unassigned',
          mentorEmail: p.mentor?.email || '',
          progress,
          tasks: counts
        };
      })
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

