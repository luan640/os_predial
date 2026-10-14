"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";

const materialSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do material."),
  unidade: z.string().trim().optional(),
});

function parseMaterialForm(formData: FormData) {
  return materialSchema.safeParse({
    nome: formData.get("nome"),
    unidade: formData.get("unidade") || undefined,
  });
}

export async function createMaterialAction(formData: FormData) {
  const parsed = parseMaterialForm(formData);

  if (!parsed.success) {
    redirect(`/materiais?novo=1&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  const { error } = await supabase.from("materials").insert({
    company_id: companyId,
    nome: parsed.data.nome,
    unidade: parsed.data.unidade || null,
  });

  if (error) {
    redirect(`/materiais?novo=1&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/materiais");
  redirect(`/materiais?message=${encodeURIComponent("Material criado.")}`);
}

export async function updateMaterialAction(materialId: string, formData: FormData) {
  const parsed = parseMaterialForm(formData);

  if (!parsed.success) {
    redirect(`/materiais?editar=${materialId}&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("materials")
    .update({
      nome: parsed.data.nome,
      unidade: parsed.data.unidade || null,
    })
    .eq("id", materialId);

  if (error) {
    redirect(`/materiais?editar=${materialId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/materiais");
  redirect(`/materiais?message=${encodeURIComponent("Material atualizado.")}`);
}

export async function deleteMaterialAction(materialId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("materials").delete().eq("id", materialId);

  if (error) {
    redirect(`/materiais?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/materiais");
  redirect("/materiais");
}
