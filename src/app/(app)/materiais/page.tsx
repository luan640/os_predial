import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { requireCompanyId } from "@/lib/queries/company";
import { NewMaterialSheet } from "@/components/materials/new-material-sheet";
import { MaterialTableRow } from "@/components/materials/material-table-row";
import { MaterialCard } from "@/components/materials/material-card";

export default async function MateriaisPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; novo?: string; editar?: string; error?: string; message?: string }>;
}) {
  const { q, novo, editar, error, message } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  let query = supabase
    .from("materials")
    .select("id, nome, unidade")
    .eq("company_id", companyId)
    .order("nome");

  if (q) {
    query = query.ilike("nome", `%${q}%`);
  }

  const { data: materials } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Materiais</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre os materiais usados nas suas obras para escolher rapidamente ao montar um orçamento.
          </p>
        </div>
        <NewMaterialSheet defaultOpen={novo === "1"} error={novo === "1" ? error : undefined} />
      </div>

      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}

      <form className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={q ?? ""} placeholder="Buscar por nome..." className="pl-9" />
      </form>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials && materials.length > 0 ? (
              materials.map((material) => (
                <MaterialTableRow
                  key={material.id}
                  material={material}
                  defaultOpen={editar === material.id}
                  error={editar === material.id ? error : undefined}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  {q ? "Nenhum material encontrado." : "Nenhum material cadastrado ainda."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {materials && materials.length > 0 ? (
          materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              defaultOpen={editar === material.id}
              error={editar === material.id ? error : undefined}
            />
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
            {q ? "Nenhum material encontrado." : "Nenhum material cadastrado ainda."}
          </div>
        )}
      </div>
    </div>
  );
}
