import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowLink } from "@/components/ui/table-row-link";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { getNextBudgetNumero } from "@/lib/queries/budgets";
import { formatCurrencyBRL, formatDate } from "@/lib/format";
import {
  BUDGET_STATUS,
  BUDGET_STATUS_CONFIG,
  OVERDUE_BADGE,
  isBudgetOverdue,
  type BudgetStatus,
} from "@/lib/budget-status";
import { NewBudgetSheet } from "@/components/budgets/new-budget-sheet";
import { BudgetStatusFilter } from "@/components/budgets/budget-status-filter";

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; novo?: string; error?: string }>;
}) {
  const { q, status, novo, error } = await searchParams;
  const selectedStatuses = (status ?? "")
    .split(",")
    .filter((s): s is BudgetStatus => (BUDGET_STATUS as readonly string[]).includes(s));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  let query = supabase
    .from("budgets")
    .select("id, titulo, numero, status, valor_total, data_previsao_entrega, clients(nome)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (selectedStatuses.length > 0) {
    query = query.in("status", selectedStatuses);
  }

  if (q) {
    query = query.ilike("titulo", `%${q}%`);
  }

  const [{ data: budgets }, { data: clients }, nextNumero] = await Promise.all([
    query,
    supabase.from("clients").select("id, nome").eq("company_id", companyId).eq("ativo", true).order("nome"),
    getNextBudgetNumero(supabase, companyId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe todas as suas obras em andamento.</p>
        </div>
        <NewBudgetSheet
          clients={clients ?? []}
          defaultNumero={nextNumero}
          defaultOpen={novo === "1"}
          error={error}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form className="relative max-w-sm flex-1">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por título..."
            className="pl-9"
          />
        </form>
        <BudgetStatusFilter selected={selectedStatuses} />
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Nº</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Previsão de entrega</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets && budgets.length > 0 ? (
              budgets.map((budget) => {
                const statusInfo = BUDGET_STATUS_CONFIG[budget.status as BudgetStatus];
                const client = Array.isArray(budget.clients) ? budget.clients[0] : budget.clients;
                const overdue = isBudgetOverdue(budget.status as BudgetStatus, budget.data_previsao_entrega);
                return (
                  <TableRowLink key={budget.id} href={`/orcamentos/${budget.id}`}>
                    <TableCell className="text-muted-foreground tabular-nums">{budget.numero || "—"}</TableCell>
                    <TableCell>
                      <Link href={`/orcamentos/${budget.id}`} className="font-medium text-foreground hover:underline">
                        {budget.titulo}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client?.nome ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge className={statusInfo?.className}>{statusInfo?.label ?? budget.status}</Badge>
                        {overdue && <Badge className={OVERDUE_BADGE.className}>{OVERDUE_BADGE.label}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(budget.data_previsao_entrega)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyBRL(budget.valor_total)}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRowLink>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {q || selectedStatuses.length > 0 ? "Nenhum orçamento encontrado." : "Nenhum orçamento cadastrado ainda."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {budgets && budgets.length > 0 ? (
          budgets.map((budget) => {
            const statusInfo = BUDGET_STATUS_CONFIG[budget.status as BudgetStatus];
            const client = Array.isArray(budget.clients) ? budget.clients[0] : budget.clients;
            const overdue = isBudgetOverdue(budget.status as BudgetStatus, budget.data_previsao_entrega);
            return (
              <Link
                key={budget.id}
                href={`/orcamentos/${budget.id}`}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10 active:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {budget.numero || "—"}
                    </span>
                    <span className="font-medium text-foreground">{budget.titulo}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge className={statusInfo?.className}>{statusInfo?.label ?? budget.status}</Badge>
                    {overdue && <Badge className={OVERDUE_BADGE.className}>{OVERDUE_BADGE.label}</Badge>}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{client?.nome ?? "—"}</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {formatCurrencyBRL(budget.valor_total)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Previsão de entrega</span>
                  <span>{formatDate(budget.data_previsao_entrega)}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
            {q || selectedStatuses.length > 0 ? "Nenhum orçamento encontrado." : "Nenhum orçamento cadastrado ainda."}
          </div>
        )}
      </div>
    </div>
  );
}
