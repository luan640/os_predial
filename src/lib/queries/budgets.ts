import type { SupabaseClient } from "@supabase/supabase-js";

export async function getNextBudgetNumero(supabase: SupabaseClient, companyId: string) {
  const year = new Date().getFullYear();

  const [{ data: budgets }, { data: company }] = await Promise.all([
    supabase.from("budgets").select("numero").eq("company_id", companyId).not("numero", "is", null),
    supabase.from("companies").select("proximo_numero_orcamento").eq("id", companyId).maybeSingle(),
  ]);

  const suffix = `/${year}`;
  const maxSequence = (budgets ?? []).reduce((max, row) => {
    const numero = row.numero as string | null;
    if (!numero || !numero.endsWith(suffix)) return max;
    const n = parseInt(numero.slice(0, -suffix.length), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);

  const floor = company?.proximo_numero_orcamento ?? 1;
  const next = Math.max(maxSequence + 1, floor);

  return `${next}/${year}`;
}
