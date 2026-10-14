"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
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
import { useIsMobile } from "@/lib/use-is-mobile";

type Material = {
  id: string;
  nome: string;
  unidade: string | null;
};

export function MaterialTableRow({
  material,
  defaultOpen,
  error,
}: {
  material: Material;
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isMobile = useIsMobile();

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
        className="cursor-pointer outline-none focus-visible:bg-muted/50"
      >
        <TableCell className="font-medium text-foreground">{material.nome}</TableCell>
        <TableCell className="text-muted-foreground">{material.unidade || "—"}</TableCell>
        <TableCell>
          <MaterialRowActions materialId={material.id} nome={material.nome} onEdit={() => setOpen(true)} />
        </TableCell>
      </TableRow>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="flex w-full flex-col sm:max-w-md data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl"
        >
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
