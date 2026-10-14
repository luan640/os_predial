import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MaskedInput } from "@/components/ui/masked-input";
import { PersonTypeFields } from "@/components/clients/person-type-fields";

type ClientFormValues = {
  nome?: string;
  tipo_pessoa?: string;
  documento?: string | null;
  contato_nome?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
};

export function ClientForm({
  action,
  defaultValues,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ClientFormValues;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" defaultValue={defaultValues?.nome} required />
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <PersonTypeFields
          defaultTipoPessoa={defaultValues?.tipo_pessoa}
          defaultDocumento={defaultValues?.documento ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contato_nome">Pessoa de contato</Label>
        <Input
          id="contato_nome"
          name="contato_nome"
          placeholder="Nome de quem recebe os relatórios"
          defaultValue={defaultValues?.contato_nome ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <MaskedInput
          id="telefone"
          name="telefone"
          label="Telefone"
          defaultValue={defaultValues?.telefone ?? ""}
          mask="telefone"
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input id="endereco" name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea id="observacoes" name="observacoes" defaultValue={defaultValues?.observacoes ?? ""} rows={3} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="mt-2 w-fit self-end">
        {submitLabel}
      </Button>
    </form>
  );
}
