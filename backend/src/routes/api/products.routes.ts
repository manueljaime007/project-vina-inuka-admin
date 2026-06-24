import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '@/middleware/auth';
import {
    getProducts,
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

router.delete('/batch', authMiddleware, deleteManyProducts);
router.put('/batch/restore', authMiddleware, restoreManyProducts);
router.delete('/batch/permanent', authMiddleware, deleteManyProductsPermanent);

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

router.post('/', authMiddleware, upload.single('image'), createProduct);
router.patch('/:id', authMiddleware, upload.single('image'), updateProduct);
router.patch('/:id/restore', authMiddleware, restoreProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.delete('/:id/permanent', authMiddleware, deletePermanently);

export default router;