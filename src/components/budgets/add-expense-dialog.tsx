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

export function AddExpenseDialog({
  createAction,
  defaultOpen,
  error,
}: {
  createAction: (formData: FormData) => void;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" />}>
        <Plus className="size-4" />
        Lançar gasto
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lançar gasto</DialogTitle>
          <DialogDescription>Registre um custo real desse orçamento.</DialogDescription>
        </DialogHeader>
        <form action={createAction} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="data" className="text-xs">Data</Label>
              <Input id="data" name="data" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoria" className="text-xs">Categoria</Label>
              <Input id="categoria" name="categoria" placeholder="Material, transporte..." />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao_gasto" className="text-xs">Descrição</Label>
            <Input id="descricao_gasto" name="descricao" placeholder="Opcional" />
          </div>

          <CurrencyInput id="valor" name="valor" label="Valor" labelClassName="text-xs" required />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="mt-2 w-fit self-end">
            Lançar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
