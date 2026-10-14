"use client";

import { useTransition } from "react";
import { Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toggleClientActiveAction, deleteClientAction } from "@/lib/actions/clients";

export function ClientRowActions({
  clientId,
  nome,
  ativo,
  onEdit,
}: {
  clientId: string;
  nome: string;
  ativo: boolean;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" title="Editar" onClick={onEdit}>
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        title={ativo ? "Inativar" : "Ativar"}
        className={ativo ? "text-muted-foreground" : "text-[color:var(--chart-2)]"}
        onClick={() => startTransition(() => toggleClientActiveAction(clientId, !ativo))}
      >
        {ativo ? <PowerOff className="size-4" /> : <Power className="size-4" />}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" />}
          title="Excluir"
        >
          <Trash2 className="size-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Clientes com orçamentos vinculados não podem ser excluídos — nesse
              caso, prefira inativar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <form action={deleteClientAction.bind(null, clientId)}>
              <AlertDialogAction type="submit" className="bg-destructive text-white hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
