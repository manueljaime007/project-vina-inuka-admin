import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequestStatus
} from '@/controllers/api/requests.controller'

const router = Router();

router.post('/', createRequest);

router.get('/', authMiddleware, getRequests);
router.get('/:id', authMiddleware, getRequestById);
router.patch('/:id/status', authMiddleware, updateRequestStatus);

export default router;