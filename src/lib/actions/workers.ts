"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const allocationSchema = z.object({
  worker_id: z.string().trim().min(1),
  nome: z.string().trim().optional(),
  funcao: z.string().trim().optional(),
  telefone: z.string().trim().optional(),
  valor_diaria: z.coerce.number().min(0).optional(),
});

export async function allocateWorkerAction(budgetId: string, formData: FormData) {
  const parsed = allocationSchema.safeParse({
    worker_id: formData.get("worker_id"),
    nome: formData.get("nome") || undefined,
    funcao: formData.get("funcao") || undefined,
    telefone: formData.get("telefone") || undefined,
    valor_diaria: formData.get("valor_diaria") || undefined,
  });

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?tab=equipe&error=${encodeURIComponent("Preencha os dados do operador.")}`);
  }

  const supabase = await createClient();

  let workerId = parsed.data.worker_id;

  if (workerId === "novo") {
    if (!parsed.data.nome) {
      redirect(`/orcamentos/${budgetId}?tab=equipe&error=${encodeURIComponent("Informe o nome do operador.")}`);
    }

    const { data: budget } = await supabase
      .from("budgets")
      .select("company_id")
      .eq("id", budgetId)
      .single();

    if (!budget) redirect(`/orcamentos/${budgetId}?tab=equipe`);

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .insert({
        company_id: budget.company_id,
        nome: parsed.data.nome,
        funcao: parsed.data.funcao || null,
        telefone: parsed.data.telefone || null,
        valor_diaria: parsed.data.valor_diaria || null,
      })
      .select("id")
      .single();

    if (workerError || !worker) {
      redirect(`/orcamentos/${budgetId}?tab=equipe&error=${encodeURIComponent(workerError?.message ?? "Erro ao criar operador.")}`);
    }

    workerId = worker.id;
  }

  const { error } = await supabase.from("budget_workers").insert({
    budget_id: budgetId,
    worker_id: workerId,
  });

  if (error) {
    redirect(`/orcamentos/${budgetId}?tab=equipe&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=equipe`);
}

export async function deallocateWorkerAction(budgetId: string, formData: FormData) {
  const allocationId = formData.get("allocation_id");
  if (typeof allocationId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_workers").delete().eq("id", allocationId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=equipe`);
}
