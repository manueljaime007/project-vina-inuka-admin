export interface Category {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    image_url: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Request {
    id: string;
    customer_name: string;
    customer_phone: string;
    products: Array<{
        product_id: string;
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Admin {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar_url: string | null;
    created_at: string;
    last_login: string | null;
}

export interface JWTPayload {
    sub: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
}
