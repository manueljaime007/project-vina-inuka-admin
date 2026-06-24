"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (id: string, name: string) => void;
  categoryId: string;
  initialName: string;
}

export function EditCategoryModal({
  open,
  onClose,
  onEdit,
  categoryId,
  initialName,
}: EditCategoryModalProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens with new data
  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
    }
  }, [open, initialName]);

  function handleClose() {
    setName(initialName);
    setError("");
    onClose();
  }

  function handleSave() {
    if (!name.trim()) {
      setError("Dê um nome à categoria.");
      return;
    }

    if (name.trim() === initialName) {
      handleClose();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onEdit(categoryId, name.trim());
      handleClose();
    }, 450);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Editar categoria"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Salvar alterações
          </Button>
        </>
      }
    >
      <Input
        label="Nome da categoria"
        placeholder="Ex: Cuidado Capilar"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        error={error}
        autoFocus
      />
    </Modal>
  );
}
