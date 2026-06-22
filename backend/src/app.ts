import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import produtosRoutes from './routes/api/products.routes';
import categoriasRoutes from './routes/api/categories.routes';
import solicitacoesRoutes from './routes/api/requests.routes';
import authRoutes from './routes/auth/auth.routes';

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/solicitacoes', solicitacoesRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;