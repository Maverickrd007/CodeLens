import { Router } from 'express';

import { uploadCodebase } from '../controllers/codebaseController.js';
import { requireAuth } from '../middleware/auth.js';
import { codebaseUpload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', requireAuth, codebaseUpload, uploadCodebase);

export default router;
