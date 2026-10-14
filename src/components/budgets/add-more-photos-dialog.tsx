"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
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

export function AddMorePhotosDialog({
  groupId,
  titulo,
  addAction,
}: {
  groupId: string;
  titulo: string;
  addAction: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" title="Adicionar fotos" />}>
        <ImagePlus className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adicionar fotos</DialogTitle>
          <DialogDescription>Essas fotos entram no registro &quot;{titulo}&quot;.</DialogDescription>
        </DialogHeader>
        <form action={addAction} className="flex flex-col gap-3">
          <input type="hidden" name="group_id" value={groupId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`fotos-${groupId}`}>Fotos</Label>
            <Input id={`fotos-${groupId}`} name="fotos" type="file" accept="image/*" multiple required />
          </div>
          <SubmitButton className="mt-2 w-fit self-end" pendingLabel="Enviando...">
            Adicionar
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
