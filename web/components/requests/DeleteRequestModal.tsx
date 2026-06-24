"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteRequestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function DeleteRequestModal({
  open,
  onClose,
  onConfirm,
  count,
}: DeleteRequestModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle className="size-6 text-danger-deep" />
        </span>
        <div>
          <h2 className="font-display text-xl text-ink">
            {count > 1
              ? `Eliminar ${count} solicitações`
              : "Eliminar solicitação"}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Esta ação não pode ser anulada.{" "}
            {count > 1 ? "As solicitações" : "A solicitação"} serão removidas
            permanentemente.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} className="flex-1">
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}
