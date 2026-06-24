"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface NewCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewCategoryModal({ open, onClose, onCreate }: NewCategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setName("");
    setError("");
    onClose();
  }

  function handleSave() {
    if (!name.trim()) {
      setError("Dê um nome à categoria.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreate(name.trim());
      handleClose();
    }, 450);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nova categoria"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Criar categoria
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