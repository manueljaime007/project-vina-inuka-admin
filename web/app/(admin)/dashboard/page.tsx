"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  Package,
  Tag,
  Inbox,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { formatCurrencyKz, formatDateTime } from "@/shared/helpers/utils";
import { cn } from "@/shared/helpers/utils";

const statusMap = {
  pending: { label: "Pendente", className: "bg-warning-bg text-warning-ink" },
  completed: {
    label: "Concluída",
    className: "bg-success-bg text-success-ink",
  },
  cancelled: { label: "Cancelada", className: "bg-danger-bg text-danger" },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, loading, error } = useDashboard();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-ink-soft">Erro ao carregar dados do dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-brand-navy hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-display text-[28px] text-ink">
          {greeting}, {user?.name?.split(" ")[0] || "Admin"}!
        </h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Visão geral da sua loja.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Produtos"
          value={stats.products}
          color="text-brand-rose-deep"
          bg="bg-brand-blush"
        />
        <StatCard
          icon={Tag}
          label="Categorias"
          value={stats.categories}
          color="text-brand-navy"
          bg="bg-surface-sunken"
        />
        <StatCard
          icon={Inbox}
          label="Solicitações"
          value={stats.requests.total}
          subtitle={`${stats.requests.pending} pendente${stats.requests.pending !== 1 ? "s" : ""}`}
          color="text-info-ink"
          bg="bg-info-bg"
        />
        <StatCard
          icon={TrendingUp}
          label="Receita concluída"
          value={stats.revenue}
          color="text-success-ink"
          bg="bg-success-bg"
          prefix="Kz "
          formatNumber
        />
      </div>

      {/* Solicitações recentes */}
      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line-soft">
          <h2 className="text-[15px] font-semibold text-ink">
            Solicitações recentes
          </h2>
          <Link
            href="/requests"
            className="flex items-center gap-1.5 text-[13px] font-medium text-brand-navy hover:underline"
          >
            Ver todas
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="divide-y divide-line-soft">
          {stats.recentRequests.length === 0 ? (
            <div className="px-6 py-8 text-center text-ink-faint">
              Nenhuma solicitação recente
            </div>
          ) : (
            stats.recentRequests.map((request) => {
              const status = statusMap[request.status] || statusMap.pending;
              return (
                <Link
                  key={request.id}
                  href={`/requests/${request.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 transition-colors hover:bg-surface-sunken group"
                >
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-medium text-ink group-hover:underline">
                      {request.customer_name}
                    </span>
                    <span className="text-[13px] text-ink-faint">
                      {formatDateTime(request.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[15px] font-semibold text-ink">
                      {formatCurrencyKz(request.total)} Kz
                    </span>
                    <RequestStatusBadge status={request.status} />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
  prefix?: string;
  subtitle?: string;
  formatNumber?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  prefix = "",
  subtitle,
  formatNumber = false,
}: StatCardProps) {
  const formattedValue = formatNumber
    ? new Intl.NumberFormat("pt-PT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    : value;

  return (
    <div className="rounded-2xl border border-line-soft bg-surface px-5 py-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              bg,
            )}
          >
            <Icon className={cn("size-5", color)} strokeWidth={1.8} />
          </span>
          <div>
            <span className="text-[14px] text-ink-soft">{label}</span>
            {subtitle && (
              <p className="text-[12px] text-ink-faint">{subtitle}</p>
            )}
          </div>
        </div>
        <span className="text-[20px] font-semibold text-ink">
          {prefix}
          {formattedValue}
        </span>
      </div>
    </div>
  );
}
