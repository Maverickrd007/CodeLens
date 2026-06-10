import { Router } from 'express';

import {
  addMessage,
  createSession,
  deleteSession,
  getSession,
  getSessions,
  updateSession,
} from '../controllers/sessionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.patch('/:id', updateSession);
router.delete('/:id', deleteSession);
router.post('/:id/messages', addMessage);

export default router;
