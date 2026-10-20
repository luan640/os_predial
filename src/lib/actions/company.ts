"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isValidCNPJ, isValidTelefone } from "@/lib/validators";

const companySchema = z
  .object({
    nome: z.string().trim().min(2, "Informe o nome da empresa."),
    cnpj: z.string().trim().optional(),
    telefone: z.string().trim().optional(),
    email: z.string().trim().email("Email inválido.").optional().or(z.literal("")),
    endereco: z.string().trim().optional(),
    cidade: z.string().trim().optional(),
    responsavel_tecnico_nome: z.string().trim().optional(),
    responsavel_tecnico_cargo: z.string().trim().optional(),
    responsavel_tecnico_telefone: z.string().trim().optional(),
    proximo_numero_orcamento: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => !data.cnpj || isValidCNPJ(data.cnpj), {
    message: "CNPJ inválido.",
    path: ["cnpj"],
  })
  .refine((data) => !data.telefone || isValidTelefone(data.telefone), {
    message: "Telefone inválido.",
    path: ["telefone"],
  })
  .refine((data) => !data.responsavel_tecnico_telefone || isValidTelefone(data.responsavel_tecnico_telefone), {
    message: "Telefone do responsável técnico inválido.",
    path: ["responsavel_tecnico_telefone"],
  });

function parseCompanyForm(formData: FormData) {
  return companySchema.safeParse({
    nome: formData.get("nome"),
    cnpj: formData.get("cnpj") || undefined,
    telefone: formData.get("telefone") || undefined,
    email: formData.get("email") || "",
    endereco: formData.get("endereco") || undefined,
    cidade: formData.get("cidade") || undefined,
    responsavel_tecnico_nome: formData.get("responsavel_tecnico_nome") || undefined,
    responsavel_tecnico_cargo: formData.get("responsavel_tecnico_cargo") || undefined,
    responsavel_tecnico_telefone: formData.get("responsavel_tecnico_telefone") || undefined,
    proximo_numero_orcamento: formData.get("proximo_numero_orcamento") || undefined,
  });
}

export async function createCompany(formData: FormData) {
  const parsed = parseCompanyForm(formData);

  if (!parsed.success) {
    redirect(`/onboarding?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("companies").insert({
    owner_id: user.id,
    nome: parsed.data.nome,
    cnpj: parsed.data.cnpj || null,
    telefone: parsed.data.telefone || null,
    email: parsed.data.email || null,
    endereco: parsed.data.endereco || null,
    cidade: parsed.data.cidade || null,
    responsavel_tecnico_nome: parsed.data.responsavel_tecnico_nome || null,
    responsavel_tecnico_cargo: parsed.data.responsavel_tecnico_cargo || null,
    responsavel_tecnico_telefone: parsed.data.responsavel_tecnico_telefone || null,
    proximo_numero_orcamento: parsed.data.proximo_numero_orcamento || null,
  });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/orcamentos");
}

export async function updateCompany(formData: FormData) {
  const parsed = parseCompanyForm(formData);

  if (!parsed.success) {
    redirect(`/configuracoes?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

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
      nome: parsed.data.nome,
      cnpj: parsed.data.cnpj || null,
      telefone: parsed.data.telefone || null,
      email: parsed.data.email || null,
      endereco: parsed.data.endereco || null,
      cidade: parsed.data.cidade || null,
      responsavel_tecnico_nome: parsed.data.responsavel_tecnico_nome || null,
      responsavel_tecnico_cargo: parsed.data.responsavel_tecnico_cargo || null,
      responsavel_tecnico_telefone: parsed.data.responsavel_tecnico_telefone || null,
      proximo_numero_orcamento: parsed.data.proximo_numero_orcamento || null,
    })
    .eq("owner_id", user.id);

  if (error) {
    redirect(`/configuracoes?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/configuracoes?message=Dados da empresa atualizados.");
}
