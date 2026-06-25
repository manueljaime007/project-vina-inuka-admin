import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← Desembrulhar o Promise
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/product-categories/${id}`, {
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
                { error: data.error || 'Categoria não encontrada' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← Desembrulhar o Promise
        const token = request.cookies.get('token')?.value;

        console.log('🔑 PATCH Categories - Token:', token ? '✅ Existe' : '❌ Não existe');
        console.log('🔑 PATCH Categories - ID:', id);

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado - Token não encontrado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('📦 PATCH Categories - Body:', body);

        const response = await fetch(`${BACKEND_URL}/product-categories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ PATCH Categories - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao atualizar categoria' },
                { status: response.status }
            );
        }

        console.log('✅ PATCH Categories - Sucesso:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ PATCH Categories - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← Desembrulhar o Promise
        const token = request.cookies.get('token')?.value;

        console.log('🔑 DELETE Categories - Token:', token ? '✅ Existe' : '❌ Não existe');
        console.log('🔑 DELETE Categories - ID:', id);

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado - Token não encontrado' },
                { status: 401 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/product-categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ DELETE Categories - Erro:', data);
            return NextResponse.json(
                { error: data.error || 'Erro ao eliminar categoria' },
                { status: response.status }
            );
        }

        console.log('✅ DELETE Categories - Sucesso');
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ DELETE Categories - Erro:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}