// shared/mappers/product.mapper.ts

import { Product as ApiProduct } from '@/services/products.service';
import { Product } from '@/shared/types';

export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        brand: 'Vina', // ou 'INUKA' - ajustar conforme lógica
        categoryId: apiProduct.category_id,
        categoryName: apiProduct.categories?.name || 'Sem categoria',
        price: apiProduct.price,
        stock: apiProduct.stock,
        status: apiProduct.active ? 'ativo' : 'inativo',
        description: apiProduct.description || '',
        imageUrl: apiProduct.image_url,
        createdAt: apiProduct.created_at,
        deletedAt: apiProduct.deleted_at,
    };
}

export function mapProductToApiProduct(product: Product): Partial<ApiProduct> {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category_id: product.categoryId,
        price: product.price,
        stock: product.stock,
        active: product.status === 'ativo',
        description: product.description,
        image_url: product.imageUrl,
        created_at: product.createdAt,
        deleted_at: product.deletedAt,
    };
}