"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const orcamentoItemSchema = z.object({
  servico: z.string().trim().min(2, "Descreva o serviço."),
  quantidade: z.coerce.number().positive("Quantidade deve ser maior que zero."),
  valor_unitario: z.coerce.number().min(0, "Valor unitário inválido."),
});

export async function createOrcamentoItemAction(budgetId: string, formData: FormData) {
  const parsed = orcamentoItemSchema.safeParse({
    servico: formData.get("servico"),
    quantidade: formData.get("quantidade") || 1,
    valor_unitario: formData.get("valor_unitario") || 0,
  });

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?tab=orcamento&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("budget_orcamento_items")
    .select("id", { count: "exact", head: true })
    .eq("budget_id", budgetId);

  const { error } = await supabase.from("budget_orcamento_items").insert({
    budget_id: budgetId,
    servico: parsed.data.servico,
    quantidade: parsed.data.quantidade,
    valor_unitario: parsed.data.valor_unitario,
    ordem: count ?? 0,
  });

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=orcamento&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=orcamento&message=${encodeURIComponent("Item adicionado ao orçamento.")}`);
}

export async function updateOrcamentoItemAction(budgetId: string, formData: FormData) {
  const itemId = formData.get("item_id");
  const parsed = orcamentoItemSchema.safeParse({
    servico: formData.get("servico"),
    quantidade: formData.get("quantidade") || 1,
    valor_unitario: formData.get("valor_unitario") || 0,
  });

  if (typeof itemId !== "string" || !parsed.success) {
    redirect(
      `/orcamentos/${budgetId}?tab=orcamento&error=${encodeURIComponent(parsed.success ? "Item inválido." : parsed.error.issues[0].message)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_orcamento_items")
    .update({
      servico: parsed.data.servico,
      quantidade: parsed.data.quantidade,
      valor_unitario: parsed.data.valor_unitario,
    })
    .eq("id", itemId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=orcamento&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=orcamento&message=${encodeURIComponent("Item do orçamento atualizado.")}`);
}

export async function deleteOrcamentoItemAction(budgetId: string, formData: FormData) {
  const itemId = formData.get("item_id");
  if (typeof itemId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_orcamento_items").delete().eq("id", itemId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=orcamento&message=${encodeURIComponent("Item removido do orçamento.")}`);
}
