import type { LucideIcon } from "lucide-react";
import {
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
  { href: "/orcamentos", label: "Orçamentos", icon: ClipboardList },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/materiais", label: "Materiais", icon: Package },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
