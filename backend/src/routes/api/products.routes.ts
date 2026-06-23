import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '@/middleware/auth';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    getDeletedProducts,
    deletePermanently
} from '@/controllers/api/products.controller';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

router.get('/deleted', authMiddleware, getDeletedProducts);

// Rotas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rotas protegidas (admin)
router.post('/', authMiddleware, upload.single('image'), createProduct);
router.patch('/:id', authMiddleware, upload.single('image'), updateProduct);
router.patch('/:id/restore', authMiddleware, restoreProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.delete('/:id/delete-permanently', authMiddleware, deletePermanently);

export default router;