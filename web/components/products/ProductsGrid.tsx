"use client";

import Link from "next/link";
import { Pencil, Trash2, Package } from "lucide-react";
import { Product } from "@/shared/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { formatCurrencyKz } from "@/shared/helpers/utils";
import { cn } from "@/shared/helpers/utils";

interface ProductsGridProps {
  products: Product[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsGrid({
  products,
  selectedIds,
  onToggle,
  onEdit,
  onDelete,
}: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const checked = selectedIds.has(product.id);
        const isLowStock = product.stock <= 5;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-surface transition-shadow",
              checked
                ? "border-brand-navy shadow-[var(--shadow-card)]"
                : "border-line-soft hover:shadow-[var(--shadow-card)]",
              isOutOfStock && "opacity-70",
            )}
          >
            <div className="absolute left-3 top-3 z-10">
              <span className="flex size-7 items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm">
                <Checkbox
                  checked={checked}
                  onChange={() => onToggle(product.id)}
                />
              </span>
            </div>

            {/* Stock badge no canto superior direito */}
            <div className="absolute right-3 top-3 z-10">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm",
                  isOutOfStock
                    ? "bg-danger-bg/90 text-danger"
                    : isLowStock
                      ? "bg-warning-bg/90 text-warning-ink"
                      : "bg-success-bg/90 text-success-ink",
                )}
              >
                <Package className="size-3" />
                {product.stock}
              </span>
            </div>

            <Link href={`/products/${product.id}`} className="block">
              <div className="aspect-square w-full bg-brand-blush">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
            </Link>

            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/products/${product.id}`}>
                  <p className="text-[14.5px] font-medium text-ink hover:underline">
                    {product.name}
                  </p>
                  <p className="text-[12.5px] text-ink-faint">
                    {product.categoryName}
                  </p>
                </Link>
                <Badge
                  tone={product.status === "ativo" ? "success" : "neutral"}
                >
                  {product.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-ink">
                  {formatCurrencyKz(product.price)} Kz
                </p>
                <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(product)}
                    aria-label="Editar produto"
                    className="flex size-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                  >
                    <Pencil className="size-[15px]" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    aria-label="Eliminar produto"
                    className="flex size-8 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger-bg focus-ring"
                  >
                    <Trash2 className="size-[15px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
