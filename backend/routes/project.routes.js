import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { createProject, getMyProject } from '../controllers/project.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.post('/create', createProject);
router.get('/my-project', getMyProject);

export default router;
