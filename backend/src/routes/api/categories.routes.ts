import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
} from '@/controllers/api/categories.controller';

const router = Router();

// Rotas públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rotas protegidas (admin)
router.post('/', authMiddleware, createCategory);
router.patch('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;