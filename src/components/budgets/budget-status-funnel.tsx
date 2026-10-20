"use client";

import { Fragment, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
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
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  function changeTo(nextStatus: BudgetStatus) {
    const formData = new FormData();
    formData.set("status", nextStatus);
    if (currentTab) formData.set("tab", currentTab);
    startTransition(() => {
      action(formData);
    });
  }

  if (status === "cancelado") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-muted-foreground" />
        Orçamento cancelado
      </div>
    );
  }

  const currentIndex = FUNNEL_STEPS.indexOf(status);
  const previousStatus = FUNNEL_STEPS[currentIndex - 1];
  const nextStatus = FUNNEL_STEPS[currentIndex + 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start">
        {FUNNEL_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <Fragment key={step}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold",
                    isDone && "border-[color:var(--chart-2)] bg-[color:var(--chart-2)] text-white",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isDone && !isCurrent && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-3" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "w-full text-center text-[11px] leading-tight font-medium text-balance",
                    isCurrent && "text-primary",
                    isDone && "text-foreground",
                    !isDone && !isCurrent && "text-muted-foreground",
                  )}
                >
                  {BUDGET_STATUS_CONFIG[step].label}
                </span>
              </div>
              {index < FUNNEL_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mt-3 h-0.5 w-2 shrink-0 sm:w-4",
                    isDone ? "bg-[color:var(--chart-2)]" : "bg-border",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {(previousStatus || nextStatus) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {previousStatus && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isPending}
              onClick={() => changeTo(previousStatus)}
            >
              <ChevronLeft className="size-3.5" />
              Voltar para {BUDGET_STATUS_CONFIG[previousStatus].label}
            </Button>
          )}
          {nextStatus && (
            <Button
              type="button"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isPending}
              onClick={() => changeTo(nextStatus)}
            >
              Avançar para {BUDGET_STATUS_CONFIG[nextStatus].label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
