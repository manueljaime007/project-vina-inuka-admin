import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

     

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const backendUrl = `${BACKEND_URL}/dashboard`;

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
        });

        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Dashboard API - Erro ao parsear JSON:', parseError);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Resposta inválida do backend',
                    raw: responseText.substring(0, 500)
                },
                { status: 500 }
            );
        }

        if (!response.ok) {
            console.error('Dashboard API - Backend error:', response.status, data);
            return NextResponse.json(
                { success: false, error: data.error || 'Erro ao buscar dados do dashboard' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Dashboard API - Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}