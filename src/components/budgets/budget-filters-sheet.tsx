"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";
import { BUDGET_SORT_OPTIONS, DEFAULT_BUDGET_SORT } from "@/lib/budget-sort";
import { useIsMobile } from "@/lib/use-is-mobile";
import { cn } from "@/lib/utils";

export function BudgetFiltersSheet({
  selectedStatuses,
  sort,
}: {
  selectedStatuses: BudgetStatus[];
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const activeCount = selectedStatuses.length + (sort !== DEFAULT_BUDGET_SORT ? 1 : 0);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setSort(value: string) {
    updateParams((params) => {
      if (value === DEFAULT_BUDGET_SORT) {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
    });
  }

  function toggleStatus(status: BudgetStatus) {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    updateParams((params) => {
      if (next.length === 0) params.delete("status");
      else params.set("status", next.join(","));
    });
  }

  function clearAll() {
    updateParams((params) => {
      params.delete("status");
      params.delete("sort");
    });
  }

  const content = (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Ordenar por</p>
        <div className="flex flex-col gap-0.5">
          {BUDGET_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent",
                sort === option.value ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {option.label}
              {sort === option.value && <Check className="size-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Status</p>
        <div className="flex flex-col gap-0.5">
          {BUDGET_STATUS.map((status) => {
            const checked = selectedStatuses.includes(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatus(status)}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent"
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {checked && <Check className="size-3" />}
                </span>
                <span className={cn("size-2 shrink-0 rounded-full", BUDGET_STATUS_CONFIG[status].dot)} />
                {BUDGET_STATUS_CONFIG[status].label}
              </button>
            );
          })}
        </div>
      </div>

      {activeCount > 0 && (
        <Button type="button" variant="outline" className="w-full" onClick={clearAll}>
          <X className="size-3.5" />
          Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        <ListFilter className="size-4" />
        Filtros
        {activeCount > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex w-full flex-col sm:max-w-sm data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Ordene e filtre os orçamentos listados.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">{content}</div>
      </SheetContent>
    </Sheet>
  );
}
