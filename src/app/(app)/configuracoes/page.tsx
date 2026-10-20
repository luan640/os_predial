import { redirect } from "next/navigation";
import { Building2, FileText, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyForm } from "@/components/company/company-form";
import { ReportDefaultsForm } from "@/components/company/report-defaults-form";
import { ChangePasswordForm } from "@/components/company/change-password-form";
import { createClient } from "@/lib/supabase/server";
import { updateCompany } from "@/lib/actions/company";

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string; message?: string }>;
}) {
  const { tab, error, message } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!company) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Dados da sua empresa e modelos padrão.</p>
      </div>

      <Tabs defaultValue={tab ?? "empresa"} className="items-center">
        <TabsList variant="line">
          <TabsTrigger value="empresa">
            <Building2 className="size-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="relatorio">
            <FileText className="size-4" />
            Modelo de relatório
          </TabsTrigger>
          <TabsTrigger value="conta">
            <KeyRound className="size-4" />
            Conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="mt-4 w-full">
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-base">Empresa</CardTitle>
              <CardDescription>
                Esses dados aparecem nos orçamentos e relatórios enviados aos seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyForm
                action={updateCompany}
                defaultValues={company}
                submitLabel="Salvar alterações"
                error={!tab || tab === "empresa" ? error : undefined}
                message={!tab || tab === "empresa" ? message : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorio" className="mt-4 w-full">
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-base">Tópicos padrão do relatório</CardTitle>
              <CardDescription>
                Textos que costumam se repetir em todo relatório. Eles já vêm preenchidos ao criar um
                novo relatório — e continuam editáveis ali se precisar ajustar algo pontual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportDefaultsForm
                defaultValues={company}
                error={tab === "relatorio" ? error : undefined}
                message={tab === "relatorio" ? message : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conta" className="mt-4 w-full">
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-base">Alterar senha</CardTitle>
              <CardDescription>Informe sua senha atual para definir uma nova.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm
                error={tab === "conta" ? error : undefined}
                message={tab === "conta" ? message : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
