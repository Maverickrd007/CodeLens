import { Router } from 'express';

import { askCodebase } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/ask', requireAuth, askCodebase);

export default router;
