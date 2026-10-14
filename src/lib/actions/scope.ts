"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const scopeItemSchema = z.object({
  descricao: z.string().trim().min(2, "Descreva o item do escopo."),
});

export type ScopeFormState = { error?: string; successToken?: number } | null;

export async function createScopeItemAction(
  budgetId: string,
  _prevState: ScopeFormState,
  formData: FormData,
): Promise<ScopeFormState> {
  const parsed = scopeItemSchema.safeParse({ descricao: formData.get("descricao") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("budget_scope_items")
    .select("id", { count: "exact", head: true })
    .eq("budget_id", budgetId);

  const { error } = await supabase.from("budget_scope_items").insert({
    budget_id: budgetId,
    descricao: parsed.data.descricao,
    ordem: count ?? 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  return { successToken: Date.now() };
}

export async function updateScopeItemAction(budgetId: string, formData: FormData) {
  const itemId = formData.get("item_id");
  const parsed = scopeItemSchema.safeParse({ descricao: formData.get("descricao") });

  if (typeof itemId !== "string" || !parsed.success) {
    redirect(
      `/orcamentos/${budgetId}?tab=escopo&error=${encodeURIComponent(parsed.success ? "Item inválido." : parsed.error.issues[0].message)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_scope_items")
    .update({ descricao: parsed.data.descricao })
    .eq("id", itemId);

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=escopo&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=escopo`);
}

export async function deleteScopeItemAction(budgetId: string, formData: FormData) {
  const itemId = formData.get("item_id");
  if (typeof itemId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_scope_items").delete().eq("id", itemId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=escopo`);
}
