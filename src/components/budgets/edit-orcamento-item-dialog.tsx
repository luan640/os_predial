"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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

export function EditOrcamentoItemDialog({
  itemId,
  servico,
  quantidade,
  valorUnitario,
  updateAction,
}: {
  itemId: string;
  servico: string;
  quantidade: number;
  valorUnitario: number;
  updateAction: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" title="Editar" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar item do orçamento</DialogTitle>
          <DialogDescription>Atualize o serviço, a quantidade e o valor unitário.</DialogDescription>
        </DialogHeader>
        <form action={updateAction} className="flex flex-col gap-3">
          <input type="hidden" name="item_id" value={itemId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`servico-${itemId}`} className="text-xs">
              Serviço
            </Label>
            <Input id={`servico-${itemId}`} name="servico" defaultValue={servico} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`quantidade-${itemId}`} className="text-xs">
                Qtd.
              </Label>
              <Input
                id={`quantidade-${itemId}`}
                name="quantidade"
                type="number"
                step="0.01"
                min="0"
                defaultValue={quantidade}
                required
              />
            </div>
            <CurrencyInput
              id={`valor_unitario-${itemId}`}
              name="valor_unitario"
              label="Valor unit."
              labelClassName="text-xs"
              defaultValue={valorUnitario}
              required
            />
          </div>

          <Button type="submit" className="mt-2 w-fit self-end">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
