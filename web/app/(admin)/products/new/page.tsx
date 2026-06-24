"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  ProductForm,
  ProductFormValues,
} from "@/components/products/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!values?.name.trim()) {
      setError("Dê um nome ao produto antes de guardar.");
      return;
    }
    setError("");
    setLoading(true);

    // Sem backend ligado ainda — isto será substituído por um envio
    // multipart/form-data com a imagem e os restantes campos.
    setTimeout(() => {
      setLoading(false);
      showToast(`"${values.name}" foi adicionado ao catálogo.`, "success");
      router.push("/products");
    }, 700);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-16">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Voltar a produtos
        </Link>
        <h1 className="mt-4 font-display text-[34px] text-ink">Novo produto</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Preencha os dados abaixo para adicionar um produto ao catálogo.
        </p>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface p-7 shadow-[var(--shadow-card)]">
        <ProductForm formId="new-product-form" onValuesChange={setValues} />

        {error && (
          <p className="mt-5 rounded-lg bg-danger-bg px-3 py-2 text-[13px] text-danger-deep">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-line-soft pt-6">
          <Link href="/products">
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </Link>
          <Button onClick={handleSubmit} loading={loading}>
            Guardar produto
          </Button>
        </div>
      </div>
    </div>
  );
}
