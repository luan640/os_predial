"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClientForm } from "@/components/clients/client-form";
import { ClientRowActions } from "@/components/clients/client-row-actions";
import { updateClientAction } from "@/lib/actions/clients";
import { cn } from "@/lib/utils";

type Client = {
  id: string;
  nome: string;
  tipo_pessoa: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  ativo: boolean;
};

export function ClientTableRow({
  client,
  defaultOpen,
  error,
}: {
  client: Client;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <>
      <TableRow
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("a, button, [role='button'], input, select, textarea")) return;
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") setOpen(true);
        }}
        className={cn("cursor-pointer outline-none focus-visible:bg-muted/50", !client.ativo && "opacity-60")}
      >
        <TableCell className="font-medium text-foreground">{client.nome}</TableCell>
        <TableCell>
          <Badge variant="secondary">{client.tipo_pessoa}</Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">{client.documento || "—"}</TableCell>
        <TableCell className="text-muted-foreground">{client.telefone || client.email || "—"}</TableCell>
        <TableCell>
          <Badge
            className={
              client.ativo
                ? "bg-[color-mix(in_oklch,var(--chart-2),transparent_85%)] text-[color:var(--chart-2)]"
                : "bg-muted text-muted-foreground"
            }
          >
            {client.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </TableCell>
        <TableCell>
          <ClientRowActions
            clientId={client.id}
            nome={client.nome}
            ativo={client.ativo}
            onEdit={() => setOpen(true)}
          />
        </TableCell>
      </TableRow>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar cliente</SheetTitle>
            <SheetDescription>Atualize os dados de {client.nome}.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ClientForm
              action={updateClientAction.bind(null, client.id)}
              defaultValues={client}
              submitLabel="Salvar alterações"
              error={error}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
