"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/ui/masked-input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CompanyWorker = { id: string; nome: string; funcao: string | null };

export function AllocateWorkerDialog({
  companyWorkers,
  allocateAction,
  defaultOpen,
  error,
}: {
  companyWorkers: CompanyWorker[];
  allocateAction: (formData: FormData) => void;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" />}>
        <Plus className="size-4" />
        Alocar operador
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alocar operador</DialogTitle>
          <DialogDescription>
            Escolha um operador já cadastrado ou crie um novo para alocar neste orçamento.
          </DialogDescription>
        </DialogHeader>
        <form action={allocateAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="worker_id" className="text-xs">Operador</Label>
            <Select
              name="worker_id"
              defaultValue={companyWorkers.length > 0 ? companyWorkers[0].id : "novo"}
              items={{
                ...Object.fromEntries(
                  companyWorkers.map((worker) => [
                    worker.id,
                    worker.funcao ? `${worker.nome} · ${worker.funcao}` : worker.nome,
                  ]),
                ),
                novo: "+ Novo operador",
              }}
            >
              <SelectTrigger id="worker_id" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companyWorkers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {worker.nome}
                    {worker.funcao ? ` · ${worker.funcao}` : ""}
                  </SelectItem>
                ))}
                <SelectItem value="novo">+ Novo operador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            Para cadastrar um novo operador, selecione &quot;+ Novo operador&quot; e preencha abaixo.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome" className="text-xs">Nome</Label>
              <Input id="nome" name="nome" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="funcao" className="text-xs">Função</Label>
              <Input id="funcao" name="funcao" placeholder="Pedreiro, eletricista..." />
            </div>
            <MaskedInput id="telefone" name="telefone" label="Telefone" labelClassName="text-xs" mask="telefone" />
            <CurrencyInput id="valor_diaria" name="valor_diaria" label="Diária" labelClassName="text-xs" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="mt-2 w-fit self-end">
            Alocar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
