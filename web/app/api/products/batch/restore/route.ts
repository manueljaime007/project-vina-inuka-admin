import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        console.log('🔑 PUT Restore Batch - Token:', token ? '✅ Existe' : '❌ Não existe');

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        // 🔑 Ler o body como texto primeiro para debug
        const rawBody = await request.text();
        console.log('📦 PUT Restore Batch - Raw Body:', rawBody);

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return NextResponse.json(
                { error: 'Body inválido' },
                { status: 400 }
            );
        }

        console.log('📦 PUT Restore Batch - Parsed Body:', body);

        if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
            return NextResponse.json(
                { error: 'Envie um array de IDs válido' },
                { status: 400 }
            );
        }

        console.log('📦 PUT Restore Batch - IDs:', body.ids);

        const response = await fetch(`${BACKEND_URL}/products/batch/restore`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            body: JSON.stringify({ ids: body.ids }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ PUT Restore Batch - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao restaurar produtos' },
                { status: response.status }
            );
        }

        console.log('✅ PUT Restore Batch - Sucesso:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ PUT Restore Batch - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}