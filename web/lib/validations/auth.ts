import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .email('Formato de email inválido')
        .min(1, 'O email é obrigatório'),
    password: z.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;