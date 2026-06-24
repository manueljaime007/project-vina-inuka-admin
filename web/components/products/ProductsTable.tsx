"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { formatCurrencyKz }  from "@/shared/lib/utils";

interface ProductsTableProps {
  products: Product[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ products, selectedIds, onToggle, onToggleAll, onEdit, onDelete }: ProductsTableProps) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someSelected = products.some((p) => selectedIds.has(p.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <thead>
          <tr className="border-b border-line-soft text-left">
            <th className="w-12 py-3 pl-6">
              <Checkbox checked={allSelected} indeterminate={someSelected && !allSelected} onChange={onToggleAll} />
            </th>
            <Th>Produto</Th>
            <Th>Marca</Th>
            <Th>Categoria</Th>
            <Th>Preço</Th>
            <Th>Estado</Th>
            <Th className="text-right pr-6">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const checked = selectedIds.has(product.id);
            return (
              <tr
                key={product.id}
                className={`border-b border-line-soft transition-colors last:border-0 ${
                  checked ? "bg-brand-blush/30" : "hover:bg-surface-sunken/60"
                }`}
              >
                <td className="py-4 pl-6">
                  <Checkbox checked={checked} onChange={() => onToggle(product.id)} />
                </td>
                <td className="py-4 pr-4">
                  <Link href={`/products/${product.id}`} className="flex items-center gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-11 rounded-xl object-cover bg-brand-blush"
                    />
                    <div>
                      <p className="text-[14.5px] font-medium text-ink group-hover:underline">{product.name}</p>
                      <p className="text-[12.5px] text-ink-faint">{product.slug}</p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 pr-4 text-[14px] text-ink-soft">{product.brand}</td>
                <td className="py-4 pr-4 text-[14px] text-ink-soft">{product.categoryName}</td>
                <td className="py-4 pr-4 text-[14px] font-medium text-ink">
                  {formatCurrencyKz(product.price)} Kz
                </td>
                <td className="py-4 pr-4">
                  <Badge tone={product.status === "ativo" ? "success" : "neutral"}>
                    {product.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td className="py-4 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      aria-label="Editar produto"
                      className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                    >
                      <Pencil className="size-[16px]" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      aria-label="Eliminar produto"
                      className="flex size-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger-bg focus-ring"
                    >
                      <Trash2 className="size-[16px]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`py-3 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint ${className}`}>
      {children}
    </th>
  );
}