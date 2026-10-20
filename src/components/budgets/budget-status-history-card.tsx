import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetStatusHistory } from "@/components/budgets/budget-status-history";
import { BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";
import { formatRelativeDateTime } from "@/lib/format";

type HistoryEntry = { id: string; status: string; changed_at: string };

const VISIBLE_LIMIT = 3;

export function BudgetStatusHistoryCard({ entries }: { entries: HistoryEntry[] }) {
  const visible = entries.slice(0, VISIBLE_LIMIT);

  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="size-4 text-muted-foreground" />
          Histórico de status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visible.length > 0 ? (
          <ol className="flex flex-col">
            {visible.map((entry, index) => {
              const config = BUDGET_STATUS_CONFIG[entry.status as BudgetStatus];
              const isLast = index === visible.length - 1;
              return (
                <li key={entry.id} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <span className={`size-2 shrink-0 rounded-full ${config?.dot ?? "bg-muted-foreground"}`} />
                    {!isLast && <span className="my-0.5 w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pb-3 text-sm">
                    <span className="truncate font-medium text-foreground">{config?.label ?? entry.status}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeDateTime(entry.changed_at)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="py-2 text-center text-sm text-muted-foreground">Nenhum registro ainda.</p>
        )}

        {entries.length > VISIBLE_LIMIT && (
          <div className="flex justify-end">
            <BudgetStatusHistory entries={entries} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
