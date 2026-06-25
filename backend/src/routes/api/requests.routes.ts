import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest,
    deleteManyRequests
} from '@/controllers/api/requests.controller'

const router = Router();

router.delete('/batch', authMiddleware, deleteManyRequests)

router.post('/', createRequest);
router.get('/', authMiddleware, getRequests);
router.get('/:id', authMiddleware, getRequestById);
router.delete('/:id', authMiddleware, deleteRequest)
router.patch('/:id/status', authMiddleware, updateRequestStatus);

export default router;