import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { addMember, createTeam, getMyTeam, removeMember } from '../controllers/team.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.post('/create', createTeam);
router.get('/my-team', getMyTeam);
router.post('/add-member', addMember);
router.delete('/remove-member/:userId', removeMember);

export default router;
