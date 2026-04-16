import Project from '../models/project.model.js';
import ProjectReview from '../models/projectReview.model.js';
import Ticket from '../models/ticket.model.js';
import ActivityLog from '../models/activityLog.model.js';
import Report from '../models/report.model.js';

const findMentorProject = (projectId, mentorId) =>
  Project.findOne({ _id: projectId, mentor: mentorId }).populate({
    path: 'team',
    populate: [
      { path: 'leader', select: 'name email department' },
      { path: 'members', select: 'name email department' }
    ]
  });

export const getMentorProjects = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status).trim() : null;
    const query = { mentor: req.user._id };
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('team', 'name')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: projects.map((project) => ({
        _id: project._id,
        title: project.title,
        teamName: project.team?.name || 'Unknown Team',
        status: project.status
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load mentor projects.', error: error.message });
  }
};

export const getProjectReviewDetails = async (req, res) => {
  try {
    const project = await findMentorProject(req.params.id, req.user._id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load project details.', error: error.message });
  }
};

export const reviewProject = async (req, res) => {
  try {
    const { projectId, action, comment } = req.body;
    if (!projectId || !action || !comment || !String(comment).trim()) {
      return res.status(400).json({ success: false, message: 'projectId, action and comment are required.' });
    }
    if (!['approved', 'rejected', 'changes_requested'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid review action.' });
    }

    const project = await Project.findOne({ _id: projectId, mentor: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }
    if (project.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending projects can be reviewed.' });
    }

    project.status = action;
    await project.save();

    const version = (await ProjectReview.countDocuments({ project: project._id })) + 1;
    const review = await ProjectReview.create({
      project: project._id,
      mentor: req.user._id,
      action,
      comment: String(comment).trim(),
      version
    });

    await ActivityLog.create({
      project: project._id,
      actor: req.user._id,
      message: `Mentor marked project as ${action.replace('_', ' ')}`
    });

    res.json({ success: true, message: 'Project reviewed successfully.', data: { project, review } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not review project.', error: error.message });
  }
};

export const getProjectReviews = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, mentor: req.user._id }).select('_id');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }

    const reviews = await ProjectReview.find({ project: project._id })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load review history.', error: error.message });
  }
};

export const getProjectProgress = async (req, res) => {
  try {
    const project = await findMentorProject(req.params.projectId, req.user._id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }
    if (project.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Progress view is available only for approved projects.' });
    }

    const [tasks, activityLogs, reports] = await Promise.all([
      Ticket.find({ projectId: project._id }).populate('assignedTo', 'name email').sort({ createdAt: -1 }),
      ActivityLog.find({ project: project._id }).populate('actor', 'name email').sort({ createdAt: -1 }).limit(20),
      Report.find({ project: project._id }).sort({ createdAt: -1 })
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;
    const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      success: true,
      data: {
        project: {
          _id: project._id,
          title: project.title,
          status: project.status
        },
        progress,
        summary: {
          completed: completedTasks,
          inProgress: inProgressTasks,
          pending: pendingTasks,
          total: totalTasks
        },
        tasks,
        activityLogs,
        reports
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load progress dashboard.', error: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const project = await findMentorProject(req.params.projectId, req.user._id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for this mentor.' });
    }
    if (project.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Task view is available only for approved projects.' });
    }

    const tasks = await Ticket.find({ projectId: project._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load project tasks.', error: error.message });
  }
};
