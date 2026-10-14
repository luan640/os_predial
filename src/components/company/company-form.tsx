import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MaskedInput } from "@/components/ui/masked-input";

type CompanyFormValues = {
  nome?: string;
  cnpj?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  responsavel_tecnico_nome?: string | null;
  responsavel_tecnico_cargo?: string | null;
  responsavel_tecnico_telefone?: string | null;
  proximo_numero_orcamento?: number | null;
};

export function CompanyForm({
  action,
  defaultValues,
  submitLabel,
  error,
  message,
}: {
  action: (formData: FormData) => void;
  defaultValues?: CompanyFormValues;
  submitLabel: string;
  error?: string;
  message?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome da empresa</Label>
        <Input
          id="nome"
          name="nome"
          placeholder="Construtora Silva Ltda."
          defaultValue={defaultValues?.nome}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <MaskedInput
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0001-00"
          defaultValue={defaultValues?.cnpj ?? ""}
          mask="cnpj"
        />
        <MaskedInput
          id="telefone"
          name="telefone"
          label="Telefone"
          placeholder="(11) 99999-9999"
          defaultValue={defaultValues?.telefone ?? ""}
          mask="telefone"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email de contato</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="contato@empresa.com"
          defaultValue={defaultValues?.email ?? ""}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            name="endereco"
            placeholder="Rua, número - UF"
            defaultValue={defaultValues?.endereco ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            name="cidade"
            placeholder="Fortaleza"
            defaultValue={defaultValues?.cidade ?? ""}
          />
        </div>
      </div>

      <Separator className="my-1" />

      <div>
        <p className="text-sm font-medium text-foreground">Responsável técnico</p>
        <p className="text-xs text-muted-foreground">Aparece na assinatura dos relatórios enviados aos clientes.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="responsavel_tecnico_nome">Nome</Label>
        <Input
          id="responsavel_tecnico_nome"
          name="responsavel_tecnico_nome"
          placeholder="Ex: Edenilson Castro"
          defaultValue={defaultValues?.responsavel_tecnico_nome ?? ""}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="responsavel_tecnico_cargo">Cargo</Label>
          <Input
            id="responsavel_tecnico_cargo"
            name="responsavel_tecnico_cargo"
            placeholder="Ex: Consultor Técnico"
            defaultValue={defaultValues?.responsavel_tecnico_cargo ?? ""}
          />
        </div>
        <MaskedInput
          id="responsavel_tecnico_telefone"
          name="responsavel_tecnico_telefone"
          label="Telefone"
          defaultValue={defaultValues?.responsavel_tecnico_telefone ?? ""}
          mask="telefone"
        />
      </div>

      <Separator className="my-1" />

      <div>
        <p className="text-sm font-medium text-foreground">Numeração de orçamentos</p>
        <p className="text-xs text-muted-foreground">
          Se você já numera orçamentos manualmente, informe aqui o próximo número a ser usado. O
          sistema nunca repete: usa o maior entre esse valor e o que já foi gerado por aqui.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="proximo_numero_orcamento">Próximo número (ano atual)</Label>
        <Input
          id="proximo_numero_orcamento"
          name="proximo_numero_orcamento"
          type="number"
          min="1"
          step="1"
          placeholder="Ex: 92"
          className="w-32"
          defaultValue={defaultValues?.proximo_numero_orcamento ?? ""}
        />
      </div>

      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="mt-2 w-fit self-end">
        {submitLabel}
      </Button>
    </form>
  );
}
