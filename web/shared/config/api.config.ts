export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",

    timeout: 30000,

    headers: {
        "Content-Type": "application/json",
    },

    endpoints: {
        auth: {
            login: '/auth/login',
            logout: '/auth/logout',
            verify: '/auth/verify',
        },

        products: {
            list: "/products",
            create: "/products",

            get: (id: string) => `/products/${id}`,
            update: (id: string) => `/products/${id}`,
            softDelete: (id: string) => `/products/${id}`,
            delete: (id: string) => `/products/${id}/permanent`,
            restore: (id: string) => `/products/${id}/restore`,
            trash: "/products/deleted",

            softDeleteMany: "/products/batch",
            restoreMany: "/products/restore",
            deleteMany: "/products/batch/permanent"
        },

        categories: {
            list: "/product-categories",
            create: "/product-categories",

            get: (id: string) => `/product-categories/${id}`,
            update: (id: string) => `/product-categories/${id}`,
            delete: (id: string) => `/product-categories/${id}`,
        },

        requests: {
            list: "/requests",

            get: (id: string) => `/requests/${id}`,
            update: (id: string) => `/requests/${id}`,
        },
    },
} as const;

export type ApiEndpoint = typeof API_CONFIG.endpoints;