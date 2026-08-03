import { Router } from 'express';

import { getCurrentUser, login, logout, refresh, register, googleLogin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getCurrentUser);

export default router;
