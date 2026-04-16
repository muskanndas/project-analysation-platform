import Team from '../models/team.model.js';
import Project from '../models/project.model.js';

export const getStudentDashboard = async (req, res) => {
  try {
    const team = await Team.findOne({ members: req.user._id })
      .populate('leader', 'name email')
      .populate('members', 'name email department');

    if (!team) {
      return res.json({
        success: true,
        data: {
          team: null,
          project: null,
          mentor: null
        }
      });
    }

    const project = await Project.findOne({ team: team._id }).populate('mentor', 'name email department');

    res.json({
      success: true,
      data: {
        team,
        project,
        mentor: project?.mentor || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load dashboard.', error: error.message });
  }
};
