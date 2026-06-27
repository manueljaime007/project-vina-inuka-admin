"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, PackageX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyKz, formatDate } from "@/shared/helpers/utils";
import { EditProductModal } from "@/components/products/EditProductModal";
import { DeleteProductModal } from "@/components/products/DeleteProductModal";
import { useProducts } from "@/hooks/useProducts";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { getProductById, delete: deleteProduct } = useProducts();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return;
      const result = await getProductById(params.id);
      if (result.success) {
        setProduct(result.data);
      } else {
        setError(result.error || "Produto não encontrado");
      }
      setLoading(false);
    };
    loadProduct();
  }, [params.id]);

  async function handleDelete() {
    if (!product) return;
    const result = await deleteProduct(product.id);
    if (result.success) {
      showToast("Produto movido para o lixo.", "success");
      setDeleteOpen(false);
      router.push("/products");
    } else {
      showToast(result.error || "Erro ao eliminar produto", "danger");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <EmptyState
        icon={PackageX}
        title="Produto não encontrado"
        description="Este produto pode ter sido removido ou o link está incorreto."
        action={
          <Link href="/products" className="mt-2">
            <Button size="sm">Voltar a produtos</Button>
          </Link>
        }
      />
    );
  }


  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Voltar a produtos
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-1.5"
          >
            <Pencil className="size-[15px]" />
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="gap-1.5"
          >
            <Trash2 className="size-[15px]" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-line-soft bg-surface p-8 shadow-[var(--shadow-card)] sm:grid-cols-[280px_1fr]">
        <div className="aspect-square overflow-hidden rounded-2xl bg-brand-blush">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[30px] text-ink">
                {product.name}
              </h1>
              <Badge tone={product.active ? "success" : "neutral"}>
                {product.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="mt-1 text-[14px] text-ink-faint">/{product.slug}</p>
          </div>

          <p className="text-[15px] leading-relaxed text-ink-soft">
            {product.description || "Sem descrição"}
          </p>

          <div className="grid grid-cols-2 gap-5 rounded-xl bg-surface-sunken p-5 sm:grid-cols-4">
            <Detail
              label="Preço"
              value={`${formatCurrencyKz(product.price)} Kz`}
            />
            <Detail label="Stock" value={`${product.stock} unid.`} />
            <Detail
              label="Categoria"
              value={product.categories?.name || "Sem categoria"}
            />
            <Detail
              label="Status"
              value={product.active ? "Ativo" : "Inativo"}
            />
          </div>

          <p className="text-[13px] text-ink-faint">
            Adicionado em {formatDate(product.created_at)}
          </p>
        </div>
      </div>

      <EditProductModal
        open={editOpen}
        product={product}
        onClose={() => setEditOpen(false)}
        onSave={() => {
          showToast("Produto atualizado com sucesso.", "success");
          setEditOpen(false);
        }}
      />

      <DeleteProductModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        productNames={[product.name]}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}
