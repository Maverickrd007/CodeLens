import { Router } from 'express';

import { askCodebase } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/ask', requireAuth, aiRateLimiter, askCodebase);

export default router;
