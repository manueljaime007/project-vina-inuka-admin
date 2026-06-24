"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Tag, LayoutGrid, List, PackageX } from "lucide-react";
import {
  categories as initialCategories,
  products as initialProducts,
} from "@/shared/lib/mock-data";
import { Product } from "@/shared/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { BulkActionsBar } from "@/components/ui/BulkActionsBar";
import { EditProductModal } from "@/components/products/EditProductModal";
import { DeleteProductModal } from "@/components/products/DeleteProductModal";
import { NewCategoryModal } from "@/components/products/NewCategoryModal";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProducts, setDeletingProducts] = useState<Product[] | null>(
    null,
  );
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetToFirstPage() {
    setPage(1);
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = pageItems.every((p) => next.has(p.id));
      pageItems.forEach((p) =>
        allSelected ? next.delete(p.id) : next.add(p.id),
      );
      return next;
    });
  }

  function handleDeleteConfirmed() {
    if (!deletingProducts) return;
    const idsToDelete = new Set(deletingProducts.map((p) => p.id));
    setProducts((prev) => prev.filter((p) => !idsToDelete.has(p.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    showToast(
      idsToDelete.size > 1
        ? `${idsToDelete.size} produtos movidos para o lixo.`
        : "Produto movido para o lixo.",
      "success",
    );
    setDeletingProducts(null);
  }

  function handleSaveEdit() {
    showToast("Produto atualizado com sucesso.", "success");
    setEditingProduct(null);
  }

  function handleCreateCategory(name: string) {
    const newCat = { id: `cat-${Date.now()}`, name };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoria "${name}" criada.`, "success");
  }

  const selectedProducts = products.filter((p) => selectedIds.has(p.id));

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] text-ink">Produtos</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            Gerir o catálogo da loja.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setNewCategoryOpen(true)}
            className="gap-1.5"
          >
            <Tag className="size-4" />
            Nova categoria
          </Button>
          <Link href="/products/new">
            <Button className="gap-1.5">
              <Plus className="size-4" />
              Novo produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Pesquisar produto…"
          leftIcon={<Search className="size-[17px]" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          className="sm:max-w-sm"
        />
        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            resetToFirstPage();
          }}
          className="sm:max-w-[220px]"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <div className="ml-auto flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
          <ViewToggleButton
            active={view === "table"}
            onClick={() => setView("table")}
            aria-label="Ver em lista"
          >
            <List className="size-[16px]" />
          </ViewToggleButton>
          <ViewToggleButton
            active={view === "grid"}
            onClick={() => setView("grid")}
            aria-label="Ver em grelha"
          >
            <LayoutGrid className="size-[16px]" />
          </ViewToggleButton>
        </div>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)]">
        {pageItems.length === 0 ? (
          <EmptyState
            icon={PackageX}
            title="Nenhum produto encontrado"
            description="Tente ajustar a pesquisa ou os filtros, ou adicione um novo produto ao catálogo."
            action={
              <Link href="/products/new" className="mt-2">
                <Button size="sm" className="gap-1.5">
                  <Plus className="size-4" />
                  Novo produto
                </Button>
              </Link>
            }
          />
        ) : view === "table" ? (
          <ProductsTable
            products={pageItems}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onToggleAll={toggleSelectAllOnPage}
            onEdit={setEditingProduct}
            onDelete={(p) => setDeletingProducts([p])}
          />
        ) : (
          <ProductsGrid
            products={pageItems}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onEdit={setEditingProduct}
            onDelete={(p) => setDeletingProducts([p])}
          />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <BulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setDeletingProducts(selectedProducts)}
      />

      <EditProductModal
        open={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveEdit}
      />

      <DeleteProductModal
        open={Boolean(deletingProducts)}
        onClose={() => setDeletingProducts(null)}
        onConfirm={handleDeleteConfirmed}
        productNames={deletingProducts?.map((p) => p.name) ?? []}
      />

      <NewCategoryModal
        open={newCategoryOpen}
        onClose={() => setNewCategoryOpen(false)}
        onCreate={handleCreateCategory}
      />
    </div>
  );
}

function ViewToggleButton({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition-colors focus-ring",
        active
          ? "bg-brand-navy text-white"
          : "text-ink-faint hover:bg-surface-sunken hover:text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
