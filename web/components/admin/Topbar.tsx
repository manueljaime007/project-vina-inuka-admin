"use client";

import { cn } from "@/shared/helpers/utils";
import { useAuthStore } from "@/store/authStore";

interface TopbarProps {
  title?: string;
  collapsed?: boolean;
}

export function Topbar({
  title = "Painel de administração",
  collapsed = false,
}: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-17 shrink-0 items-center justify-between border-b border-line-soft bg-surface transition-all duration-300",
        collapsed ? "left-20" : "left-65",
      )}
    >
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint transition-all duration-300",
          collapsed ? "pl-3" : "pl-8",
        )}
      >
        {title}
      </span>
      <span className="pr-8 text-[13px] text-ink-soft">
        {user?.email || "admin@aurelie.pt"}
      </span>
    </header>
  );
}
