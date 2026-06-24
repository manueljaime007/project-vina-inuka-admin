"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { Product } from "@/shared/types";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (values: ProductFormValues) => void;
}

export function EditProductModal({
  open,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  const [values, setValues] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  function handleSave() {
    if (!values) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave(values);
    }, 500);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar produto"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Guardar
          </Button>
        </>
      }
    >
      <ProductForm
        key={product.id}
        formId="edit-product-form"
        initial={product}
        onValuesChange={setValues}
      />
    </Modal>
  );
}
