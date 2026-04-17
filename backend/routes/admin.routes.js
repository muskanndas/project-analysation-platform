import express from 'express';
import {
  createMentor,
  deleteMentor,
  deleteStudent,
  getAdminDashboard,
  getDepartmentOverview,
  getMentorMonitoring,
  getMentors,
  getProjects,
  getStudents,
  getTasks
} from '../controllers/admin.controller.js';
import {
  authMiddleware,
  roleMiddleware,
  seededAdminMiddleware
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));
router.use(seededAdminMiddleware);

router.post('/create-mentor', createMentor);
router.get('/department-overview', getDepartmentOverview);

router.get('/dashboard', getAdminDashboard);
router.get('/students', getStudents);
router.delete('/student/:id', deleteStudent);
router.get('/mentors', getMentors);
router.post('/mentor/create', createMentor);
router.delete('/mentor/:id', deleteMentor);
router.get('/projects', getProjects);
router.get('/tasks', getTasks);
router.get('/mentor-monitoring', getMentorMonitoring);

export default router;
