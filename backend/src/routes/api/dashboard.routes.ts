import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { getDashboardStats } from '@/controllers/api/dashboard.controller';

const router = Router();

router.get('/', authMiddleware, getDashboardStats);

export default router;