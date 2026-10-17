import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";
import { formatRelativeDateTime } from "@/lib/format";

type HistoryEntry = { id: string; status: string; changed_at: string };

export function BudgetStatusHistoryCard({ entries }: { entries: HistoryEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4 text-muted-foreground" />
          Histórico de status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <ol className="flex flex-col gap-3">
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
          <p className="py-2 text-center text-sm text-muted-foreground">Nenhum registro ainda.</p>
        )}
      </CardContent>
    </Card>
  );
}
