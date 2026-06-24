"use client";

import { FormEvent, useState } from "react";
import { categories } from "@/shared/lib/mock-data";
import { Product } from "@/shared/types";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUploadField } from "@/components/ui/ImageUploadField";

export interface ProductFormValues {
  name: string;
  slug: string;
  brand: "Aurélie" | "INUKA";
  categoryId: string;
  price: string;
  stock: string;
  status: boolean;
  description: string;
  imageFile: File | null;
}

interface ProductFormProps {
  formId: string;
  initial?: Product;
  onValuesChange: (values: ProductFormValues) => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  formId,
  initial,
  onValuesChange,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [brand, setBrand] = useState<"Vina">(
    initial?.brand ?? "Vina",
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "");
  const [status, setStatus] = useState(
    initial ? initial.status === "ativo" : true,
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  function emit(overrides: Partial<ProductFormValues> = {}) {
    onValuesChange({
      name,
      slug,
      brand,
      categoryId,
      price,
      stock,
      status,
      description,
      imageFile,
      ...overrides,
    });
  }

  function handleNameChange(value: string) {
    setName(value);
    const nextSlug = slugTouched ? slug : slugify(value);
    if (!slugTouched) setSlug(nextSlug);
    emit({ name: value, slug: nextSlug });
  }

  return (
    <form
      id={formId}
      onSubmit={(e: FormEvent) => e.preventDefault()}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[176px_1fr]">
        <ImageUploadField
          initialPreview={initial?.imageUrl}
          onFileChange={(file) => {
            setImageFile(file);
            emit({ imageFile: file });
          }}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nome"
            required
            placeholder="Sérum Iluminador"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="sm:col-span-2"
          />
          <Input
            label="Slug (opcional)"
            placeholder="serum-iluminador"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
              emit({ slug: e.target.value });
            }}
            className="sm:col-span-2"
          />
          <Select
            label="Marca"
            value={brand}
            onChange={(e) => {
            //   setBrand(e.target.value as "Vina" | "INUKA");
              setBrand(e.target.value as "Vina" );
              emit({ brand: e.target.value as "Aurélie" | "INUKA" });
            }}
          >
            <option value="Aurélie">Aurélie</option>
            <option value="INUKA">INUKA</option>
          </Select>
          <Select
            label="Categoria"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              emit({ categoryId: e.target.value });
            }}
          >
            <option value="">— Sem categoria —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label="Preço (Kz)"
          type="number"
          min={0}
          step={0.01}
          placeholder="0"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            emit({ price: e.target.value });
          }}
        />
        <Input
          label="Quantidade em stock"
          type="number"
          min={0}
          placeholder="0"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            emit({ stock: e.target.value });
          }}
        />
        <label className="flex items-center gap-2.5 self-end pb-2.5 text-[14px] text-ink">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => {
              setStatus(e.target.checked);
              emit({ status: e.target.checked });
            }}
            className="size-[18px] rounded-[6px] border border-line accent-[#14182b]"
          />
          Disponível na loja
        </label>
      </div>

      <Textarea
        label="Descrição"
        placeholder="Descreva o produto, os seus benefícios e modo de uso…"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          emit({ description: e.target.value });
        }}
      />
    </form>
  );
}
