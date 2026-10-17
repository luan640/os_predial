import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiTrend = {
  percent: number;
  direction: "up" | "down";
} | null;

const ACCENT_CLASSNAMES = {
  "chart-1": "bg-[color-mix(in_oklch,var(--chart-1),transparent_85%)] text-[color:var(--chart-1)]",
  "chart-2": "bg-[color-mix(in_oklch,var(--chart-2),transparent_85%)] text-[color:var(--chart-2)]",
  "chart-3": "bg-[color-mix(in_oklch,var(--chart-3),transparent_85%)] text-[color:var(--chart-3)]",
  "chart-4": "bg-[color-mix(in_oklch,var(--chart-4),transparent_85%)] text-[color:var(--chart-4)]",
  "chart-5": "bg-[color-mix(in_oklch,var(--chart-5),transparent_85%)] text-[color:var(--chart-5)]",
} as const;

export function KpiCard({
  icon: Icon,
  accent,
  label,
  value,
  trend,
  comparisonText,
  invertTrendColors = false,
}: {
  icon: LucideIcon;
  accent: keyof typeof ACCENT_CLASSNAMES;
  label: string;
  value: string;
  trend: KpiTrend;
  comparisonText: string;
  /** For metrics where growth is bad (e.g. orçamentos em atraso), flip which direction reads as positive. */
  invertTrendColors?: boolean;
}) {
  const isGood = trend ? (invertTrendColors ? trend.direction === "down" : trend.direction === "up") : false;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              ACCENT_CLASSNAMES[accent],
            )}
          >
            <Icon className="size-4" />
          </span>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        {trend && (
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                isGood ? "text-[color:var(--chart-2)]" : "text-destructive",
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {trend.percent}%
            </span>
            <span className="text-muted-foreground">{comparisonText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
