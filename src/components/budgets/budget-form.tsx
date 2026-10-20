"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DateRangeFields } from "@/components/budgets/date-range-fields";
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
import { PRAZO_UNIDADES } from "@/lib/prazo";

type BudgetFormValues = {
  client_id?: string;
  titulo?: string;
  numero?: string | null;
  valor_total?: number | null;
  data_inicio?: string | null;
  data_previsao_entrega?: string | null;
  prazo_qtd?: number | null;
  prazo_unidade?: string | null;
};

export function BudgetForm({
  action,
  clients,
  defaultValues,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => void;
  clients: { id: string; nome: string }[];
  defaultValues?: BudgetFormValues;
  submitLabel: string;
  error?: string;
}) {
  const clientItems = createComboboxItems(clients, {
    getValue: (client) => client.id,
    getLabel: (client) => client.nome,
  });

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          placeholder="Ex: Reforma do telhado"
          className="h-11 md:h-8"
          defaultValue={defaultValues?.titulo}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="client_id">Cliente</Label>
        <Combobox name="client_id" defaultValue={defaultValues?.client_id} items={clientItems}>
          <ComboboxInputGroup>
            <ComboboxInput id="client_id" placeholder="Buscar cliente..." className="h-11 md:h-8" />
            <ComboboxTrigger />
          </ComboboxInputGroup>
          <ComboboxContent>
            {(client: { id: string; nome: string }) => (
              <ComboboxItem key={client.id} value={client.id}>
                {client.nome}
              </ComboboxItem>
            )}
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="numero">Nº do orçamento</Label>
          <Input
            id="numero"
            name="numero"
            placeholder="91/2026"
            className="h-11 cursor-not-allowed bg-muted text-muted-foreground md:h-8"
            defaultValue={defaultValues?.numero ?? ""}
            readOnly
            tabIndex={-1}
          />
        </div>
        <CurrencyInput
          id="valor_total"
          name="valor_total"
          label="Valor do orçamento"
          inputClassName="h-11 md:h-8"
          defaultValue={defaultValues?.valor_total}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <DateRangeFields
          defaultDataInicio={defaultValues?.data_inicio ?? ""}
          defaultDataPrevisaoEntrega={defaultValues?.data_previsao_entrega ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prazo_qtd">Prazo estimado</Label>
        <div className="flex gap-2">
          <Input
            id="prazo_qtd"
            name="prazo_qtd"
            type="number"
            min="1"
            step="1"
            defaultValue={defaultValues?.prazo_qtd ?? 1}
            className="h-11 w-20 md:h-8"
          />
          <Select
            name="prazo_unidade"
            defaultValue={defaultValues?.prazo_unidade ?? "dia"}
            items={Object.fromEntries(PRAZO_UNIDADES.map((u) => [u.value, u.plural]))}
          >
            <SelectTrigger className="w-36 data-[size=default]:h-11 md:data-[size=default]:h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRAZO_UNIDADES.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.plural}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <SubmitButton className="mt-2 h-11 w-full sm:h-8 sm:w-fit sm:self-end">{submitLabel}</SubmitButton>
    </form>
  );
}
