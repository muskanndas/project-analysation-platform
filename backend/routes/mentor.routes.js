import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import {
  getMentorProjects,
  getProjectProgress,
  getProjectReviewDetails,
  getProjectReviews,
  getProjectTasks,
  reviewProject
} from '../controllers/mentor.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['mentor']));

router.get('/projects', getMentorProjects);
router.get('/project/:id/review', getProjectReviewDetails);
router.post('/project/review', reviewProject);
router.get('/project/reviews/:projectId', getProjectReviews);
router.get('/project/:projectId/progress', getProjectProgress);
router.get('/project/:projectId/tasks', getProjectTasks);

export default router;
