"use client";

import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";
import { formatRelativeDateTime } from "@/lib/format";

type HistoryEntry = { id: string; status: string; changed_at: string };

export function BudgetStatusHistory({ entries }: { entries: HistoryEntry[] }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
          />
        }
      >
        <History className="size-3.5" />
        Histórico
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Histórico de status</DialogTitle>
          <DialogDescription>Todas as mudanças de status deste orçamento, mais recentes primeiro.</DialogDescription>
        </DialogHeader>
        {entries.length > 0 ? (
          <ol className="flex max-h-80 flex-col gap-3 overflow-y-auto">
            {entries.map((entry) => {
              const config = BUDGET_STATUS_CONFIG[entry.status as BudgetStatus];
              return (
                <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className={`size-2 shrink-0 rounded-full ${config?.dot ?? "bg-muted-foreground"}`} />
                    {config?.label ?? entry.status}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeDateTime(entry.changed_at)}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">Nenhum registro ainda.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
