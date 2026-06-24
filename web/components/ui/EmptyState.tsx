import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
        <Icon className="size-6" strokeWidth={1.6} />
      </span>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-[14px] text-ink-soft">{description}</p>
      {action}
    </div>
  );
}
