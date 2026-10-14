import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { formatCurrencyBRL } from "@/lib/format";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { BudgetBarChart } from "@/components/dashboard/budget-bar-chart";
import { isBudgetOverdue, type BudgetStatus } from "@/lib/budget-status";

const ACTIVE_STATUSES = ["enviado", "aprovado", "em_andamento"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  const [{ data: budgets }, { count: clientsCount }, { count: workersCount }] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, titulo, status, valor_total, data_previsao_entrega")
      .eq("company_id", companyId),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    supabase.from("workers").select("id", { count: "exact", head: true }).eq("company_id", companyId),
  ]);

  const allBudgets = budgets ?? [];
  const activeBudgets = allBudgets.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const activeValorTotal = activeBudgets.reduce((sum, b) => sum + Number(b.valor_total), 0);

  const overdueBudgets = allBudgets.filter((b) =>
    isBudgetOverdue(b.status as BudgetStatus, b.data_previsao_entrega),
  );
  const overdueIds = new Set(overdueBudgets.map((b) => b.id));

  const statusData = [
    {
      key: "pendente" as const,
      label: "Rascunho / aguardando",
      value: allBudgets.filter(
        (b) => ["rascunho", "enviado", "aprovado"].includes(b.status) && !overdueIds.has(b.id),
      ).length,
    },
    {
      key: "emAndamento" as const,
      label: "Em andamento",
      value: allBudgets.filter((b) => b.status === "em_andamento" && !overdueIds.has(b.id)).length,
    },
    {
      key: "concluido" as const,
      label: "Concluído",
      value: allBudgets.filter((b) => b.status === "concluido").length,
    },
    {
      key: "atrasado" as const,
      label: "Atrasado",
      value: overdueBudgets.length,
    },
  ];

  const barData = activeBudgets
    .slice()
    .sort((a, b) => Number(b.valor_total) - Number(a.valor_total))
    .slice(0, 6)
    .map((b) => ({
      titulo: b.titulo,
      orcado: Number(b.valor_total),
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">Visão geral das suas obras e orçamentos.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Orçamentos ativos</p>
            <p className="text-2xl font-semibold text-foreground">{activeBudgets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Valor em obras ativas</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {formatCurrencyBRL(activeValorTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
            <p className="text-2xl font-semibold text-foreground">{clientsCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Operadores</p>
            <p className="text-2xl font-semibold text-foreground">{workersCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orçamentos por status</CardTitle>
            <CardDescription>Distribuição de todas as obras cadastradas.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDonut data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Maiores orçamentos ativos</CardTitle>
            <CardDescription>Obras ativas com maior valor orçado.</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetBarChart data={barData} />
          </CardContent>
        </Card>
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
