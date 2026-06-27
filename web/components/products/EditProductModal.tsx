"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { Product } from "@/shared/types";
import { productsService } from "@/services/products.service";
import { useToast } from "../ui/Toast";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  // onSave não é mais necessário, podemos remover se quiser
  onSave?: (values: ProductFormValues) => void;
}

export function EditProductModal({
  open,
  onClose,
  product,
}: EditProductModalProps) {
  const [values, setValues] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!product) return null;

  const handleUpdate = async () => {
    if (!values) {
      console.warn("Nenhum valor preenchido");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("category_id", values.categoryId);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("active", String(values.status));
    formData.append("description", values.description || "");

    if (values.imageFile) {
      formData.append("image", values.imageFile);
    }

    try {
      await productsService.update(product.id, formData);

      showToast("Produto atualizado com sucesso!", "danger")
      onClose();

      window.location.reload();
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      alert("Erro ao atualizar produto: " + (err.message || "Tente novamente"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar produto"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate} loading={loading}>
            Guardar Alterações
          </Button>
        </>
      }
    >
      <ProductForm
        key={product.id} // importante para resetar o form
        formId="edit-product-form"
        initial={product}
        onValuesChange={setValues}
      />
    </Modal>
  );
}
