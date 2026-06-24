import Link from "next/link";
import { ArrowRight, Package, Tag, Inbox, TrendingUp } from "lucide-react";
import { categories, clientRequests, products } from "@/shared/data/mock-data";
import { formatCurrencyKz, formatDateTime } from "@/shared/helpers/utils";
import { Badge } from "@/components/ui/Badge";

const statusMeta = {
  pendente: { label: "Pendente", tone: "warning" as const },
  em_processamento: { label: "Em processamento", tone: "info" as const },
  concluida: { label: "Concluída", tone: "success" as const },
  cancelada: { label: "Cancelada", tone: "danger" as const },
};

export default function DashboardPage() {
  const pendingRequests = clientRequests.filter(
    (r) => r.status === "pendente",
  ).length;
  const completedRevenue = clientRequests
    .filter((r) => r.status === "concluida")
    .reduce((sum, r) => sum + r.total, 0);

  const stats = [
    {
      href: "/products",
      icon: Package,
      value: products.length,
      label: "Produtos",
    },
    {
      href: "/categories",
      icon: Tag,
      value: categories.length,
      label: "Categorias",
    },
    {
      href: "/requests",
      icon: Inbox,
      value: clientRequests.length,
      label: "Solicitações",
      sub: pendingRequests > 0 ? `${pendingRequests} pendentes` : undefined,
    },
    {
      href: "/requests",
      icon: TrendingUp,
      value: `${formatCurrencyKz(completedRevenue)} Kz`,
      label: "Receita concluída",
    },
  ];

  const hours = new Date().getHours();

  let greeting = "";

  if (hours < 12) greeting = "Bom dia";
  else if (hours < 18) greeting = "Boa tarde";
  else greeting = "Boa noite";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div>
          <h1 className="font-display text-[34px] text-ink">{greeting}!</h1>

          <p className="mt-1 text-[15px] text-ink-soft">
            Visão geral da sua loja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col gap-5 rounded-2xl border border-line-soft bg-surface p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-sunken text-ink-soft">
                <stat.icon className="size-[18px]" strokeWidth={1.8} />
              </span>
              <ArrowRight className="size-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink-soft" />
            </div>
            <div>
              <p className="font-display text-3xl text-ink">{stat.value}</p>
              <p className="mt-1 text-[14px] text-ink-soft">{stat.label}</p>
              {stat.sub && (
                <p className="mt-0.5 text-[13px] font-medium text-warning-ink">
                  {stat.sub}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-7 py-6">
          <h2 className="font-display text-2xl text-ink">
            Solicitações recentes
          </h2>
          <Link
            href="/requests"
            className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
          >
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-line-soft">
          {clientRequests.map((req) => {
            const meta = statusMeta[req.status];
            return (
              <div
                key={req.id}
                className="flex items-center justify-between px-7 py-5"
              >
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {req.customerName}
                  </p>
                  <p className="mt-0.5 text-[13px] text-ink-faint">
                    {formatDateTime(req.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-medium text-ink">
                    {formatCurrencyKz(req.total)} Kz
                  </p>
                  <Badge tone={meta.tone} className="mt-1">
                    {meta.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
