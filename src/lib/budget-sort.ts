export const BUDGET_SORT_OPTIONS = [
  { value: "recent", label: "Mais recente", column: "created_at", ascending: false },
  { value: "oldest", label: "Mais antigo", column: "created_at", ascending: true },
  { value: "updated", label: "Última atualização", column: "updated_at", ascending: false },
  { value: "valor_desc", label: "Maior valor", column: "valor_total", ascending: false },
  { value: "valor_asc", label: "Menor valor", column: "valor_total", ascending: true },
  { value: "titulo", label: "Título (A–Z)", column: "titulo", ascending: true },
] as const;

export type BudgetSortValue = (typeof BUDGET_SORT_OPTIONS)[number]["value"];

export const DEFAULT_BUDGET_SORT: BudgetSortValue = "recent";

export function getBudgetSortOption(value: string | undefined) {
  return BUDGET_SORT_OPTIONS.find((o) => o.value === value) ?? BUDGET_SORT_OPTIONS[0];
}
