import Link from "next/link";
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
import { NewClientSheet } from "@/components/clients/new-client-sheet";
import { ClientTableRow } from "@/components/clients/client-table-row";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "ativos", label: "Ativos" },
  { value: "inativos", label: "Inativos" },
];

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; novo?: string; editar?: string; error?: string; message?: string }>;
}) {
  const { q, status, novo, editar, error, message } = await searchParams;
  const activeFilter = FILTERS.find((f) => f.value === status) ?? FILTERS[0];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await requireCompanyId(supabase, user.id);

  let query = supabase
    .from("clients")
    .select("id, nome, tipo_pessoa, documento, telefone, email, endereco, observacoes, ativo")
    .eq("company_id", companyId)
    .order("nome");

  if (activeFilter.value === "ativos") {
    query = query.eq("ativo", true);
  } else if (activeFilter.value === "inativos") {
    query = query.eq("ativo", false);
  }

  if (q) {
    query = query.ilike("nome", `%${q}%`);
  }

  const { data: clients } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as pessoas e empresas para quem você faz orçamentos.
          </p>
        </div>
        <NewClientSheet defaultOpen={novo === "1"} error={novo === "1" ? error : undefined} />
      </div>

      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 border-b border-border">
          {FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={filter.value === "todos" ? "/clientes" : `/clientes?status=${filter.value}`}
              className={cn(
                "border-b-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                activeFilter.value === filter.value
                  ? "border-primary text-foreground"
                  : "border-transparent",
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <form className="relative max-w-sm">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nome..."
            className="pl-9"
          />
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients && clients.length > 0 ? (
              clients.map((client) => (
                <ClientTableRow
                  key={client.id}
                  client={client}
                  defaultOpen={editar === client.id}
                  error={editar === client.id ? error : undefined}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  {q ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
