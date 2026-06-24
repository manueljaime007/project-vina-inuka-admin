import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { login, logout, verifyToken } from '@/controllers/api/auth.controller';


const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);

export default router;