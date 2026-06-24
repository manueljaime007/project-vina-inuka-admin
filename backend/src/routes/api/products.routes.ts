import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '@/middleware/auth';
import {
    getProducts,
    getProductById,
    getDeletedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    deletePermanently,
    deleteManyProducts,
    restoreManyProducts,
    deleteManyProductsPermanent,
    getProductBySlug
} from '@/controllers/api/products.controller';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

router.get('/deleted', authMiddleware, getDeletedProducts);

// Rotas batch (devem vir antes de /:id)
router.delete('/batch', authMiddleware, deleteManyProducts);
router.put('/batch/restore', authMiddleware, restoreManyProducts);
router.delete('/batch/permanent', authMiddleware, deleteManyProductsPermanent);

// Rotas públicas (depois das específicas)
router.get('/', getProducts);
// router.get('/:id', getProductById);
router.get('/:slug', getProductBySlug);

// Rotas protegidas com parâmetros (depois das específicas)
router.post('/', authMiddleware, upload.single('image'), createProduct);
router.patch('/:id', authMiddleware, upload.single('image'), updateProduct);
router.patch('/:id/restore', authMiddleware, restoreProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.delete('/:id/permanent', authMiddleware, deletePermanently);

export default router;