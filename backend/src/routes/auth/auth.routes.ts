import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { login, verifyToken } from '../controllers/api/auth.controller';

const router = Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

export default router;