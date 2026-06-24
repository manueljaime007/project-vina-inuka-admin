export function Topbar({
  title = "Painel de administração",
}: {
  title?: string;
}) {
  return (
    <header className="flex h-17 shrink-0 items-center justify-between border-b border-line-soft bg-surface px-8">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
        {title}
      </span>
      <span className="text-[13px] text-ink-soft">admin@aurelie.pt</span>
    </header>
  );
}
