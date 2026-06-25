"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { ClientRequest } from "@/services/requests.service";
import { useRequests } from "@/hooks/useRequests";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { cn } from "@/shared/helpers/utils";

interface RequestStatusUpdateModalProps {
    open: boolean;
    onClose: () => void;
    request: ClientRequest | null;
    onSuccess?: () => void;
}

const statusOptions = [
    { value: "pending", label: "Pendente", icon: Clock, color: "text-warning-ink", bg: "bg-warning-bg" },
    { value: "completed", label: "Concluída", icon: CheckCircle, color: "text-success-ink", bg: "bg-success-bg" },
    { value: "cancelled", label: "Cancelada", icon: XCircle, color: "text-danger", bg: "bg-danger-bg" },
] as const;

export function RequestStatusUpdateModal({ open, onClose, request, onSuccess }: RequestStatusUpdateModalProps) {
    const { updateStatus } = useRequests();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open || !request) return null;

    const handleUpdate = async (status: 'pending' | 'completed' | 'cancelled') => {
        if (status === request.status) {
            onClose();
            return;
        }

        setLoading(true);
        setError(null);
        const result = await updateStatus(request.id, status);
        setLoading(false);

        if (result.success) {
            onSuccess?.();
            onClose();
        } else {
            setError(result.error || 'Erro ao atualizar status');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-2xl bg-surface shadow-[var(--shadow-pop)] animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line-soft px-6 py-4">
                    <h2 className="text-[18px] font-semibold text-ink">
                        Atualizar status
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                        aria-label="Fechar"
                    >
                        <X className="size-[18px]" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    <div className="text-center mb-6">
                        <p className="text-[14px] text-ink-soft">
                            Solicitação de <span className="font-medium text-ink">{request.customer_name}</span>
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <span className="text-[13px] text-ink-soft">Status atual:</span>
                            <RequestStatusBadge status={request.status} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {statusOptions.map(({ value, label, icon: Icon, color, bg }) => {
                            const isActive = value === request.status;
                            return (
                                <button
                                    key={value}
                                    onClick={() => handleUpdate(value)}
                                    disabled={loading || isActive}
                                    className={cn(
                                        "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all",
                                        isActive
                                            ? "bg-brand-navy text-white shadow-[0_2px_10px_-2px_rgba(20,24,43,0.4)] cursor-default"
                                            : "border border-line-soft hover:bg-surface-sunken hover:border-ink-soft",
                                        loading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <span className={cn(
                                        "flex size-10 items-center justify-center rounded-xl",
                                        isActive ? "bg-white/20" : bg
                                    )}>
                                        <Icon className={cn(
                                            "size-5",
                                            isActive ? "text-white" : color
                                        )} />
                                    </span>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "text-[14px] font-medium",
                                            isActive ? "text-white" : "text-ink"
                                        )}>
                                            {label}
                                        </p>
                                        <p className={cn(
                                            "text-[12px]",
                                            isActive ? "text-white/70" : "text-ink-faint"
                                        )}>
                                            {isActive ? "Status atual" : `Alterar para ${label.toLowerCase()}`}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <span className="text-sm text-white/70">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-lg bg-danger-bg px-4 py-2 text-sm text-danger">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-line-soft px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-line-soft px-6 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-sunken focus-ring"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}