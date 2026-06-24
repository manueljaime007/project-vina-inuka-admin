"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-[440px]",
  md: "max-w-[640px]",
  lg: "max-w-[760px]",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-[#14182b]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          //   "relative z-10 w-full animate-scale-in rounded-2xl bg-surface shadow-[var(--shadow-pop)]",
          "relative z-10 w-full animate-scale-in rounded-2xl bg-surface shadow-(--shadow-pop)",
          sizes[size],
        )}
      >
        {title ? (
          <div className="flex items-start justify-between border-b border-line-soft px-7 py-5">
            <h2 className="font-display text-2xl text-ink">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-full p-1.5 text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
            >
              <X className="size-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-5 top-5 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
          >
            <X className="size-5" />
          </button>
        )}
        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto px-7 py-6",
            !title && "pt-9",
          )}
        >
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-line-soft px-7 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}
