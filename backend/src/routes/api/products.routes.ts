import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '@/middleware/auth';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '@/controllers/api/products.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Rotas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rotas protegidas (admin)
router.post('/', authMiddleware, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;