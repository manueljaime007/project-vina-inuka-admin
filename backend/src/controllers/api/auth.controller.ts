import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../../config/supabase';


export const login = async (_req: Request, res: Response) => {
    res.json({
        message: 'Login ainda não implementado'
    });
};

export const verifyToken = async (_req: Request, res: Response) => {
    res.json({
        message: 'Token válido'
    });
};

