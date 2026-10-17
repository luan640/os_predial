import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateReportDefaultsAction } from "@/lib/actions/report-defaults";

type ReportDefaultsValues = {
  relatorio_seguranca_padrao?: string | null;
  relatorio_prazo_padrao?: string | null;
  relatorio_condicoes_pagamento_padrao?: string | null;
  relatorio_consideracoes_finais_padrao?: string | null;
  relatorio_validade_padrao?: string | null;
};

export function ReportDefaultsForm({
  defaultValues,
  error,
  message,
}: {
  defaultValues?: ReportDefaultsValues;
  error?: string;
  message?: string;
}) {
  return (
    <form action={updateReportDefaultsAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relatorio_seguranca_padrao">Segurança</Label>
        <Textarea
          id="relatorio_seguranca_padrao"
          name="relatorio_seguranca_padrao"
          rows={3}
          placeholder="Ex: Serviços executados por profissionais qualificados, com uso de EPIs e EPCs necessários."
          defaultValue={defaultValues?.relatorio_seguranca_padrao ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relatorio_prazo_padrao">Prazo</Label>
        <Textarea
          id="relatorio_prazo_padrao"
          name="relatorio_prazo_padrao"
          rows={2}
          placeholder="Ex: Prazo estimado de até [QTD], podendo variar conforme as condições encontradas no local."
          defaultValue={defaultValues?.relatorio_prazo_padrao ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Use <span className="font-mono">[QTD]</span> onde deve entrar a quantidade (ex: &quot;3 dias&quot;) —
          no relatório, você escolhe só o número e a unidade.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relatorio_condicoes_pagamento_padrao">Condições de pagamento</Label>
        <Textarea
          id="relatorio_condicoes_pagamento_padrao"
          name="relatorio_condicoes_pagamento_padrao"
          rows={3}
          placeholder="Ex: Pagamento de 100% do valor após a execução do serviço e emissão da nota fiscal."
          defaultValue={defaultValues?.relatorio_condicoes_pagamento_padrao ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relatorio_consideracoes_finais_padrao">Considerações finais</Label>
        <Textarea
          id="relatorio_consideracoes_finais_padrao"
          name="relatorio_consideracoes_finais_padrao"
          rows={3}
          placeholder="Ex: Ao término dos serviços, o local será entregue reparado e com acabamento adequado."
          defaultValue={defaultValues?.relatorio_consideracoes_finais_padrao ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relatorio_validade_padrao">Validade da proposta</Label>
        <Textarea
          id="relatorio_validade_padrao"
          name="relatorio_validade_padrao"
          rows={2}
          placeholder="Ex: Esta proposta tem validade de 15 (quinze) dias, contados a partir da data de envio."
          defaultValue={defaultValues?.relatorio_validade_padrao ?? ""}
        />
      </div>

      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="mt-2 w-fit self-end">
        Salvar modelo
      </Button>
    </form>
  );
}
