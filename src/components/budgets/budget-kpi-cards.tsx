import { CalendarClock, Package, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyBRL, formatDate } from "@/lib/format";

function daysUntil(date: string | null) {
  if (!date) return null;
  const diff = Math.ceil(
    (new Date(`${date}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return diff;
}

export function BudgetKpiCards({
  valorTotal,
  itemsTotal,
  dataPrevisaoEntrega,
  overdue,
}: {
  valorTotal: number;
  itemsTotal: number;
  dataPrevisaoEntrega: string | null;
  overdue?: boolean;
}) {
  const diff = daysUntil(dataPrevisaoEntrega);
  const prazoSubtitle =
    diff === null
      ? "Sem data definida"
      : diff > 0
        ? `Em ${diff} dia${diff === 1 ? "" : "s"}`
        : diff === 0
          ? "É hoje"
          : `${Math.abs(diff)} dia${Math.abs(diff) === 1 ? "" : "s"} de atraso`;

  return (
    <div className="flex flex-col gap-3">
      <Card size="sm">
        <CardContent className="flex flex-col items-center gap-0.5 py-4 text-center">
          <p className="text-xs text-muted-foreground">Valor do orçamento</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">{formatCurrencyBRL(valorTotal)}</p>
          <p className="text-xs text-muted-foreground">Valor total estimado</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card size="sm">
          <CardContent className="flex items-start gap-2.5 py-3">
            <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <p className="text-xs text-muted-foreground">Gasto previsto</p>
              <p className="truncate text-base font-semibold tabular-nums text-foreground">
                {formatCurrencyBRL(itemsTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-start gap-2.5 py-3">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-col">
              <p className="text-xs text-muted-foreground">Entrega</p>
              <p
                className={cn(
                  "flex items-center gap-1 truncate text-base font-semibold tabular-nums",
                  overdue ? "text-[color:var(--chart-5)]" : "text-foreground",
                )}
              >
                {formatDate(dataPrevisaoEntrega)}
                {overdue && <TriangleAlert className="size-3.5 shrink-0" />}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{prazoSubtitle}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
