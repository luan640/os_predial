"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { getNextBudgetNumero } from "@/lib/queries/budgets";
import { BUDGET_STATUS } from "@/lib/budget-status";

const budgetSchema = z
  .object({
    client_id: z.string().uuid("Selecione um cliente."),
    titulo: z.string().trim().min(2, "Informe um título para o orçamento."),
    valor_total: z.coerce.number().min(0).optional(),
    data_inicio: z.string().optional(),
    data_previsao_entrega: z.string().optional(),
    prazo_qtd: z.coerce.number().int().positive().optional(),
    prazo_unidade: z.enum(["hora", "dia", "semana", "mes"]).optional(),
  })
  .refine(
    (data) => !data.data_inicio || !data.data_previsao_entrega || data.data_inicio <= data.data_previsao_entrega,
    {
      message: "A previsão de entrega não pode ser antes do início.",
      path: ["data_previsao_entrega"],
    },
  );

function parseBudgetForm(formData: FormData) {
  return budgetSchema.safeParse({
    client_id: formData.get("client_id"),
    titulo: formData.get("titulo"),
    valor_total: formData.get("valor_total") || 0,
    data_inicio: formData.get("data_inicio") || undefined,
    data_previsao_entrega: formData.get("data_previsao_entrega") || undefined,
    prazo_qtd: formData.get("prazo_qtd") || undefined,
    prazo_unidade: formData.get("prazo_unidade") || undefined,
  });
}

export async function createBudgetAction(formData: FormData) {
  const parsed = parseBudgetForm(formData);

  if (!parsed.success) {
    redirect(`/orcamentos?novo=1&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);
  const numero = await getNextBudgetNumero(supabase, companyId);

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      company_id: companyId,
      client_id: parsed.data.client_id,
      titulo: parsed.data.titulo,
      numero,
      valor_total: parsed.data.valor_total || 0,
      data_inicio: parsed.data.data_inicio || null,
      data_previsao_entrega: parsed.data.data_previsao_entrega || null,
      prazo_qtd: parsed.data.prazo_qtd || 1,
      prazo_unidade: parsed.data.prazo_unidade || "dia",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/orcamentos?novo=1&error=${encodeURIComponent(error?.message ?? "Erro ao criar orçamento.")}`);
  }

  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${data.id}`);
}

export async function updateBudgetAction(budgetId: string, formData: FormData) {
  const parsed = parseBudgetForm(formData);

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("budgets")
    .update({
      client_id: parsed.data.client_id,
      titulo: parsed.data.titulo,
      valor_total: parsed.data.valor_total || 0,
      data_inicio: parsed.data.data_inicio || null,
      data_previsao_entrega: parsed.data.data_previsao_entrega || null,
      prazo_qtd: parsed.data.prazo_qtd || 1,
      prazo_unidade: parsed.data.prazo_unidade || "dia",
    })
    .eq("id", budgetId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?message=${encodeURIComponent("Orçamento atualizado.")}`);
}

export async function updateBudgetObjetivoAction(budgetId: string, formData: FormData) {
  const descricao = (formData.get("descricao") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("budgets").update({ descricao }).eq("id", budgetId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=objetivo&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=objetivo&message=${encodeURIComponent("Objetivo atualizado.")}`);
}

export async function updateBudgetStatusAction(budgetId: string, formData: FormData) {
  const status = formData.get("status");
  const parsed = z.enum(BUDGET_STATUS).safeParse(status);

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?error=${encodeURIComponent("Status inválido.")}`);
  }

  const supabase = await createClient();
  const updates: Record<string, string | null> = { status: parsed.data };

  if (parsed.data === "concluido") {
    updates.data_conclusao = new Date().toISOString().slice(0, 10);
  }

  const { error } = await supabase.from("budgets").update(updates).eq("id", budgetId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("budget_status_history").insert({ budget_id: budgetId, status: parsed.data });

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}`);
}

export async function deleteBudgetAction(budgetId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("budgets").delete().eq("id", budgetId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/orcamentos");
  redirect("/orcamentos");
}
