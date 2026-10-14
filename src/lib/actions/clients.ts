"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { isValidDocumento, isValidTelefone } from "@/lib/validators";

const clientSchema = z
  .object({
    nome: z.string().trim().min(2, "Informe o nome do cliente."),
    tipo_pessoa: z.enum(["PF", "PJ"]),
    documento: z.string().trim().optional(),
    contato_nome: z.string().trim().optional(),
    telefone: z.string().trim().optional(),
    email: z.string().trim().email("Email inválido.").optional().or(z.literal("")),
    endereco: z.string().trim().optional(),
    observacoes: z.string().trim().optional(),
  })
  .refine((data) => !data.documento || isValidDocumento(data.documento, data.tipo_pessoa), {
    message: "CPF/CNPJ inválido.",
    path: ["documento"],
  })
  .refine((data) => !data.telefone || isValidTelefone(data.telefone), {
    message: "Telefone inválido.",
    path: ["telefone"],
  });

function parseClientForm(formData: FormData) {
  return clientSchema.safeParse({
    nome: formData.get("nome"),
    tipo_pessoa: formData.get("tipo_pessoa") || "PF",
    documento: formData.get("documento") || undefined,
    contato_nome: formData.get("contato_nome") || undefined,
    telefone: formData.get("telefone") || undefined,
    email: formData.get("email") || "",
    endereco: formData.get("endereco") || undefined,
    observacoes: formData.get("observacoes") || undefined,
  });
}

export async function createClientAction(formData: FormData) {
  const parsed = parseClientForm(formData);

  if (!parsed.success) {
    redirect(`/clientes?novo=1&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  const { data, error } = await supabase
    .from("clients")
    .insert({
      company_id: companyId,
      nome: parsed.data.nome,
      tipo_pessoa: parsed.data.tipo_pessoa,
      documento: parsed.data.documento || null,
      contato_nome: parsed.data.contato_nome || null,
      telefone: parsed.data.telefone || null,
      email: parsed.data.email || null,
      endereco: parsed.data.endereco || null,
      observacoes: parsed.data.observacoes || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/clientes?novo=1&error=${encodeURIComponent(error?.message ?? "Erro ao criar cliente.")}`);
  }

  revalidatePath("/clientes");
  redirect(`/clientes?message=${encodeURIComponent("Cliente criado.")}`);
}

export async function updateClientAction(clientId: string, formData: FormData) {
  const parsed = parseClientForm(formData);

  if (!parsed.success) {
    redirect(`/clientes?editar=${clientId}&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("clients")
    .update({
      nome: parsed.data.nome,
      tipo_pessoa: parsed.data.tipo_pessoa,
      documento: parsed.data.documento || null,
      contato_nome: parsed.data.contato_nome || null,
      telefone: parsed.data.telefone || null,
      email: parsed.data.email || null,
      endereco: parsed.data.endereco || null,
      observacoes: parsed.data.observacoes || null,
    })
    .eq("id", clientId);

  if (error) {
    redirect(`/clientes?editar=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clientes");
  redirect(`/clientes?message=${encodeURIComponent("Cliente atualizado.")}`);
}

export async function toggleClientActiveAction(clientId: string, nextAtivo: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("clients").update({ ativo: nextAtivo }).eq("id", clientId);

  revalidatePath("/clientes");
}

export async function deleteClientAction(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("clients").delete().eq("id", clientId);

  if (error) {
    redirect(`/clientes?editar=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}
