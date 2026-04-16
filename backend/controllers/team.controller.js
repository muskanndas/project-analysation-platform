import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Project from '../models/project.model.js';

const getStudentTeam = (userId) => Team.findOne({ members: userId });

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Team name is required.' });
    }

    const existingTeam = await getStudentTeam(req.user._id);
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'You are already part of a team.' });
    }

    const team = await Team.create({
      name: String(name).trim(),
      department: req.user.department,
      leader: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({ success: true, message: 'Team created successfully.', data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not create team.', error: error.message });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ members: req.user._id })
      .populate('leader', 'name email department')
      .populate('members', 'name email department');

    if (!team) {
      return res.status(404).json({ success: false, message: 'You are not in a team.' });
    }

    const project = await Project.findOne({ team: team._id }).populate('mentor', 'name email');

    res.json({ success: true, data: { team, project } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch team details.', error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: 'Member email is required.' });
    }

    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found for current student.' });
    }
    if (String(team.leader) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only team leader can add members.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase(), role: 'student' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student email not found.' });
    }
    if (user.department !== team.department) {
      return res.status(400).json({ success: false, message: 'Student belongs to a different department.' });
    }

    const existingTeam = await Team.findOne({ members: user._id });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'This student is already in another team.' });
    }

    team.members.push(user._id);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email')
      .populate('members', 'name email department');

    res.json({ success: true, message: 'Member added successfully.', data: populatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not add member.', error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found for current student.' });
    }
    if (String(team.leader) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only team leader can remove members.' });
    }
    if (String(userId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Leader cannot remove themselves.' });
    }
    if (!team.members.some((memberId) => String(memberId) === String(userId))) {
      return res.status(404).json({ success: false, message: 'Member is not part of your team.' });
    }

    team.members = team.members.filter((memberId) => String(memberId) !== String(userId));
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email')
      .populate('members', 'name email department');

    res.json({ success: true, message: 'Member removed successfully.', data: populatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not remove member.', error: error.message });
  }
};
