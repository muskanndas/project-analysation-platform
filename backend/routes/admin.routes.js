import express from 'express';
import { createMentor, getDepartmentOverview } from '../controllers/admin.controller.js';
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

export default router;
