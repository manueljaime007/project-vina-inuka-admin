import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function POST(request: NextRequest) {
    try {
        console.log('📍 Route handler logout: Iniciando...');

        // Pegar o token do cookie da requisição
        const token = request.cookies.get('token')?.value;

        console.log('🍪 Token encontrado:', token ? 'SIM' : 'NÃO');

        // Fazer requisição para o backend apenas se tiver token
        if (token) {
            const backendUrl = `${BACKEND_URL}/auth/logout`;
            console.log('📍 Fazendo requisição para:', backendUrl);

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `token=${token}`,
                },
            });

            console.log('📡 Resposta do backend - Status:', response.status);
        } else {
            console.log('⚠️ Sem token para logout no backend');
        }

        // Criar resposta de sucesso
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Logout realizado com sucesso',
        });

        // Limpar o cookie no frontend
        nextResponse.cookies.delete('token');

        console.log('✅ Cookie deletado, logout concluído');

        return nextResponse;
    } catch (error) {
        console.error('❌ Erro no route handler de logout:', error);

        // Mesmo com erro, tentamos limpar o cookie local
        const nextResponse = NextResponse.json(
            {
                success: true,
                message: 'Sessão terminada localmente',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 200 } // Retornar 200 mesmo com erro no backend
        );

        // Limpar o cookie no frontend
        nextResponse.cookies.delete('token');

        return nextResponse;
    }
}