"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { ToastProvider } from "@/components/ui/Toast";
import { cn } from "@/shared/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        <div
          className={cn(
            "flex min-h-screen flex-1 flex-col transition-all duration-300",
            collapsed ? "ml-20" : "ml-65",
          )}
        >
          <Topbar collapsed={collapsed} />
          <main
            className={cn(
              "flex-1 px-8 py-8 transition-all duration-300",
              collapsed ? "mt-17 pl-6" : "mt-17 pl-8",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
