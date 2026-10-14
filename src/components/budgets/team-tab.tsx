import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { AllocateWorkerDialog } from "@/components/budgets/allocate-worker-dialog";
import { formatCurrencyBRL } from "@/lib/format";

type Allocation = {
  id: string;
  worker: { id: string; nome: string; funcao: string | null; valor_diaria: number | null } | null;
};

type CompanyWorker = { id: string; nome: string; funcao: string | null };

export function TeamTab({
  allocations,
  companyWorkers,
  allocateAction,
  deallocateAction,
  error,
}: {
  allocations: Allocation[];
  companyWorkers: CompanyWorker[];
  allocateAction: (formData: FormData) => void;
  deallocateAction: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AllocateWorkerDialog
          companyWorkers={companyWorkers}
          allocateAction={allocateAction}
          defaultOpen={!!error}
          error={error}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {allocations.length > 0 ? (
          <ul className="divide-y divide-border">
            {allocations.map((allocation) => (
              <li key={allocation.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{allocation.worker?.nome ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {allocation.worker?.funcao || "Sem função definida"}
                    {allocation.worker?.valor_diaria
                      ? ` · ${formatCurrencyBRL(allocation.worker.valor_diaria)}/dia`
                      : ""}
                  </p>
                </div>
                <ConfirmDeleteButton
                  action={deallocateAction}
                  hiddenFieldName="allocation_id"
                  hiddenFieldValue={allocation.id}
                  title="Remover operador?"
                  description={`${allocation.worker?.nome ?? "Esse operador"} será desalocado deste orçamento.`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum operador alocado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
