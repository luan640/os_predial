"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";

type Slice = { key: keyof typeof CHART_COLORS; label: string; value: number };

export function StatusDonut({ data }: { data: Slice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chartData = data.filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Sem orçamentos para exibir ainda.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius={56}
          outerRadius={80}
          paddingAngle={2}
          cornerRadius={4}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {chartData.map((slice) => (
            <Cell key={slice.key} fill={CHART_COLORS[slice.key]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} orçamento${value === 1 ? "" : "s"}`, name]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--card)",
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
