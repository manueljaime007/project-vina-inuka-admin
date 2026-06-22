import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/controllers/api/categories.controller';

const router = Router();

// Rotas públicas
router.get('/', getCategories);

// Rotas protegidas (admin)
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;