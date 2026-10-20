"use client";

import { Pencil, Trash2 } from "lucide-react";
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
import { deleteMaterialAction } from "@/lib/actions/materials";

export function MaterialRowActions({
  materialId,
  nome,
  onEdit,
}: {
  materialId: string;
  nome: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" title="Editar" onClick={onEdit}>
        <Pencil className="size-4" />
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
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <form action={deleteMaterialAction.bind(null, materialId)} className="contents">
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
