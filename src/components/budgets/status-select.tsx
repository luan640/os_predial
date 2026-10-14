"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGET_STATUS, BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";

export function StatusSelect({
  status,
  action,
}: {
  status: BudgetStatus;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      items={Object.fromEntries(BUDGET_STATUS.map((s) => [s, BUDGET_STATUS_CONFIG[s].label]))}
      onValueChange={(value) => {
        const formData = new FormData();
        formData.set("status", value as string);
        startTransition(() => {
          action(formData);
        });
      }}
    >
      <SelectTrigger className="w-44 rounded-full border-0 bg-card pl-3 shadow-sm ring-1 ring-border">
        <span className={`size-2 shrink-0 rounded-full ${BUDGET_STATUS_CONFIG[status].dot}`} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BUDGET_STATUS.map((s) => (
          <SelectItem key={s} value={s}>
            <span className={`size-2 shrink-0 rounded-full ${BUDGET_STATUS_CONFIG[s].dot}`} />
            {BUDGET_STATUS_CONFIG[s].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
