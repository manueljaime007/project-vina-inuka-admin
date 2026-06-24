"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productNames: string[];
  loading?: boolean;
}

export function DeleteProductModal({ open, onClose, onConfirm, productNames, loading }: DeleteProductModalProps) {
  const isBulk = productNames.length > 1;

  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle className="size-6 text-danger-deep" />
        </span>
        <div>
          <h2 className="font-display text-xl text-ink">
            {isBulk ? `Eliminar ${productNames.length} produtos` : "Eliminar produto"}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            {isBulk ? (
              <>
                Tem a certeza que pretende eliminar os produtos selecionados? Esta ação irá
                movê-los para o lixo.
              </>
            ) : (
              <>
                Tem a certeza que pretende eliminar{" "}
                <span className="font-medium text-ink">&quot;{productNames[0]}&quot;</span>? O
                produto será movido para o lixo.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}