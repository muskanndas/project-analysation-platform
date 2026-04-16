import Ticket from '../models/ticket.model.js';
import Team from '../models/team.model.js';
import Project from '../models/project.model.js';
import ActivityLog from '../models/activityLog.model.js';

const getTeamAndApprovedProject = async (userId) => {
  const team = await Team.findOne({ members: userId }).populate('members', 'name email');
  if (!team) {
    return { error: 'You are not part of any team.' };
  }
  const project = await Project.findOne({ team: team._id });
  if (!project) {
    return { error: 'No project found for your team.' };
  }
  if (project.status !== 'approved') {
    return { error: 'Tasks are allowed only when project is approved.' };
  }
  return { team, project };
};

export const getProjectTickets = async (req, res) => {
  try {
    const { projectId } = req.params;
    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(403).json({ success: false, message: 'You are not part of any team.' });
    }
    const project = await Project.findOne({ _id: projectId, team: team._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for your team.' });
    }

    const tickets = await Ticket.find({ projectId: project._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load tickets.', error: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, deadline } = req.body;
    if (!title || !description || !assignedTo || !priority || !deadline) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const context = await getTeamAndApprovedProject(req.user._id);
    if (context.error) {
      return res.status(400).json({ success: false, message: context.error });
    }
    const { team, project } = context;

    if (String(team.leader) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only team leader can create tasks.' });
    }
    if (!team.members.some((member) => String(member._id) === String(assignedTo))) {
      return res.status(400).json({ success: false, message: 'Assigned user must belong to your team.' });
    }

    const ticket = await Ticket.create({
      title: String(title).trim(),
      description: String(description).trim(),
      projectId: project._id,
      teamId: team._id,
      assignedTo,
      priority,
      deadline: new Date(deadline),
      createdBy: req.user._id
    });

    await ActivityLog.create({
      project: project._id,
      actor: req.user._id,
      message: `Task "${ticket.title}" created and assigned.`
    });

    const populated = await Ticket.findById(ticket._id).populate('assignedTo', 'name email');
    res.status(201).json({ success: true, message: 'Task created successfully.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not create task.', error: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Ticket.find({ assignedTo: req.user._id })
      .populate('projectId', 'title status')
      .sort({ deadline: 1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load my tasks.', error: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    if (!ticketId || !status) {
      return res.status(400).json({ success: false, message: 'ticketId and status are required.' });
    }
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid task status.' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const team = await Team.findById(ticket.teamId).select('leader members');
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found for this task.' });
    }
    const isLeader = String(team.leader) === String(req.user._id);
    const isAssignee = String(ticket.assignedTo) === String(req.user._id);
    if (!isLeader && !isAssignee) {
      return res.status(403).json({ success: false, message: 'You can update only your assigned task.' });
    }

    ticket.status = status;
    await ticket.save();

    await ActivityLog.create({
      project: ticket.projectId,
      actor: req.user._id,
      message: `Task "${ticket.title}" marked ${status}.`
    });

    const populated = await Ticket.findById(ticket._id).populate('assignedTo', 'name email');
    res.json({ success: true, message: 'Task status updated.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update task status.', error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const team = await Team.findById(ticket.teamId).select('leader members');
    if (!team || !team.members.some((memberId) => String(memberId) === String(req.user._id))) {
      return res.status(403).json({ success: false, message: 'You do not belong to this task team.' });
    }
    if (String(team.leader) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only leader can delete tasks.' });
    }

    await Ticket.findByIdAndDelete(ticket._id);
    await ActivityLog.create({
      project: ticket.projectId,
      actor: req.user._id,
      message: `Task "${ticket.title}" deleted.`
    });

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete task.', error: error.message });
  }
};

export const getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(403).json({ success: false, message: 'You are not part of any team.' });
    }
    const project = await Project.findOne({ _id: projectId, team: team._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found for your team.' });
    }

    const total = await Ticket.countDocuments({ projectId: project._id });
    const completed = await Ticket.countDocuments({ projectId: project._id, status: 'completed' });
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({ success: true, data: { total, completed, progress } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load project progress.', error: error.message });
  }
};
