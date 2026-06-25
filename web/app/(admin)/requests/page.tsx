"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Trash2, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { RequestDetailsModal } from "@/components/requests/RequestDetailsModal";
import { RequestStatusUpdateModal } from "@/components/requests/RequestStatusUpdateModal";
import { BulkActionsBar } from "@/components/ui/BulkActionsBar";
import { useRequests } from "@/hooks/useRequests";
import { formatDateTime } from "@/shared/helpers/utils";
import { ClientRequest } from "@/services/requests.service";

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
];

export default function RequestsPage() {
  const {
    requests,
    meta,
    loading,
    setStatusFilter,
    goToPage,
    delete: deleteRequest,
    deleteMany,
    setSearch, // 🔑 Adicionar setSearch do hook
  } = useRequests();
  const [statusFilter, setStatusFilterLocal] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleting, setDeleting] = useState<{
    id: string;
    customer_name: string;
  } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔑 Debounce do search - espera 500ms após o utilizador parar de escrever
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🔑 Quando o search debounced mudar, atualizar a busca
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const handleStatusFilter = (value: string) => {
    setStatusFilterLocal(value);
    setStatusFilter(value as "pending" | "completed" | "cancelled" | null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteRequest(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const handleViewDetails = (request: ClientRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleEditStatus = (request: ClientRequest) => {
    setSelectedRequest(request);
    setStatusUpdateOpen(true);
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === requests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(requests.map((r) => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const result = await deleteMany(ids);
    if (result.success) {
      setSelectedIds(new Set());
      setShowDeleteModal(false);
    } else {
      alert(result.error || "Erro ao eliminar solicitações");
    }
  };

  const handleStatusUpdateSuccess = () => {
    setStatusUpdateOpen(false);
    setSelectedRequest(null);
  };

  // 🔑 Limpar busca
  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSearch("");
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  const isAllSelected =
    requests.length > 0 && selectedIds.size === requests.length;
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-display text-[34px] text-ink">Solicitações</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Gerencie as solicitações dos clientes.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            placeholder="Pesquisar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors"
              aria-label="Limpar busca"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="w-40"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Button variant="secondary" className="gap-1.5">
          <Filter className="size-4" />
          Mais filtros
        </Button>
      </div>

      {/* Resultados da busca */}
      {searchTerm && (
        <div className="text-sm text-ink-soft">
          Resultados para:{" "}
          <span className="font-medium text-ink">"{searchTerm}"</span>
          {meta && ` • ${meta.total} resultado${meta.total !== 1 ? "s" : ""}`}
        </div>
      )}

      {/* Lista */}
      <div className="rounded-2xl border border-line-soft bg-surface shadow-[var(--shadow-card)] overflow-hidden">
        {requests.length === 0 ? (
          <div className="py-20 text-center text-ink-faint">
            {searchTerm ? (
              <>
                <p>Nenhuma solicitação encontrada para</p>
                <p className="font-medium text-ink mt-1">"{searchTerm}"</p>
              </>
            ) : (
              "Nenhuma solicitação encontrada."
            )}
          </div>
        ) : (
          <>
            {/* Header da tabela com checkbox */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-line-soft bg-surface-sunken">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={toggleSelectAll}
              />
              <span className="text-[12px] font-medium text-ink-faint uppercase tracking-wide">
                Selecionar todos
              </span>
              {selectedIds.size > 0 && (
                <span className="text-[12px] text-ink-soft ml-2">
                  ({selectedIds.size} selecionado
                  {selectedIds.size > 1 ? "s" : ""})
                </span>
              )}
            </div>

            <div className="divide-y divide-line-soft">
              {requests.map((request) => {
                const isSelected = selectedIds.has(request.id);
                return (
                  <div
                    key={request.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 transition-colors ${
                      isSelected
                        ? "bg-brand-blush/30"
                        : "hover:bg-surface-sunken"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelect(request.id)}
                      />
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleViewDetails(request)}
                      >
                        <p className="text-[14.5px] font-medium text-ink hover:underline truncate">
                          {request.customer_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-faint">
                          <span>{request.customer_phone}</span>
                          <span>•</span>
                          <span>{formatDateTime(request.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-[15px] font-semibold text-ink whitespace-nowrap">
                        {request.total.toFixed(2)} Kz
                      </span>
                      <RequestStatusBadge status={request.status} />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                          aria-label="Ver detalhes"
                        >
                          <Eye className="size-[16px]" />
                        </button>
                        <button
                          onClick={() => handleEditStatus(request)}
                          className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
                          aria-label="Editar status"
                        >
                          <Edit className="size-[16px]" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleting({
                              id: request.id,
                              customer_name: request.customer_name,
                            })
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger-bg focus-ring"
                          aria-label="Eliminar solicitação"
                        >
                          <Trash2 className="size-[16px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Paginação */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => goToPage(meta.page - 1)}
            disabled={!meta.hasPrev}
            className="rounded-lg border border-line-soft px-4 py-2 text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-ink-soft">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            onClick={() => goToPage(meta.page + 1)}
            disabled={!meta.hasNext}
            className="rounded-lg border border-line-soft px-4 py-2 text-sm disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setShowDeleteModal(true)}
        itemLabel="solicitações"
      />

      {/* Modais... */}
      <RequestDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />

      <RequestStatusUpdateModal
        open={statusUpdateOpen}
        onClose={() => {
          setStatusUpdateOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onSuccess={handleStatusUpdateSuccess}
      />

      {/* Modal de confirmação de eliminação individual */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-ink">
              Eliminar solicitação
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Tem a certeza que pretende eliminar a solicitação de{" "}
              <span className="font-medium text-ink">
                &quot;{deleting.customer_name}&quot;
              </span>
              ?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-line-soft px-4 py-2 text-sm text-ink-soft hover:bg-surface-sunken"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-danger px-4 py-2 text-sm text-white hover:bg-danger-deep"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de eliminação em massa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-ink">
              Eliminar solicitações
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Tem a certeza que pretende eliminar{" "}
              <span className="font-medium text-ink">{selectedIds.size}</span>{" "}
              solicitação{selectedIds.size > 1 ? "es" : ""} selecionada
              {selectedIds.size > 1 ? "s" : ""}?
              <br />
              <span className="text-danger text-sm">
                Esta ação não pode ser desfeita.
              </span>
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-line-soft px-4 py-2 text-sm text-ink-soft hover:bg-surface-sunken"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded-xl bg-danger px-4 py-2 text-sm text-white hover:bg-danger-deep"
              >
                Eliminar {selectedIds.size} solicitação
                {selectedIds.size > 1 ? "es" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
