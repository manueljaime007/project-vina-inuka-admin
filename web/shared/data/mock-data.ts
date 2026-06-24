import { Category, ClientRequest, Product } from "@/shared/types";

export const categories: Category[] = [
  { id: "cat-1", name: "Cuidado Facial" },
  { id: "cat-2", name: "Hidratação" },
  { id: "cat-3", name: "Fragrância" },
  { id: "cat-4", name: "Maquilhagem" },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Sérum Iluminador",
    slug: "serum-iluminador",
    brand: "Vina",
    categoryId: "cat-1",
    categoryName: "Cuidado Facial",
    price: 48,
    stock: 24,
    status: "ativo",
    description:
      "Um sérum leve e sedoso que devolve a vitalidade à pele cansada. Formulado com vitamina C estabilizada, ácido hialurónico e extrato de magnólia, suaviza manchas e revela um tom mais uniforme.",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Creme Restaurador",
    slug: "creme-restaurador",
    brand: "INUKA",
    categoryId: "cat-2",
    categoryName: "Hidratação",
    price: 62,
    stock: 18,
    status: "ativo",
    description:
      "Creme rico em manteiga de karité e ceramidas que restaura a barreira da pele, deixando-a nutrida e macia durante todo o dia.",
    imageUrl:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop",
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "Eau de Parfum Rosé",
    slug: "eau-de-parfum-rose",
    brand: "INUKA",
    categoryId: "cat-3",
    categoryName: "Fragrância",
    price: 89,
    stock: 12,
    status: "ativo",
    description:
      "Uma fragrância floral e envolvente, com notas de rosa búlgara, baga-rosa e um fundo amadeirado quente que perdura ao longo do dia.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    createdAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "Batom Velvet Coral",
    slug: "batom-velvet-coral",
    brand: "Vina",
    categoryId: "cat-4",
    categoryName: "Maquilhagem",
    price: 28,
    stock: 40,
    status: "ativo",
    description:
      "Textura aveludada de alta pigmentação e longa duração, num tom coral versátil que ilumina qualquer rotina.",
    imageUrl:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
    createdAt: "2026-06-10T10:00:00Z",
  },
];

export const trashedProducts: Product[] = [
  {
    id: "prod-9",
    name: "Óleo Corporal Âmbar",
    slug: "oleo-corporal-ambar",
    brand: "INUKA",
    categoryId: "cat-2",
    categoryName: "Hidratação",
    price: 54,
    stock: 0,
    status: "inativo",
    description:
      "Óleo seco de absorção rápida com âmbar e flor de laranjeira, para uma pele macia e perfumada.",
    imageUrl:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop",
    createdAt: "2026-03-02T10:00:00Z",
    deletedAt: "2026-06-15T09:30:00Z",
  },
];

export const clientRequests: ClientRequest[] = [
  {
    id: "req-1",
    customerName: "Sofia Marques",
    customerPhone: "+244 923 000 111",
    items: [
      { id: "i1", productName: "Eau de Parfum Rosé", quantity: 1, unitPrice: 89 },
      { id: "i2", productName: "Batom Velvet Coral", quantity: 0.5, unitPrice: 28 },
    ],
    total: 104,
    status: "pendente",
    createdAt: "2026-06-23T10:03:15Z",
  },
  {
    id: "req-2",
    customerName: "Beatriz Lopes",
    customerPhone: "+244 924 555 222",
    items: [{ id: "i3", productName: "Eau de Parfum Rosé", quantity: 1, unitPrice: 89 }],
    total: 89,
    status: "em_processamento",
    createdAt: "2026-06-22T10:03:15Z",
  },
];