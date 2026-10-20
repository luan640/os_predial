"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { MoreVertical, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BudgetActionsMenu({
  deleteAction,
  cancelAction,
}: {
  deleteAction: (formData: FormData) => void;
  cancelAction: (formData: FormData) => void | Promise<void>;
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  function handleConfirmCancel() {
    const formData = new FormData();
    formData.set("status", "cancelado");
    const currentTab = searchParams.get("tab");
    if (currentTab) formData.set("tab", currentTab);
    startTransition(() => {
      cancelAction(formData);
    });
    setConfirmCancelOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setConfirmCancelOpen(true)}>
            <Ban className="size-4" />
            Cancelar orçamento
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 className="size-4" />
            Excluir orçamento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar orçamento?</AlertDialogTitle>
            <AlertDialogDescription>
              O orçamento sai do fluxo normal e fica marcado como cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleConfirmCancel}>
              Cancelar orçamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove o orçamento, itens, fotos e relatórios vinculados. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <form action={deleteAction} className="contents">
              <AlertDialogAction type="submit" className="bg-destructive text-white hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
