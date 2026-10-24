"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/lib/use-is-mobile";

export function AddOrcamentoItemDialog({
  createAction,
  defaultOpen,
  error,
}: {
  createAction: (formData: FormData) => void;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isMobile = useIsMobile();

  const form = (
    <form action={createAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="servico" className="text-xs">
          Serviço
        </Label>
        <Input id="servico" name="servico" placeholder="Ex: Pintura das paredes externas" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantidade" className="text-xs">
            Qtd.
          </Label>
          <Input id="quantidade" name="quantidade" type="number" step="0.01" min="0" defaultValue="1" required />
        </div>
        <CurrencyInput id="valor_unitario" name="valor_unitario" label="Valor unit." labelClassName="text-xs" required />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="mt-2 w-fit self-end">
        Adicionar
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="secondary" />}>
          <Plus className="size-4" />
          Adicionar item
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Adicionar item ao orçamento</SheetTitle>
            <SheetDescription>Serviço, quantidade e valor que vão para a seção 6 do relatório.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 pb-4">{form}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" />}>
        <Plus className="size-4" />
        Adicionar item
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar item ao orçamento</DialogTitle>
          <DialogDescription>Serviço, quantidade e valor que vão para a seção 6 do relatório.</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
