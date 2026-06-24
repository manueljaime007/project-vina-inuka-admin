"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Toast {
  id: number;
  message: string;
  tone: "success" | "danger";
}

interface ToastContextValue {
  showToast: (message: string, tone?: "success" | "danger") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, tone: "success" | "danger" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 shadow-[var(--shadow-pop)] animate-scale-in",
              toast.tone === "success" ? "border-success-bg" : "border-danger-bg"
            )}
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="size-[18px] shrink-0 text-success-ink" />
            ) : (
              <AlertCircle className="size-[18px] shrink-0 text-danger-deep" />
            )}
            <p className="text-[13.5px] text-ink">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-ink-faint hover:text-ink-soft"
              aria-label="Fechar notificação"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}