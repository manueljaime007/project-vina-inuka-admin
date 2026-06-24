import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '@/config/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        const payload = {
            sub: admin.id,
            email: admin.email,
            name: admin.name
        };


        const token = jwt.sign(
            payload,
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );

        await supabase
            .from('admins')
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id);

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                avatar_url: admin.avatar_url
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, email, name, avatar_url')
            .eq('id', (decoded as any).sub)
            .single();

        if (error || !admin) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        res.json({ valid: true, admin });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};