import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import productsRoutes from '@/routes/api/products.routes';
import categoriesRoutes from '@/routes/api/categories.routes';
import requestsRoutes from '@/routes/api/requests.routes';
import authRoutes from '@/routes/auth/auth.routes';

const app = express();

// Middlewares
app.use(cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    origin: '*',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/requests', requestsRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;