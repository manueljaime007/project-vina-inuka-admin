import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const backendUrl = queryString
            ? `${BACKEND_URL}/products?${queryString}`
            : `${BACKEND_URL}/products`;

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Erro ao buscar produtos' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        console.log('🔑 POST Product - Token:', token ? '✅ Existe' : '❌ Não existe');

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        // 🔑 Ler o FormData do request
        const formData = await request.formData();

        // 🔑 Log dos campos recebidos
        console.log('📦 POST Product - FormData recebido:');
        const entries: { key: string; value: any }[] = [];
        for (const [key, value] of formData.entries()) {
            const isFile = value instanceof File;
            entries.push({ key, value: isFile ? `[File: ${value.name}]` : value });
            console.log(`  ${key}: ${isFile ? `[File: ${value.name}]` : value}`);
        }

        // 🔑 Criar NOVO FormData para enviar ao backend (garantir que está limpo)
        const backendFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            backendFormData.append(key, value);
        }

        // 🔑 Debug: verificar o que está a ser enviado
        console.log('📤 Enviando para o backend:', BACKEND_URL);
        for (const [key, value] of backendFormData.entries()) {
            const isFile = value instanceof File;
            console.log(`  ${key}: ${isFile ? `[File: ${value.name}]` : value}`);
        }

        const response = await fetch(`${BACKEND_URL}/products`, {
            method: 'POST',
            headers: {
                // 🔑 NÃO definir Content-Type - o fetch vai definir com boundary automaticamente
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            body: backendFormData, // ← Enviar o FormData
        });

        const data = await response.json();
        console.log('📦 POST Product - Backend Status:', response.status);
        console.log('📦 POST Product - Backend Response:', data);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Erro ao criar produto' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ POST Product - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}