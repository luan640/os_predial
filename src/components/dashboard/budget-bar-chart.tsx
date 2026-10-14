"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, CHART_GRID, CHART_MUTED } from "@/lib/chart-colors";
import { formatCurrencyBRL } from "@/lib/format";

type Row = { titulo: string; orcado: number };

export function BudgetBarChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Sem orçamentos ativos ainda.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_GRID} />
        <XAxis
          dataKey="titulo"
          tickLine={false}
          axisLine={{ stroke: CHART_GRID }}
          tick={{ fontSize: 11, fill: CHART_MUTED }}
          interval={0}
          tickFormatter={(value: string) => (value.length > 14 ? `${value.slice(0, 14)}…` : value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: CHART_MUTED }}
          tickFormatter={(value: number) => formatCurrencyBRL(value).replace(",00", "")}
          width={72}
        />
        <Tooltip
          formatter={(value) => formatCurrencyBRL(Number(value))}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--card)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="orcado" name="Valor" fill={CHART_COLORS.pendente} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
