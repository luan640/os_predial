"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  tipo: z.enum(["material", "mao_de_obra", "servico"]),
  descricao: z.string().trim().min(2, "Descreva o item."),
  quantidade: z.coerce.number().positive("Quantidade deve ser maior que zero."),
  unidade: z.string().trim().optional(),
  valor_unitario: z.coerce.number().min(0),
});

export async function createBudgetItemAction(budgetId: string, formData: FormData) {
  const parsed = itemSchema.safeParse({
    tipo: formData.get("tipo") || "material",
    descricao: formData.get("descricao"),
    quantidade: formData.get("quantidade") || 1,
    unidade: formData.get("unidade") || undefined,
    valor_unitario: formData.get("valor_unitario") || 0,
  });

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?tab=itens&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("budget_items").insert({
    budget_id: budgetId,
    tipo: parsed.data.tipo,
    descricao: parsed.data.descricao,
    quantidade: parsed.data.quantidade,
    unidade: parsed.data.unidade || null,
    valor_unitario: parsed.data.valor_unitario,
  });

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=itens&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=itens`);
}

export async function deleteBudgetItemAction(budgetId: string, formData: FormData) {
  const itemId = formData.get("item_id");
  if (typeof itemId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_items").delete().eq("id", itemId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=itens`);
}
