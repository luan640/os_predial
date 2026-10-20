import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CompanyForm } from "@/components/company/company-form";
import { createClient } from "@/lib/supabase/server";
import { createCompany } from "@/lib/actions/company";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (company) {
    redirect("/orcamentos");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastre sua empresa</CardTitle>
        <CardDescription>
          Esses dados aparecem nos orçamentos e relatórios enviados aos seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyForm action={createCompany} submitLabel="Começar a usar" error={error} />
      </CardContent>
    </Card>
  );
}
