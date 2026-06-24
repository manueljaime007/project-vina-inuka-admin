import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4077/api/v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('📝 Route handler login - Body recebido:', { email: body.email, password: '***' });

        // Validar campos obrigatórios
        if (!body.email || !body.password) {
            console.log('❌ Campos faltando');
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const backendUrl = `${BACKEND_URL}/auth/login`;
        console.log('📍 Route handler: Fazendo requisição para:', backendUrl);

        // Fazer requisição para o backend
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('📡 Resposta do backend - Status:', response.status);

        const data = await response.json();
        console.log('📦 Dados do backend:', JSON.stringify(data, null, 2));

        // Se o login falhou, retornar erro
        if (!response.ok) {
            console.log('❌ Login falhou:', data.error);
            return NextResponse.json(
                { error: data.error || 'Credenciais inválidas' },
                { status: response.status }
            );
        }

        // Pegar o token do cookie da resposta do backend
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('🍪 Cookie recebido:', setCookieHeader ? 'SIM' : 'NÃO');

        // Criar resposta com os dados do admin
        const nextResponse = NextResponse.json({
            success: true,
            admin: data.admin,
        });

        // Se o backend enviou um cookie, repassar para o frontend
        if (setCookieHeader) {
            nextResponse.headers.set('set-cookie', setCookieHeader);
            console.log('✅ Cookie repassado para o frontend');
        }

        return nextResponse;
    } catch (error) {
        console.error('❌ Erro no route handler de login:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}