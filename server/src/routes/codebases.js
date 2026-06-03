import { Router } from 'express';

import { ingestGithubCodebase, uploadCodebase } from '../controllers/codebaseController.js';
import { requireAuth } from '../middleware/auth.js';
import { codebaseUpload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', requireAuth, codebaseUpload, uploadCodebase);
router.post('/github', requireAuth, ingestGithubCodebase);

export default router;
