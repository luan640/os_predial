import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, CircleDollarSign, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { formatCurrencyBRL } from "@/lib/format";
import { KpiCard, type KpiTrend } from "@/components/dashboard/kpi-card";
import { isBudgetOverdue, type BudgetStatus } from "@/lib/budget-status";

const ACTIVE_STATUSES = ["enviado", "aprovado", "em_andamento"];

function trendFromCounts(now: number, before: number): KpiTrend {
  if (before === 0) return now === 0 ? null : { percent: 100, direction: "up" };
  const percent = Math.round(((now - before) / before) * 100);
  if (percent === 0) return null;
  return { percent: Math.abs(percent), direction: percent > 0 ? "up" : "down" };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [{ data: budgets }, { data: clients }] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, titulo, status, valor_total, data_previsao_entrega, created_at")
      .eq("company_id", companyId),
    supabase.from("clients").select("id, created_at").eq("company_id", companyId),
  ]);

  const allBudgets = budgets ?? [];
  const allClients = clients ?? [];

  const activeBudgets = allBudgets.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const activeValorTotal = activeBudgets.reduce((sum, b) => sum + Number(b.valor_total), 0);

  const activeBudgetsBefore = activeBudgets.filter((b) => b.created_at < currentMonthStart);
  const activeValorTotalBefore = activeBudgetsBefore.reduce((sum, b) => sum + Number(b.valor_total), 0);
  const clientsBefore = allClients.filter((c) => c.created_at < currentMonthStart).length;

  const overdueBudgets = allBudgets.filter((b) =>
    isBudgetOverdue(b.status as BudgetStatus, b.data_previsao_entrega),
  );
  const overdueBudgetsBefore = overdueBudgets.filter((b) => b.created_at < currentMonthStart);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">Visão geral das suas obras e orçamentos.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={Building2}
          accent="chart-1"
          label="Orçamentos ativos"
          value={String(activeBudgets.length)}
          trend={trendFromCounts(activeBudgets.length, activeBudgetsBefore.length)}
          comparisonText={`de ${activeBudgetsBefore.length} no mês anterior`}
        />
        <KpiCard
          icon={CircleDollarSign}
          accent="chart-3"
          label="Valor em obras ativas"
          value={formatCurrencyBRL(activeValorTotal)}
          trend={trendFromCounts(activeValorTotal, activeValorTotalBefore)}
          comparisonText={`vs ${formatCurrencyBRL(activeValorTotalBefore)} anterior`}
        />
        <KpiCard
          icon={Users}
          accent="chart-2"
          label="Clientes cadastrados"
          value={String(allClients.length)}
          trend={trendFromCounts(allClients.length, clientsBefore)}
          comparisonText={`de ${clientsBefore} no mês anterior`}
        />
        <KpiCard
          icon={AlertTriangle}
          accent="chart-5"
          label="Orçamentos em atraso"
          value={String(overdueBudgets.length)}
          trend={trendFromCounts(overdueBudgets.length, overdueBudgetsBefore.length)}
          comparisonText={`de ${overdueBudgetsBefore.length} no mês anterior`}
          invertTrendColors
        />
      </div>

      {allBudgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não tem orçamentos cadastrados. Crie o primeiro para começar a acompanhar suas obras.
            </p>
            <Link href="/orcamentos/novo" className="text-sm font-medium text-foreground underline underline-offset-4">
              Criar orçamento
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
