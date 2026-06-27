import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Credenciais inválidas' },
                { status: response.status }
            );
        }

        const setCookieHeader = response.headers.get('set-cookie');
       

        const nextResponse = NextResponse.json({
            success: true,
            admin: data.admin,
        });

        if (setCookieHeader) {
            nextResponse.headers.set('set-cookie', setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}