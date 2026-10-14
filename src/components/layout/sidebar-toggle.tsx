"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/components/layout/sidebar-context";

export function SidebarToggle() {
  const { toggle } = useSidebarContext();

  return (
    <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggle}>
      <PanelLeft className="size-5" />
      <span className="sr-only">Abrir/fechar barra lateral</span>
    </Button>
  );
}
