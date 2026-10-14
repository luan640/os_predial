import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/orcamentos", label: "Orçamentos", icon: ClipboardList },
  { href: "/materiais", label: "Materiais", icon: Package },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
