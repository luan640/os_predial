import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { AddOrcamentoItemDialog } from "@/components/budgets/add-orcamento-item-dialog";
import { EditOrcamentoItemDialog } from "@/components/budgets/edit-orcamento-item-dialog";
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

type OrcamentoItem = {
  id: string;
  servico: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
};

export function OrcamentoTab({
  items,
  createAction,
  updateAction,
  deleteAction,
  error,
}: {
  items: OrcamentoItem[];
  createAction: (formData: FormData) => void;
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  error?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.valor_total, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AddOrcamentoItemDialog createAction={createAction} defaultOpen={!!error} error={error} />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Valor unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="mr-1.5 text-xs font-medium text-muted-foreground">6.{index + 1}</span>
                    {item.servico}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{item.quantidade}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrencyBRL(item.valor_unitario)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrencyBRL(item.valor_total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <EditOrcamentoItemDialog
                        itemId={item.id}
                        servico={item.servico}
                        quantidade={item.quantidade}
                        valorUnitario={item.valor_unitario}
                        updateAction={updateAction}
                      />
                      <ConfirmDeleteButton
                        action={deleteAction}
                        hiddenFieldName="item_id"
                        hiddenFieldValue={item.id}
                        title="Excluir item?"
                        description={`Remover "${item.servico}" do orçamento. Essa ação não pode ser desfeita.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum item lançado neste orçamento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {items.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">
                  Total geral
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
