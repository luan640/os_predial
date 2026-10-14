"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MaterialForm } from "@/components/materials/material-form";
import { MaterialRowActions } from "@/components/materials/material-row-actions";
import { updateMaterialAction } from "@/lib/actions/materials";

type Material = {
  id: string;
  nome: string;
  unidade: string | null;
};

export function MaterialCard({
  material,
  defaultOpen,
  error,
}: {
  material: Material;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{material.nome}</span>
          <span className="text-sm text-muted-foreground">{material.unidade || "Sem unidade"}</span>
        </div>
        <MaterialRowActions materialId={material.id} nome={material.nome} onEdit={() => setOpen(true)} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="flex max-h-[85vh] flex-col rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Editar material</SheetTitle>
            <SheetDescription>Atualize os dados de {material.nome}.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <MaterialForm
              action={updateMaterialAction.bind(null, material.id)}
              defaultValues={material}
              submitLabel="Salvar alterações"
              error={error}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
