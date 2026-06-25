import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        console.log('🔑 DELETE Batch - Token:', token ? '✅ Existe' : '❌ Não existe');

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado - Token não encontrado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('📦 DELETE Batch - Body:', body);

        if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
            return NextResponse.json(
                { error: 'Envie um array de IDs válido' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/requests/batch`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            body: JSON.stringify({ ids: body.ids }),
        });

        const data = await response.json();
        console.log('📦 DELETE Batch - Response:', data);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Erro ao eliminar solicitações' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ DELETE Batch - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}