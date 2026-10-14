"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG } from "@/lib/budget-status";

export function BudgetStatusFilter({ selected }: { selected: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function applyStatuses(next: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("status");
    } else {
      params.set("status", next.join(","));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggle(status: string) {
    const next = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];
    applyStatuses(next);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <ListFilter className="size-4" />
        Status
        {selected.length > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {selected.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {BUDGET_STATUS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selected.includes(status)}
              onCheckedChange={() => toggle(status)}
            >
              {BUDGET_STATUS_CONFIG[status].label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              onClick={() => applyStatuses([])}
              className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <X className="size-3.5" />
              Limpar filtro
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
