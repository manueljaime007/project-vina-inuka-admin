import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        console.log('GET Categories - Token:', token ? '✅ Existe' : '❌ Não existe');

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado - Token não encontrado' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const backendUrl = queryString
            ? `${BACKEND_URL}/product-categories?${queryString}`
            : `${BACKEND_URL}/product-categories`;

        console.log('📍 GET Categories - URL:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // ← Adicionar token no header
                'Cookie': `token=${token}`, // ← Também enviar no cookie
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ GET Categories - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao buscar categorias' },
                { status: response.status }
            );
        }

        console.log('✅ GET Categories - Sucesso:', data.data?.length || 0, 'categorias');
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ GET Categories - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // 🔑 Pegar token do cookie
        const token = request.cookies.get('token')?.value;

        console.log('🔑 POST Categories - Token:', token ? '✅ Existe' : '❌ Não existe');

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado - Token não encontrado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('📦 POST Categories - Body:', body);

        const response = await fetch(`${BACKEND_URL}/product-categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // ← Adicionar token no header
                'Cookie': `token=${token}`, // ← Também enviar no cookie
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ POST Categories - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao criar categoria' },
                { status: response.status }
            );
        }

        console.log('✅ POST Categories - Sucesso:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ POST Categories - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}