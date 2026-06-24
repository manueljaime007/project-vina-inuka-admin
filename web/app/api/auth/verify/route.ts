import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4077/api/v1';

export async function GET(request: NextRequest) {
    try {
        // Pegar o token do cookie
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { valid: false, error: 'Token não fornecido' },
                { status: 401 }
            );
        }

        // Fazer requisição para o backend
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { valid: false, error: data.error || 'Token inválido' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            valid: true,
            admin: data.admin,
        });
    } catch (error) {
        console.error('Erro no route handler de verify:', error);
        return NextResponse.json(
            { valid: false, error: 'Erro ao verificar token' },
            { status: 500 }
        );
    }
}