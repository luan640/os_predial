"use client";

import { useTransition } from "react";
import { Check, ChevronLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUDGET_STATUS_CONFIG, type BudgetStatus } from "@/lib/budget-status";

const FUNNEL_STEPS: BudgetStatus[] = ["rascunho", "enviado", "aprovado", "em_andamento", "concluido"];

export function BudgetStatusFunnel({
  status,
  action,
}: {
  status: BudgetStatus;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function changeTo(nextStatus: BudgetStatus) {
    const formData = new FormData();
    formData.set("status", nextStatus);
    startTransition(() => {
      action(formData);
    });
  }

  if (status === "cancelado") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-muted-foreground" />
        Orçamento cancelado
      </div>
    );
  }

  const currentIndex = FUNNEL_STEPS.indexOf(status);
  const previousStatus = FUNNEL_STEPS[currentIndex - 1];
  const nextStatus = FUNNEL_STEPS[currentIndex + 1];

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="flex max-w-full items-center overflow-x-auto rounded-full bg-muted p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FUNNEL_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step} className="flex items-center">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                  isCurrent && "bg-primary text-primary-foreground shadow-sm",
                  !isCurrent && isDone && "text-foreground",
                  !isCurrent && !isDone && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 items-center justify-center rounded-full border",
                    isCurrent && "border-primary-foreground/60",
                    isDone && "border-[color:var(--chart-2)] bg-[color:var(--chart-2)] text-white",
                    !isCurrent && !isDone && "border-border",
                  )}
                >
                  {isDone && <Check className="size-2.5" />}
                </span>
                {BUDGET_STATUS_CONFIG[step].label}
              </span>
              {index < FUNNEL_STEPS.length - 1 && (
                <ChevronsRight className="size-3.5 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {previousStatus && (
          <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => changeTo(previousStatus)}>
            <ChevronLeft className="size-3.5" />
            Voltar para {BUDGET_STATUS_CONFIG[previousStatus].label}
          </Button>
        )}
        {nextStatus && (
          <Button type="button" size="sm" variant="secondary" disabled={isPending} onClick={() => changeTo(nextStatus)}>
            Avançar para {BUDGET_STATUS_CONFIG[nextStatus].label}
          </Button>
        )}
      </div>
    </div>
  );
}
