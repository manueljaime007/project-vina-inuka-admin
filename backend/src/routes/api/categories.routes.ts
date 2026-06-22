import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
} from '../../controllers/api/categories.controller';

const router = Router();

// Rotas públicas
router.get('/', getCategorias);

// Rotas protegidas (admin)
router.post('/', authMiddleware, createCategoria);
router.put('/:id', authMiddleware, updateCategoria);
router.delete('/:id', authMiddleware, deleteCategoria);

export default router;