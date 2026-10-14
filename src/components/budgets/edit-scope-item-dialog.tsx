"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditScopeItemDialog({
  itemId,
  descricao,
  updateAction,
}: {
  itemId: string;
  descricao: string;
  updateAction: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" title="Editar" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar item do escopo</DialogTitle>
          <DialogDescription>Atualize a descrição desse item.</DialogDescription>
        </DialogHeader>
        <form action={updateAction} className="flex flex-col gap-3">
          <input type="hidden" name="item_id" value={itemId} />
          <Textarea name="descricao" rows={3} defaultValue={descricao} required />
          <Button type="submit" className="w-fit self-end">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
