"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ImageUploadFieldProps {
  label?: string;
  initialPreview?: string;
  onFileChange: (file: File | null) => void;
}

export function ImageUploadField({
  label = "Imagem",
  initialPreview,
  onFileChange,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function setFile(file: File | null) {
    if (!file) {
      onFileChange(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileChange(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  }

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  }

  function clear() {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface-sunken transition-colors",
          isDragging && "border-brand-navy bg-brand-blush/40",
          preview && "border-solid border-line",
        )}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Pré-visualização do produto"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-[#14182b]/70 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus-ring"
              aria-label="Remover imagem"
            >
              <X className="size-4" />
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#14182b]/60 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-center text-[12px] text-white">
                Clique para alterar
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="flex size-11 items-center justify-center rounded-full bg-surface text-ink-faint">
              {isDragging ? (
                <UploadCloud className="size-5" />
              ) : (
                <ImagePlus className="size-5" />
              )}
            </span>
            <p className="px-6 text-center text-[13px] text-ink-faint">
              Arraste uma imagem ou{" "}
              <span className="font-medium text-brand-navy">
                clique para escolher
              </span>
            </p>
            <p className="text-[11px] text-ink-faint">PNG ou JPG, até 5MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
