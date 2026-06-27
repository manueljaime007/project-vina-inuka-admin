"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { NewCategoryModal } from "@/components/products/NewCategoryModal";
import { EditCategoryModal } from "@/components/products/EditCategoryModal";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { showToast } = useToast();
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(
    null,
  );

  async function handleCreate(name: string) {
    const result = await createCategory(name);
    if (result.success) {
      showToast("Categoria criada com sucesso!", "success");
      setNewOpen(false);
    } else {
      showToast(result.error || "Erro ao criar categoria", "danger");
    }
  }

  async function handleSaveEdit(id: string, name: string) {
    const result = await updateCategory(id, name);
    if (result.success) {
      showToast("Categoria atualizada com sucesso!", "success");
      setEditing(null);
    } else {
      showToast(result.error || "Erro ao atualizar categoria", "danger");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteCategory(deleting.id);
    if (result.success) {
      showToast(`Categoria "${deleting.name}" eliminada.`, "success");
      setDeleting(null);
    } else {
      showToast(result.error || "Erro ao eliminar categoria", "danger");
    }
  }

  if (loading) {
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
          <h1 className="font-display text-[34px] text-ink">Categorias</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            Organize o catálogo da loja.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="gap-1.5">
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)]">
        {categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="Ainda não há categorias"
            description="Crie categorias para organizar os produtos da loja."
            action={
              <Button
                size="sm"
                onClick={() => setNewOpen(true)}
                className="mt-2 gap-1.5"
              >
                <Plus className="size-4" />
                Nova categoria
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-line-soft">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between px-7 py-5"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-blush text-brand-rose-deep">
                    <Tag className="size-[17px]" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-ink">
                      {category.name}
                    </p>
                    <p className="text-[13px] text-ink-faint">
                      {category.description || "Sem descrição"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setEditing({ id: category.id, name: category.name })
                    }
                    aria-label="Editar categoria"
                    className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                  >
                    <Pencil className="size-[16px]" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleting({ id: category.id, name: category.name })
                    }
                    aria-label="Eliminar categoria"
                    className="flex size-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger-bg focus-ring"
                  >
                    <Trash2 className="size-[16px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewCategoryModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreate={handleCreate} 
      />

      <EditCategoryModal
        open={Boolean(editing)}
        categoryId={editing?.id || ""}
        initialName={editing?.name || ""}
        onClose={() => setEditing(null)}
        onEdit={handleSaveEdit}
      />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title=""
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-danger-bg">
            <Trash2 className="size-6 text-danger-deep" />
          </span>
          <div>
            <h2 className="font-display text-xl text-ink">
              Eliminar categoria
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Tem a certeza que pretende eliminar{" "}
              <span className="font-medium text-ink">
                &quot;{deleting?.name}&quot;
              </span>
              ? Os produtos associados deixarão de ter categoria.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleting(null)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
