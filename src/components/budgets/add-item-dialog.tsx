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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  createComboboxItems,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
} from "@/components/ui/combobox";
import { BUDGET_ITEM_TYPES } from "@/lib/budget-status";
import { useIsMobile } from "@/lib/use-is-mobile";

type Material = {
  id: string;
  nome: string;
  unidade: string | null;
};

export function AddItemDialog({
  createAction,
  materials,
  defaultOpen,
  error,
}: {
  createAction: (formData: FormData) => void;
  materials: Material[];
  defaultOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const isMobile = useIsMobile();
  const [tipo, setTipo] = useState("material");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("");

  const materialItems = createComboboxItems(materials, {
    getValue: (material) => material.id,
    getLabel: (material) => material.nome,
  });

  function handleMaterialSelect(materialId: string | null) {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setDescricao(material.nome);
      setUnidade(material.unidade ?? "");
    }
  }

  const showCatalog = tipo === "material" && materials.length > 0;

  const form = (
    <form action={createAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tipo" className="text-xs">Tipo</Label>
        <Select
          name="tipo"
          value={tipo}
          onValueChange={(value) => setTipo(value as string)}
          items={Object.fromEntries(BUDGET_ITEM_TYPES.map((t) => [t.value, t.label]))}
        >
          <SelectTrigger id="tipo" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_ITEM_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCatalog && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="material_catalogo" className="text-xs">Material cadastrado</Label>
          <Combobox
            items={materialItems}
            required
            onValueChange={(value) => handleMaterialSelect(value as string | null)}
          >
            <ComboboxInputGroup>
              <ComboboxInput id="material_catalogo" placeholder="Buscar material..." />
              <ComboboxTrigger />
            </ComboboxInputGroup>
            <ComboboxContent>
              {(material: Material) => (
                <ComboboxItem key={material.id} value={material.id}>
                  {material.nome}
                </ComboboxItem>
              )}
            </ComboboxContent>
          </Combobox>
          <input type="hidden" name="descricao" value={descricao} />
        </div>
      )}

      {!showCatalog && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="descricao" className="text-xs">Descrição</Label>
          <Input
            id="descricao"
            name="descricao"
            placeholder="Ex: Cimento CP-II"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantidade" className="text-xs">Qtd.</Label>
          <Input id="quantidade" name="quantidade" type="number" step="0.01" min="0" defaultValue="1" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="unidade" className="text-xs">Unidade</Label>
          <Input
            id="unidade"
            name="unidade"
            placeholder="un, m², sc"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          />
        </div>
      </div>

      <CurrencyInput id="valor_unitario" name="valor_unitario" label="Valor unit." labelClassName="text-xs" required />

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
            <SheetTitle>Adicionar item</SheetTitle>
            <SheetDescription>Material, mão de obra ou serviço lançado neste orçamento.</SheetDescription>
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
          <DialogTitle>Adicionar item</DialogTitle>
          <DialogDescription>Material, mão de obra ou serviço lançado neste orçamento.</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
