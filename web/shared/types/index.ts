export type ProductStatus = "ativo" | "inativo";

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: "Vina" | "INUKA";
  categoryId: string;
  categoryName: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
}

export type RequestStatus = "pendente" | "em_processamento" | "concluida" | "cancelada";

export interface RequestItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ClientRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  items: RequestItem[];
  total: number;
  status: RequestStatus;
  createdAt: string;
}