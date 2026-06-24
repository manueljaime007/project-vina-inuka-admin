"use client";

import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/shared/helpers/utils";

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

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen shrink-0 flex-col border-r border-line-soft bg-surface transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-65",
      )}
    >
      {/* Botão toggle absoluto no centro da borda direita */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute -right-3.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-line-soft bg-surface shadow-md transition-all hover:bg-surface-sunken focus-ring",
          collapsed && "rotate-180",
        )}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? (
          <ChevronRight className="size-3.5 text-ink-soft" strokeWidth={2.5} />
        ) : (
          <ChevronLeft className="size-3.5 text-ink-soft" strokeWidth={2.5} />
        )}
      </button>

      {/* Logo/Header */}
      <div className="px-7 pt-8 pb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Store className="size-7 text-brand-rose-deep" strokeWidth={1.8} />
          {!collapsed && (
            <>
              <span className="font-display text-2xl text-ink whitespace-nowrap">
                Vina Inuka<span className="text-brand-rose-deep">.</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint whitespace-nowrap">
                Admin
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        <div className="my-4 h-px bg-line-soft" />

        {secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line-soft px-4 py-5">
        <button
          // onClick={handleLogout}
          onClick={() => setShowLogoutModal(true)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-ring",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="size-4.5 shrink-0" />
          {!collapsed && "Sair"}
        </button>
        {!collapsed && (
          <p className="mt-3 truncate px-3 text-[12px] text-ink-faint">
            silvinamanuel74@gmail.com
          </p>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-ink">Terminar sessão</h2>

            <p className="mt-2 text-sm text-ink-soft">
              Tem a certeza que deseja terminar a sessão?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-line-soft px-4 py-2 text-sm hover:bg-surface-sunken"
              >
                Cancelar
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors focus-ring",
        active
          ? "bg-brand-navy text-white shadow-[0_2px_10px_-2px_rgba(20,24,43,0.4)]"
          : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-4.5 shrink-0" strokeWidth={1.8} />
      {!collapsed && label}
    </Link>
  );
}
