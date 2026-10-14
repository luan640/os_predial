import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { AddItemDialog } from "@/components/budgets/add-item-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyBRL } from "@/lib/format";
import { BUDGET_ITEM_TYPES } from "@/lib/budget-status";

type BudgetItem = {
  id: string;
  tipo: string;
  descricao: string;
  quantidade: number;
  unidade: string | null;
  valor_unitario: number;
  valor_total: number;
};

type Material = {
  id: string;
  nome: string;
  unidade: string | null;
};

const TIPO_LABEL: Record<string, string> = Object.fromEntries(
  BUDGET_ITEM_TYPES.map((t) => [t.value, t.label]),
);

export function ItemsTab({
  items,
  materials,
  createAction,
  deleteAction,
  error,
}: {
  items: BudgetItem[];
  materials: Material[];
  createAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  error?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.valor_total, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AddItemDialog createAction={createAction} materials={materials} defaultOpen={!!error} error={error} />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead>Un.</TableHead>
              <TableHead className="text-right">Valor unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{TIPO_LABEL[item.tipo] ?? item.tipo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.quantidade}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unidade || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrencyBRL(item.valor_unitario)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrencyBRL(item.valor_total)}
                  </TableCell>
                  <TableCell>
                    <ConfirmDeleteButton
                      action={deleteAction}
                      hiddenFieldName="item_id"
                      hiddenFieldValue={item.id}
                      title="Excluir item?"
                      description={`Remover "${item.descricao}" deste orçamento. Essa ação não pode ser desfeita.`}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhum item lançado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {items.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium text-muted-foreground">
                  Total em itens
                </TableCell>
                <TableCell className="text-right tabular-nums font-semibold">
                  {formatCurrencyBRL(total)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
