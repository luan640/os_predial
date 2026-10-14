"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddPhotoGroupDialog({
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
        Novo registro de fotos
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo registro de fotos</DialogTitle>
          <DialogDescription>
            Ex: &quot;Parede da direita&quot;. Você pode adicionar mais fotos a este registro depois.
          </DialogDescription>
        </DialogHeader>
        <form action={createAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="titulo_foto">Título</Label>
            <Input id="titulo_foto" name="titulo" placeholder="Ex: Parede da direita" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fotos">Fotos</Label>
            <Input id="fotos" name="fotos" type="file" accept="image/*" multiple required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <SubmitButton className="mt-2 w-fit self-end" pendingLabel="Criando...">
            Criar registro
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
