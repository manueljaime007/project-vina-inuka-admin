"use client";

import { X, User, Phone, Package, Calendar, Clock } from "lucide-react";
import { ClientRequest } from "@/services/requests.service";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { formatDateTime } from "@/shared/helpers/utils";

interface RequestDetailsModalProps {
  open: boolean;
  onClose: () => void;
  request: ClientRequest | null;
}

export function RequestDetailsModal({
  open,
  onClose,
  request,
}: RequestDetailsModalProps) {
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-surface shadow-(--shadow-pop) animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-4">
          <h2 className="text-[18px] font-semibold text-ink">
            Detalhes da solicitação
          </h2>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
            aria-label="Fechar"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 max-h-[calc(90vh-80px)]">
          {/* Cliente */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-blush text-brand-rose-deep">
                  <User className="size-4.5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {request.customer_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] text-ink-faint">
                    <Phone className="size-3.5" />
                    <span>{request.customer_phone}</span>
                  </div>
                </div>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-surface-sunken p-4">
              <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                <Calendar className="size-4 text-ink-faint" />
                <span>Criado em: {formatDateTime(request.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                <Clock className="size-4 text-ink-faint" />
                <span>Atualizado: {formatDateTime(request.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Package className="size-4.5 text-ink-faint" strokeWidth={1.8} />
              <h3 className="text-[14px] font-semibold text-ink">Produtos</h3>
            </div>

            <div className="rounded-xl border border-line-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-sunken">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[12px] font-medium text-ink-faint uppercase tracking-wide">
                      Produto
                    </th>
                    <th className="px-4 py-2.5 text-center text-[12px] font-medium text-ink-faint uppercase tracking-wide">
                      Qtd
                    </th>
                    <th className="px-4 py-2.5 text-right text-[12px] font-medium text-ink-faint uppercase tracking-wide">
                      Preço unit.
                    </th>
                    <th className="px-4 py-2.5 text-right text-[12px] font-medium text-ink-faint uppercase tracking-wide">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {request.products.map((product, index) => (
                    <tr
                      key={index}
                      className="hover:bg-surface-sunken/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[13px] text-ink">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-center text-[13px] text-ink">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] text-ink">
                        {product.price.toFixed(2)} Kz
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] font-medium text-ink">
                        {(product.price * product.quantity).toFixed(2)} Kz
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-surface-sunken border-t border-line-soft">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right text-[14px] font-semibold text-ink"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-[16px] font-bold text-ink">
                      {request.total.toFixed(2)} Kz
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Resumo */}
          <div className="mt-6 rounded-xl border border-line-soft bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-soft">Nº de produtos</span>
              <span className="text-[13px] font-medium text-ink">
                {request.products.length}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[13px] text-ink-soft">Status</span>
              <RequestStatusBadge status={request.status} />
            </div>
            <div className="flex items-center justify-between mt-1 pt-3 border-t border-line-soft">
              <span className="text-[15px] font-semibold text-ink">
                Valor total
              </span>
              <span className="text-[18px] font-bold text-ink">
                {request.total.toFixed(2)} Kz
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line-soft px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-line-soft px-6 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-sunken focus-ring"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
