"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Tag,
  Inbox,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/categories", label: "Categorias", icon: Tag },
  { href: "/requests", label: "Solicitações", icon: Inbox },
];

const secondaryNav = [
  { href: "/trash", label: "Lixo", icon: Trash2 },
  { href: "/settings", label: "Definições", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-65 shrink-0 flex-col border-r border-line-soft bg-surface">
      <div className="px-7 pt-8 pb-6">
        <Link href="/dashboard" className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-ink">
            Aurélie<span className="text-brand-rose-deep">.</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {nav.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}

        <div className="my-4 h-px bg-line-soft" />

        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="border-t border-line-soft px-4 py-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring"
        >
          <LogOut className="size-4.5" />
          Sair
        </button>
        <p className="mt-3 truncate px-3 text-[12px] text-ink-faint">
          admin@aurelie.pt
        </p>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors focus-ring",
        active
          ? "bg-brand-navy text-white shadow-[0_2px_10px_-2px_rgba(20,24,43,0.4)]"
          : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
      )}
    >
      <Icon className="size-4.5" strokeWidth={1.8} />
      {label}
    </Link>
  );
}
