"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { clientRequests as initialRequests } from "@/shared/lib/mock-data";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyKz, formatDateTime } from "@/shared/lib/utils";
import { DeleteRequestModal } from "@/components/requests/DeleteRequestModal";
import { BulkActionsBar } from "@/components/ui/BulkActionsBar";

const PAGE_SIZE = 8;

const statusMeta = {
  pendente: { label: "Pendente", tone: "warning" as const },
  em_processamento: { label: "Em processamento", tone: "info" as const },
  concluida: { label: "Concluída", tone: "success" as const },
  cancelada: { label: "Cancelada", tone: "danger" as const },
};

export default function RequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string> | null>(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch = r.customerName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = pageItems.every((r) => next.has(r.id));
      pageItems.forEach((r) =>
        allSelected ? next.delete(r.id) : next.add(r.id),
      );
      return next;
    });
  }

  function confirmDelete() {
    if (!deletingIds) return;
    setRequests((prev) => prev.filter((r) => !deletingIds.has(r.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      deletingIds.forEach((id) => next.delete(id));
      return next;
    });
    showToast(
      deletingIds.size > 1
        ? `${deletingIds.size} solicitações eliminadas.`
        : "Solicitação eliminada.",
      "success",
    );
    setDeletingIds(null);
  }

  const allSelected =
    pageItems.length > 0 && pageItems.every((r) => selectedIds.has(r.id));
  const someSelected = pageItems.some((r) => selectedIds.has(r.id));

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <h1 className="font-display text-[34px] text-ink">Solicitações</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Pedidos recebidos via WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Pesquisar cliente…"
          leftIcon={<Search className="size-[17px]" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[220px]"
        >
          <option value="all">Todos os estados</option>
          <option value="pendente">Pendente</option>
          <option value="em_processamento">Em processamento</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </Select>
      </div>

      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)]">
        {pageItems.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nenhuma solicitação encontrada"
            description="Quando os clientes pedirem produtos via WhatsApp, vão aparecer aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft text-left">
                  <th className="w-12 py-3 pl-6">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-3 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    Cliente
                  </th>
                  <th className="py-3 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    Itens
                  </th>
                  <th className="py-3 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    Total
                  </th>
                  <th className="py-3 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    Estado
                  </th>
                  <th className="py-3 pr-6 text-right text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((req) => {
                  const checked = selectedIds.has(req.id);
                  const meta = statusMeta[req.status];
                  return (
                    <tr
                      key={req.id}
                      className={`border-b border-line-soft transition-colors last:border-0 ${
                        checked
                          ? "bg-brand-blush/30"
                          : "hover:bg-surface-sunken/60"
                      }`}
                    >
                      <td className="py-4 pl-6">
                        <Checkbox
                          checked={checked}
                          onChange={() => toggle(req.id)}
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <p className="text-[14.5px] font-medium text-ink">
                          {req.customerName}
                        </p>
                        <p className="text-[12.5px] text-ink-faint">
                          {formatDateTime(req.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-[14px] text-ink-soft">
                        {req.items.map((i) => i.productName).join(", ")}
                      </td>
                      <td className="py-4 pr-4 text-[14px] font-medium text-ink">
                        {formatCurrencyKz(req.total)} Kz
                      </td>
                      <td className="py-4 pr-4">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <button
                          onClick={() => setDeletingIds(new Set([req.id]))}
                          className="text-[13px] font-medium text-danger hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <BulkActionsBar
        count={selectedIds.size}
        itemLabel="solicitações"
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setDeletingIds(new Set(selectedIds))}
      />

      <DeleteRequestModal
        open={Boolean(deletingIds)}
        count={deletingIds?.size ?? 0}
        onClose={() => setDeletingIds(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
