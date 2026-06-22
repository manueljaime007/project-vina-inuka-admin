import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../middleware/auth';
import {
    getProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
} from '../../controllers/api/products.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Rotas públicas
router.get('/', getProdutos);
router.get('/:id', getProdutoById);

// Rotas protegidas (admin)
router.post('/', authMiddleware, upload.single('imagem'), createProduto);
router.put('/:id', authMiddleware, upload.single('imagem'), updateProduto);
router.delete('/:id', authMiddleware, deleteProduto);

export default router;