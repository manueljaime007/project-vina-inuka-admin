import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

// GET - Buscar produto por ID (público)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get('token')?.value;

        console.log('🔍 Route Handler - Product ID:', id);
        console.log('🔍 Route Handler - Token:', token ? '✅ Existe' : '❌ Não existe');

        // 🔑 Construir URL do backend
        const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';
        const backendUrl = `${BACKEND_URL}/products/${id}`;
        console.log('🔍 Route Handler - Backend URL:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {
                    'Authorization': `Bearer ${token}`,
                    'Cookie': `token=${token}`,
                }),
            },
        });

        console.log('🔍 Route Handler - Backend Status:', response.status);

        const data = await response.json();
        console.log('🔍 Route Handler - Backend Data:', data);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Produto não encontrado' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ Erro no route handler:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// PATCH - Atualizar produto (admin)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        console.log('📦 PATCH Product by ID:', id);

        const response = await fetch(`${BACKEND_URL}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Erro ao atualizar produto' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// DELETE - Soft delete (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        console.log('🗑️ DELETE Product by ID:', id);

        const response = await fetch(`${BACKEND_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Erro ao eliminar produto' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao eliminar produto:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}