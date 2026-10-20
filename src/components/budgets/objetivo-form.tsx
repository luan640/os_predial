"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";

const MAX_LENGTH = 500;

export function ObjetivoForm({
  action,
  descricao,
  message,
}: {
  action: (formData: FormData) => void;
  descricao: string | null;
  message?: string;
}) {
  const [value, setValue] = useState(descricao ?? "");

  return (
    <form action={action} className="flex flex-col gap-3">
      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}
      <div className="flex flex-col gap-1">
        <Textarea
          name="descricao"
          rows={4}
          maxLength={MAX_LENGTH}
          placeholder="Ex: Corrigir os trechos danificados da parede e recuperar o acabamento da superfície."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="self-end text-xs text-muted-foreground">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <SubmitButton className="w-full">
        <Save className="size-4" />
        Salvar objetivo
      </SubmitButton>
    </form>
  );
}
