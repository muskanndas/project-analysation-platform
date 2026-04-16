import Feedback from '../models/feedback.model.js';
import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import ActivityLog from '../models/activityLog.model.js';

export const createFeedback = async (req, res) => {
  try {
    const { projectId, message, category, priority } = req.body;
    if (!projectId || !message || !category) {
      return res.status(400).json({ success: false, message: 'projectId, message and category are required.' });
    }

    const project = await Project.findOne({ _id: projectId, mentor: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }

    const feedback = await Feedback.create({
      project: project._id,
      mentor: req.user._id,
      message: String(message).trim(),
      category,
      priority: priority || 'medium'
    });

    await ActivityLog.create({
      project: project._id,
      actor: req.user._id,
      message: 'Mentor created new feedback item.'
    });

    res.status(201).json({ success: true, message: 'Feedback created.', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not create feedback.', error: error.message });
  }
};

export const getProjectFeedback = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (req.user.role === 'mentor' && String(project.mentor) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only assigned mentor can view project feedback.' });
    }

    if (req.user.role === 'student') {
      const team = await Team.findOne({ members: req.user._id, _id: project.team }).select('_id');
      if (!team) {
        return res.status(403).json({ success: false, message: 'You do not belong to this project team.' });
      }
    }

    const feedback = await Feedback.find({ project: projectId })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load feedback.', error: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be in_progress or resolved.' });
    }

    const feedback = await Feedback.findById(req.params.feedbackId).populate('project');
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }

    const team = await Team.findOne({ _id: feedback.project.team, members: req.user._id }).select('_id');
    if (!team) {
      return res.status(403).json({ success: false, message: 'You do not belong to this project team.' });
    }

    feedback.status = status;
    await feedback.save();

    await ActivityLog.create({
      project: feedback.project._id,
      actor: req.user._id,
      message: `Student updated feedback status to ${status.replace('_', ' ')}.`
    });

    res.json({ success: true, message: 'Feedback status updated.', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update feedback status.', error: error.message });
  }
};

export const getStudentFeedback = async (req, res) => {
  try {
    const team = await Team.findOne({ members: req.user._id }).select('_id');
    if (!team) {
      return res.status(404).json({ success: false, message: 'You are not in a team yet.' });
    }
    const project = await Project.findOne({ team: team._id }).select('_id title');
    if (!project) {
      return res.status(404).json({ success: false, message: 'No project found for your team.' });
    }
    const feedback = await Feedback.find({ project: project._id }).populate('mentor', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { project, feedback } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load student feedback.', error: error.message });
  }
};
