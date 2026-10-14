import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { EditScopeItemDialog } from "@/components/budgets/edit-scope-item-dialog";
import { AddScopeItemForm } from "@/components/budgets/add-scope-item-form";
import type { ScopeFormState } from "@/lib/actions/scope";

type ScopeItem = { id: string; descricao: string };

export function ScopeTab({
  items,
  createAction,
  updateAction,
  deleteAction,
  error,
}: {
  items: ScopeItem[];
  createAction: (prevState: ScopeFormState, formData: FormData) => Promise<ScopeFormState>;
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <AddScopeItemForm action={createAction} error={error} />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {items.length > 0 ? (
          <ol className="divide-y divide-border">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 text-xs font-medium text-muted-foreground">{index + 1}.</span>
                  <p className="text-sm text-foreground">{item.descricao}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <EditScopeItemDialog itemId={item.id} descricao={item.descricao} updateAction={updateAction} />
                  <ConfirmDeleteButton
                    action={deleteAction}
                    hiddenFieldName="item_id"
                    hiddenFieldValue={item.id}
                    title="Excluir item do escopo?"
                    description="Essa ação não pode ser desfeita."
                  />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum item do escopo cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
