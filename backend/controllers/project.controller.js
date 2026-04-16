import Team from '../models/team.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';

const parseTechStack = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const assignMentorForDepartment = async (department) => {
  const mentors = await User.find({ role: 'mentor', department }).select('_id name email department');
  if (!mentors.length) {
    return null;
  }

  const mentorIds = mentors.map((mentor) => mentor._id);
  const load = await Project.aggregate([
    { $match: { mentor: { $in: mentorIds } } },
    { $group: { _id: '$mentor', count: { $sum: 1 } } }
  ]);
  const countMap = new Map(load.map((item) => [String(item._id), item.count]));

  mentors.sort((a, b) => {
    const countA = countMap.get(String(a._id)) || 0;
    const countB = countMap.get(String(b._id)) || 0;
    return countA - countB;
  });

  return mentors[0];
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, category } = req.body;
    const parsedTechStack = parseTechStack(techStack);

    if (!title || !description || !category || !parsedTechStack.length) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, tech stack, and category are required.'
      });
    }

    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Create a team before submitting a project.' });
    }
    if (String(team.leader) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only team leader can submit project.' });
    }

    let project = await Project.findOne({ team: team._id });
    const isResubmission = Boolean(project);
    if (project && !['rejected', 'changes_requested'].includes(project.status)) {
      return res.status(400).json({ success: false, message: 'This team already has a project submission.' });
    }

    const mentor = await assignMentorForDepartment(team.department);
    const payload = {
      title: String(title).trim(),
      description: String(description).trim(),
      techStack: parsedTechStack,
      category: String(category).trim(),
      status: 'pending',
      mentor: mentor?._id || null
    };

    if (project) {
      project.set(payload);
      await project.save();
    } else {
      project = await Project.create({ team: team._id, ...payload });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('mentor', 'name email department')
      .populate({ path: 'team', populate: { path: 'leader members', select: 'name email department' } });

    res.status(isResubmission ? 200 : 201).json({
      success: true,
      message: 'Project submitted successfully.',
      data: {
        project: populatedProject,
        mentorAssigned: Boolean(mentor),
        mentor: mentor
          ? { id: mentor._id, name: mentor.name, email: mentor.email, department: mentor.department }
          : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not submit project.', error: error.message });
  }
};

export const getMyProject = async (req, res) => {
  try {
    const team = await Team.findOne({ members: req.user._id });
    if (!team) {
      return res.status(404).json({ success: false, message: 'You are not in a team yet.' });
    }

    const project = await Project.findOne({ team: team._id })
      .populate('mentor', 'name email department')
      .populate({
        path: 'team',
        populate: [
          { path: 'leader', select: 'name email department' },
          { path: 'members', select: 'name email department' }
        ]
      });

    if (!project) {
      return res.status(404).json({ success: false, message: 'No project found for your team.' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch project details.', error: error.message });
  }
};
