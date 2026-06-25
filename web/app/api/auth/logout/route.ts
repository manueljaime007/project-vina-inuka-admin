import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (token) {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    Cookie: `token=${token}`,
                },
            });
        }

        const response = NextResponse.json({
            success: true,
            message: 'Logout realizado com sucesso',
        });

        // Limpar o cookie
        response.cookies.delete('token');

        return response;
    } catch (error) {
        // Mesmo com erro, limpar o cookie
        const response = NextResponse.json({
            success: true,
            message: 'Sessão terminada',
        });
        response.cookies.delete('token');
        return response;
    }
}