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

function normalizeMaterialKey(nome: string, unidade: string | null | undefined) {
  return `${nome.trim().toLowerCase()}__${(unidade ?? "").trim().toLowerCase()}`;
}

async function hasDuplicateMaterial(
  supabase: Awaited<ReturnType<typeof createClient>>,
  companyId: string,
  nome: string,
  unidade: string | null,
  excludeId?: string,
) {
  const { data } = await supabase.from("materials").select("id, nome, unidade").eq("company_id", companyId);
  const key = normalizeMaterialKey(nome, unidade);
  return (data ?? []).some((m) => m.id !== excludeId && normalizeMaterialKey(m.nome, m.unidade) === key);
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
  const unidade = parsed.data.unidade || null;

  if (await hasDuplicateMaterial(supabase, companyId, parsed.data.nome, unidade)) {
    redirect(`/materiais?novo=1&error=${encodeURIComponent("Já existe um material com esse nome e unidade.")}`);
  }

  const { error } = await supabase.from("materials").insert({
    company_id: companyId,
    nome: parsed.data.nome,
    unidade,
  });

  if (error) {
    redirect(`/materiais?novo=1&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/materiais");
  redirect(`/materiais?message=${encodeURIComponent("Material criado.")}`);
}

export type CreateMaterialInlineState = {
  material?: { id: string; nome: string; unidade: string | null };
  error?: string;
} | null;

export async function createMaterialInlineAction(
  _prevState: CreateMaterialInlineState,
  formData: FormData,
): Promise<CreateMaterialInlineState> {
  const parsed = parseMaterialForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Atualize a página e tente novamente." };

  const companyId = await requireCompanyId(supabase, user.id);
  const unidade = parsed.data.unidade || null;

  if (await hasDuplicateMaterial(supabase, companyId, parsed.data.nome, unidade)) {
    return { error: "Já existe um material com esse nome e unidade." };
  }

  const { data, error } = await supabase
    .from("materials")
    .insert({
      company_id: companyId,
      nome: parsed.data.nome,
      unidade,
    })
    .select("id, nome, unidade")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Erro ao criar material." };
  }

  revalidatePath("/materiais");
  return { material: data };
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

  const companyId = await requireCompanyId(supabase, user.id);
  const unidade = parsed.data.unidade || null;

  if (await hasDuplicateMaterial(supabase, companyId, parsed.data.nome, unidade, materialId)) {
    redirect(`/materiais?editar=${materialId}&error=${encodeURIComponent("Já existe um material com esse nome e unidade.")}`);
  }

  const { error } = await supabase
    .from("materials")
    .update({
      nome: parsed.data.nome,
      unidade,
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
  redirect(`/materiais?message=${encodeURIComponent("Material excluído.")}`);
}
