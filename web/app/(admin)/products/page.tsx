"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Tag, LayoutGrid, List, PackageX } from "lucide-react";
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
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/shared/helpers/utils";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const { showToast } = useToast();

  // API hooks
  const {
    products,
    meta,
    loading,
    setSearch,
    setCategory,
    goToPage,
    delete: deleteProduct,
    deleteMany,
  } = useProducts({ page: 1, limit: PAGE_SIZE });

  const [newOpen, setNewOpen] = useState(false);

  const { categories, createCategory } = useCategories();

  // async function handleCreateCategory(name: string) {
  //   const result = await createCategory(name);
  //   if (result.success) {
  //     showToast("Categoria criada com sucesso!", "success");
  //     setNewOpen(false);
  //   } else {
  //     showToast(result.error || "Erro ao criar categoria", "danger");
  //   }
  // }

  // Estado local
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProducts, setDeletingProducts] = useState<any[] | null>(null);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);

  // Sincronizar página com meta da API
  useEffect(() => {
    if (meta) {
      setPage(meta.page);
    }
  }, [meta]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearch(value);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCategory(value === "all" ? null : value);
  };

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
      const allSelected = products.every((p) => next.has(p.id));
      products.forEach((p) =>
        allSelected ? next.delete(p.id) : next.add(p.id),
      );
      return next;
    });
  }

  async function handleDeleteConfirmed() {
    if (!deletingProducts) return;

    const ids = deletingProducts.map((p) => p.id);

    if (ids.length === 1) {
      const result = await deleteProduct(ids[0]);
      if (result.success) {
        showToast("Produto movido para o lixo.", "success");
        setDeletingProducts(null);
        setSelectedIds(new Set());
      } else {
        showToast(result.error || "Erro ao eliminar produto", "danger");
      }
    } else {
      const result = await deleteMany(ids);
      if (result.success) {
        showToast(`${ids.length} produtos movidos para o lixo.`, "success");
        setDeletingProducts(null);
        setSelectedIds(new Set());
      } else {
        showToast(result.error || "Erro ao eliminar produtos", "danger");
      }
    }
  }

  function handleSaveEdit() {
    showToast("Produto atualizado com sucesso.", "success");
    setEditingProduct(null);
  }

  // async function handleCreateCategory(name: string) {
  //   // A criar categoria via API - será implementado
  //   showToast(`Categoria "${name}" criada.`, "success");
  // }

  const selectedProducts = products.filter((p) => selectedIds.has(p.id));

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] text-ink">Produtos</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            Gerir o catálogo da loja.
          </p>
          {meta && (
            <p className="mt-1 text-[13px] text-ink-faint">
              {meta.total} produto{meta.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* <Button
            variant="secondary"
            onClick={() => setNewCategoryOpen(true)}
            className="gap-1.5"
          >
            <Tag className="size-4" />
            Nova categoria
          </Button> */}
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
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select
          value={categoryFilter}
          onChange={(e) => handleCategoryFilter(e.target.value)}
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
        {products.length === 0 ? (
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
            products={products}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onToggleAll={toggleSelectAllOnPage}
            onEdit={setEditingProduct}
            onDelete={(p) => setDeletingProducts([p])}
          />
        ) : (
          <ProductsGrid
            products={products}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onEdit={setEditingProduct}
            onDelete={(p) => setDeletingProducts([p])}
          />
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            pageSize={meta.limit}
            onPageChange={goToPage}
          />
        )}
      </div>

      <BulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setDeletingProducts(selectedProducts)}
        itemLabel="produtos"
      />

      <EditProductModal
        open={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveEdit}
        // onSuccess={() => refetchProducts()}
      />

      <DeleteProductModal
        open={Boolean(deletingProducts)}
        onClose={() => setDeletingProducts(null)}
        onConfirm={handleDeleteConfirmed}
        productNames={deletingProducts?.map((p) => p.name) ?? []}
      />

      {/* <NewCategoryModal
        open={newCategoryOpen}
        // onClose={() => setNewCategoryOpen(false)}
        onClose={() => setNewOpen(false)}
        onCreate={handleCreateCategory}
      /> */}
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
