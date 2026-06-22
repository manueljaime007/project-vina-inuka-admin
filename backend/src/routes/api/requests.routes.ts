import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequestStatus
} from '@/controllers/api/requests.controller'

const router = Router();

// Rota pública (criar solicitação)
router.post('/', createRequest);

// Rotas protegidas (admin)
router.get('/', authMiddleware, getRequests);
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id/status', authMiddleware, updateRequestStatus);

export default router;