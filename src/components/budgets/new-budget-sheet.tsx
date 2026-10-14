"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BudgetForm } from "@/components/budgets/budget-form";
import { createBudgetAction } from "@/lib/actions/budgets";
import { useIsMobile } from "@/lib/use-is-mobile";

export function NewBudgetSheet({
  clients,
  defaultNumero,
  defaultOpen,
  error,
}: {
  clients: { id: string; nome: string }[];
  defaultNumero?: string;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="ml-auto" />}>
        <Plus className="size-4" />
        Novo orçamento
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex w-full flex-col sm:max-w-md data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle>Novo orçamento</SheetTitle>
          <SheetDescription>Crie um orçamento vinculado a um cliente.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {clients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Cadastre um cliente antes de criar um orçamento.{" "}
              <Link href="/clientes" className="font-medium text-foreground underline underline-offset-4">
                Ir para Clientes
              </Link>
            </p>
          ) : (
            <BudgetForm
              action={createBudgetAction}
              clients={clients}
              defaultValues={{ numero: defaultNumero }}
              submitLabel="Criar orçamento"
              error={error}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
