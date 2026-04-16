import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import {
  createTicket,
  deleteTicket,
  getMyTasks,
  getProjectProgress,
  getProjectTickets,
  updateTicketStatus
} from '../controllers/ticket.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.get('/project/:projectId', getProjectTickets);
router.post('/create', createTicket);
router.get('/my-tasks', getMyTasks);
router.patch('/update-status', updateTicketStatus);
router.delete('/:id', deleteTicket);
router.get('/project/:projectId/progress', getProjectProgress);

export default router;
