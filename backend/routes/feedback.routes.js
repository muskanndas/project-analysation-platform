import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import {
  createFeedback,
  getProjectFeedback,
  getStudentFeedback,
  updateFeedbackStatus
} from '../controllers/feedback.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/create', roleMiddleware(['mentor']), createFeedback);
router.get('/project/:projectId', roleMiddleware(['mentor', 'student']), getProjectFeedback);
router.patch('/update-status/:feedbackId', roleMiddleware(['student']), updateFeedbackStatus);
router.get('/student/my-feedback', roleMiddleware(['student']), getStudentFeedback);

export default router;
