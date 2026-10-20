"use client";

import { useActionState, useEffect, useRef } from "react";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ScopeFormState } from "@/lib/actions/scope";

export function AddScopeItemForm({
  action,
  error,
}: {
  action: (prevState: ScopeFormState, formData: FormData) => Promise<ScopeFormState>;
  error?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.error) {
      formRef.current?.reset();
      toast.success("Item do escopo adicionado.");
    }
  }, [state]);

  const displayError = state?.error ?? error;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex items-start gap-2 rounded-lg border border-dashed border-border p-4"
    >
      <ListChecks className="mt-1.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Input name="descricao" placeholder="Ex: Remoção das partes soltas ou danificadas da parede" required />
        {displayError && <p className="text-sm text-destructive">{displayError}</p>}
      </div>
      <SubmitButton variant="secondary" pendingLabel="Adicionando...">
        Adicionar
      </SubmitButton>
    </form>
  );
}
