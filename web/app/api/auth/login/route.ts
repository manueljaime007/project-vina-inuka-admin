import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📦 Login - Email:', body.email);

        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log('📦 Login - Response status:', response.status);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Credenciais inválidas' },
                { status: response.status }
            );
        }

        // 🔑 Pegar o cookie do backend
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('🍪 Login - Cookie recebido:', setCookieHeader ? '✅ Sim' : '❌ Não');

        const nextResponse = NextResponse.json({
            success: true,
            admin: data.admin,
        });

        // Repassar o cookie para o frontend
        if (setCookieHeader) {
            nextResponse.headers.set('set-cookie', setCookieHeader);
            console.log('✅ Login - Cookie repassado para o frontend');
        }

        return nextResponse;
    } catch (error) {
        console.error('❌ Login - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}