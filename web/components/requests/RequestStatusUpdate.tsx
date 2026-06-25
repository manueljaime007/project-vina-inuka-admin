"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/shared/helpers/utils";

interface RequestStatusUpdateProps {
  currentStatus: "pending" | "completed" | "cancelled";
  onUpdate: (
    status: "pending" | "completed" | "cancelled",
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

const statusOptions = [
  {
    value: "pending",
    label: "Pendente",
    icon: Clock,
    color: "text-warning-ink",
  },
  {
    value: "completed",
    label: "Concluída",
    icon: CheckCircle,
    color: "text-success-ink",
  },
  {
    value: "cancelled",
    label: "Cancelada",
    icon: XCircle,
    color: "text-danger",
  },
] as const;

export function RequestStatusUpdate({
  currentStatus,
  onUpdate,
  isLoading = false,
}: RequestStatusUpdateProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (
    status: "pending" | "completed" | "cancelled",
  ) => {
    if (status === currentStatus) return;

    setLoading(true);
    setError(null);
    const result = await onUpdate(status);
    if (!result.success && result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  const isUpdating = isLoading || loading;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => handleUpdate(value)}
            disabled={isUpdating || value === currentStatus}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              value === currentStatus
                ? "bg-brand-navy text-white shadow-[0_2px_10px_-2px_rgba(20,24,43,0.4)]"
                : "border border-line-soft text-ink-soft hover:bg-surface-sunken hover:text-ink",
              isUpdating && "opacity-50 cursor-not-allowed",
            )}
          >
            <Icon
              className={cn(
                "size-4",
                value === currentStatus ? "text-white" : color,
              )}
            />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-danger-bg px-4 py-2 text-sm text-danger">
          {error}
        </div>
      )}
    </div>
  );
}
