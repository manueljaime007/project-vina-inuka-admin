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

        const backendUrl = `${BACKEND_URL}/products/deleted`;

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
            console.error('❌ GET Trash - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao buscar produtos no lixo' },
                { status: response.status }
            );
        }

        console.log('✅ GET Trash - Sucesso:', data.length || 0, 'produtos');
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ GET Trash - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}