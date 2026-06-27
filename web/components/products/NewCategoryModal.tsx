"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface NewCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void> | void; // ← Pode ser async
}

export function NewCategoryModal({
  open,
  onClose,
  onCreate,
}: NewCategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setName("");
    setError("");
    onClose();
  }

  async function handleSave() {
    // ← async
    if (!name.trim()) {
      setError("Dê um nome à categoria.");
      return;
    }
    setLoading(true);
    try {
      await onCreate(name.trim());
      // O modal fecha no componente pai após sucesso
    } catch (err) {
      setError("Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
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
