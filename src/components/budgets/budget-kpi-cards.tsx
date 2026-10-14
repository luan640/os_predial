import { CalendarClock, DollarSign, Package } from "lucide-react";
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
  itemsCount,
  dataPrevisaoEntrega,
}: {
  valorTotal: number;
  itemsTotal: number;
  itemsCount: number;
  dataPrevisaoEntrega: string | null;
}) {
  const diff = daysUntil(dataPrevisaoEntrega);

  const cards = [
    {
      icon: DollarSign,
      iconClassName: "bg-[color-mix(in_oklch,var(--primary),transparent_85%)] text-primary",
      label: "Valor do orçamento",
      value: formatCurrencyBRL(valorTotal),
      subtitle: "Valor total estimado",
    },
    {
      icon: Package,
      iconClassName: "bg-[color-mix(in_oklch,var(--chart-4),transparent_85%)] text-[color:var(--chart-4)]",
      label: "Total em itens",
      value: formatCurrencyBRL(itemsTotal),
      subtitle: `${itemsCount} ${itemsCount === 1 ? "item cadastrado" : "itens cadastrados"}`,
    },
    {
      icon: CalendarClock,
      iconClassName: "bg-[color-mix(in_oklch,var(--chart-3),transparent_85%)] text-[color:var(--chart-3)]",
      label: "Previsão de entrega",
      value: formatDate(dataPrevisaoEntrega),
      subtitle:
        diff === null
          ? "Sem data definida"
          : diff > 0
            ? `Em ${diff} dia${diff === 1 ? "" : "s"}`
            : diff === 0
              ? "É hoje"
              : `${Math.abs(diff)} dia${Math.abs(diff) === 1 ? "" : "s"} de atraso`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-start gap-3 py-4">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.iconClassName}`}>
              <card.icon className="size-4.5" />
            </span>
            <div className="flex min-w-0 flex-col">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="truncate text-lg font-semibold tabular-nums text-foreground">{card.value}</p>
              <p className="truncate text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
