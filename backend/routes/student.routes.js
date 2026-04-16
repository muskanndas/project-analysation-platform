import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { getStudentDashboard } from '../controllers/student.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.get('/dashboard', getStudentDashboard);

export default router;
