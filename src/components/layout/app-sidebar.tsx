"use client";

import { Building2 } from "lucide-react";
import { cn } from "cn";
import { AppSidebarNav } from "@/components/layout/app-sidebar-nav";
import { useSidebarContext } from "@/components/layout/sidebar-context";

export function AppSidebar() {
  const { collapsed } = useSidebarContext();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-0 border-r-0" : "w-64"
      )}
    >
      <div className="flex w-64 items-center gap-2 px-5 py-5">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="size-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">ObraCerta</span>
      </div>
      <div className="w-64">
        <AppSidebarNav />
      </div>
    </aside>
  );
}
