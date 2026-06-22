export interface Categoria {
    id: string;
    nome: string;
    descricao: string;
    created_at: string;
    updated_at: string;
}

export interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade_estoque: number;
    categoria_id: string;
    ativo: boolean;
    imagem_url: string;
    created_at: string;
    updated_at: string;
}

export interface Solicitacao {
    id: string;
    cliente_nome: string;
    cliente_telefone: string;
    cliente_email?: string;
    produtos: Array<{
        produto_id: string;
        quantidade: number;
        preco_unitario: number;
    }>;
    total: number;
    status: 'pendente' | 'entregue' | 'cancelada';
    mensagem_whatsapp: string;
    created_at: string;
    updated_at: string;
}

export interface AdminUser {
    id: string;
    google_id: string;
    email: string;
    nome: string;
    imagem_perfil?: string;
    created_at: string;
    last_login: string;
}

export interface JWTPayload {
    sub: string;
    email: string;
    iat: number;
    exp: number;
}