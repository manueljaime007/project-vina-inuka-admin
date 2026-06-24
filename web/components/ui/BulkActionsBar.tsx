"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  itemLabel?: string;
}

export function BulkActionsBar({
  count,
  onClear,
  onDelete,
  itemLabel = "produtos",
}: BulkActionsBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-7 z-40 flex justify-center px-4">
      <div className="flex animate-scale-in items-center gap-4 rounded-full border border-line-soft bg-brand-navy px-5 py-3 text-white shadow-[var(--shadow-pop)]">
        <button
          onClick={onClear}
          aria-label="Limpar seleção"
          className="flex size-7 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <X className="size-3.5" />
        </button>
        <p className="text-[13.5px] font-medium">
          {count} {itemLabel} selecionado{count > 1 ? "s" : ""}
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          className="gap-1.5"
        >
          <Trash2 className="size-3.5" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}
