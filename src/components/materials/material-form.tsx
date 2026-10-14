"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MaterialFormValues = {
  nome?: string;
  unidade?: string | null;
};

export function MaterialForm({
  action,
  defaultValues,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => void;
  defaultValues?: MaterialFormValues;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome do material</Label>
        <Input
          id="nome"
          name="nome"
          placeholder="Ex: Cimento CP-II"
          defaultValue={defaultValues?.nome}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="unidade">Unidade</Label>
        <Input
          id="unidade"
          name="unidade"
          placeholder="Ex: saco, m², kg, un"
          defaultValue={defaultValues?.unidade ?? ""}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="mt-2 w-fit self-end">
        {submitLabel}
      </Button>
    </form>
  );
}
