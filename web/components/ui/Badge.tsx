import { cn } from "@/shared/lib/utils";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success-ink",
  warning: "bg-warning-bg text-warning-ink",
  danger: "bg-danger-bg text-danger-deep",
  info: "bg-info-bg text-info-ink",
  neutral: "bg-surface-sunken text-ink-soft",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
