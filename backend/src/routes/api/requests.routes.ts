import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    createSolicitacao,
    getSolicitacoes,
    getSolicitacaoById,
    updateSolicitacaoStatus,
} from '../../controllers/api/requests.controller';

const router = Router();

// Rota pública (criar solicitação)
router.post('/', createSolicitacao);

// Rotas protegidas (admin)
router.get('/', authMiddleware, getSolicitacoes);
router.get('/:id', authMiddleware, getSolicitacaoById);
router.put('/:id/status', authMiddleware, updateSolicitacaoStatus);

export default router;