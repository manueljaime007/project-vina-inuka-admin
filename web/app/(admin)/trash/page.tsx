"use client";

import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle, PackageX } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { BulkActionsBar } from "@/components/ui/BulkActionsBar";
import { useToast } from "@/components/ui/Toast";
import { useTrash } from "@/hooks/useTrash";
import { formatCurrencyKz, formatDate } from "@/shared/helpers/utils";

export default function TrashPage() {
  const { showToast } = useToast();
  const { products, loading, refetch, restoreMany, deleteManyPermanent } =
    useTrash();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<
    "restore" | "delete" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someSelected = products.some((p) => selectedIds.has(p.id));

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const all = products.every((p) => next.has(p.id));
      products.forEach((p) => (all ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  async function handleConfirm() {
    const ids = Array.from(selectedIds);
    setActionLoading(true);

    if (confirmAction === "restore") {
      const result = await restoreMany(ids);
      if (result.success) {
        showToast(
          ids.length > 1
            ? `${ids.length} produtos restaurados.`
            : "Produto restaurado.",
          "success",
        );
        setSelectedIds(new Set());
      } else {
        showToast(result.error || "Erro ao restaurar produtos", "danger");
      }
    } else if (confirmAction === "delete") {
      const result = await deleteManyPermanent(ids);
      if (result.success) {
        showToast(
          ids.length > 1
            ? `${ids.length} produtos eliminados permanentemente.`
            : "Produto eliminado permanentemente.",
          "success",
        );
        setSelectedIds(new Set());
      } else {
        showToast(result.error || "Erro ao eliminar produtos", "danger");
      }
    }

    setActionLoading(false);
    setConfirmAction(null);
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
      <div>
        <h1 className="font-display text-[34px] text-ink">Lixo</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Produtos eliminados. Restaure-os ou elimine-os permanentemente.
        </p>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)]">
        {products.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="O lixo está vazio"
            description="Produtos eliminados a partir do catálogo aparecem aqui antes de serem removidos definitivamente."
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line-soft px-6 py-4">
              <label className="flex items-center gap-3 text-[13.5px] font-medium text-ink-soft">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                />
                Selecionar tudo
              </label>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmAction("restore")}
                    className="gap-1.5"
                  >
                    <RotateCcw className="size-[14px]" />
                    Restaurar ({selectedIds.size})
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmAction("delete")}
                    className="gap-1.5"
                  >
                    <Trash2 className="size-[14px]" />
                    Eliminar definitivamente
                  </Button>
                </div>
              )}
            </div>

            <div className="divide-y divide-line-soft">
              {products.map((product) => {
                const checked = selectedIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${checked ? "bg-brand-blush/30" : ""}`}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => toggle(product.id)}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-11 rounded-xl object-cover opacity-70"
                    />
                    <div className="flex-1">
                      <p className="text-[14.5px] font-medium text-ink">
                        {product.name}
                      </p>
                      <p className="text-[12.5px] text-ink-faint">
                        Eliminado em{" "}
                        {product.deletedAt
                          ? formatDate(product.deletedAt)
                          : "—"}
                      </p>
                    </div>
                    <p className="text-[14px] text-ink-soft">
                      {formatCurrencyKz(product.price)} Kz
                    </p>
                    <Badge tone="neutral">{product.categoryName}</Badge>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setConfirmAction("delete")}
        itemLabel="produtos no lixo"
      />

      {/* Modal de confirmação */}
      <Modal
        open={Boolean(confirmAction)}
        onClose={() => !actionLoading && setConfirmAction(null)}
        title=""
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span
            className={`flex size-14 items-center justify-center rounded-full ${
              confirmAction === "delete" ? "bg-danger-bg" : "bg-success-bg"
            }`}
          >
            {confirmAction === "delete" ? (
              <AlertTriangle className="size-6 text-danger-deep" />
            ) : (
              <RotateCcw className="size-6 text-success-ink" />
            )}
          </span>
          <div>
            <h2 className="font-display text-xl text-ink">
              {confirmAction === "delete"
                ? `Eliminar ${selectedIds.size} produto${selectedIds.size > 1 ? "s" : ""} definitivamente`
                : `Restaurar ${selectedIds.size} produto${selectedIds.size > 1 ? "s" : ""}`}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              {confirmAction === "delete"
                ? "Esta ação não pode ser anulada. Os produtos serão removidos para sempre."
                : "Os produtos voltarão a aparecer no catálogo da loja."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setConfirmAction(null)}
            disabled={actionLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant={confirmAction === "delete" ? "danger" : "primary"}
            onClick={handleConfirm}
            loading={actionLoading}
            className="flex-1"
          >
            {actionLoading ? "A processar..." : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
