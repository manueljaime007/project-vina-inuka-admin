import { cn } from "@/shared/helpers/utils";

const statusMap = {
  pending: {
    label: "Pendente",
    className: "bg-warning-bg text-warning-ink",
    dot: "bg-warning-ink",
  },
  completed: {
    label: "Concluída",
    className: "bg-success-bg text-success-ink",
    dot: "bg-success-ink",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-danger-bg text-danger",
    dot: "bg-danger",
  },
};

interface RequestStatusBadgeProps {
  status: "pending" | "completed" | "cancelled";
  className?: string;
}

export function RequestStatusBadge({
  status,
  className,
}: RequestStatusBadgeProps) {
  const config = statusMap[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium",
        config.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
