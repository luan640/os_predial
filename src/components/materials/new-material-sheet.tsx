"use client";

import { useState } from "react";
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
import { MaterialForm } from "@/components/materials/material-form";
import { createMaterialAction } from "@/lib/actions/materials";
import { useIsMobile } from "@/lib/use-is-mobile";

export function NewMaterialSheet({
  defaultOpen,
  error,
}: {
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="ml-auto" />}>
        <Plus className="size-4" />
        Novo material
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex w-full flex-col sm:max-w-md data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle>Novo material</SheetTitle>
          <SheetDescription>Cadastre um material para usar nos itens de orçamento.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <MaterialForm action={createMaterialAction} submitLabel="Salvar material" error={error} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
