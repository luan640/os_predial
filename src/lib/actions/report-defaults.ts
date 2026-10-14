"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateReportDefaultsAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("companies")
    .update({
      relatorio_seguranca_padrao: (formData.get("relatorio_seguranca_padrao") as string)?.trim() || null,
      relatorio_prazo_padrao: (formData.get("relatorio_prazo_padrao") as string)?.trim() || null,
      relatorio_condicoes_pagamento_padrao:
        (formData.get("relatorio_condicoes_pagamento_padrao") as string)?.trim() || null,
      relatorio_consideracoes_finais_padrao:
        (formData.get("relatorio_consideracoes_finais_padrao") as string)?.trim() || null,
    })
    .eq("owner_id", user.id);

  if (error) {
    redirect(`/configuracoes?tab=relatorio&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/configuracoes?tab=relatorio&message=${encodeURIComponent("Modelo de relatório atualizado.")}`);
}
