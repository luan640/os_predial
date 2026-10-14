export const PRAZO_UNIDADES = [
  { value: "hora", singular: "hora", plural: "horas" },
  { value: "dia", singular: "dia", plural: "dias" },
  { value: "semana", singular: "semana", plural: "semanas" },
  { value: "mes", singular: "mês", plural: "meses" },
] as const;

export function formatPrazoQuantidade(quantidade: number, unidade: string) {
  const config = PRAZO_UNIDADES.find((u) => u.value === unidade) ?? PRAZO_UNIDADES[0];
  const label = quantidade === 1 ? config.singular : config.plural;
  return `${quantidade} ${label}`;
}

export function applyPrazoTemplate(template: string, quantidade: number, unidade: string) {
  const texto = formatPrazoQuantidade(quantidade, unidade);
  return template.includes("[QTD]") ? template.replace("[QTD]", texto) : `${template} ${texto}`;
}
