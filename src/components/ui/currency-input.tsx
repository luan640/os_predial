"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function centsToBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function digitsToCents(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function CurrencyInput({
  id,
  name,
  label,
  labelClassName,
  defaultValue = 0,
  required,
  placeholder = "R$ 0,00",
}: {
  id?: string;
  name: string;
  label?: string;
  labelClassName?: string;
  defaultValue?: number | null;
  required?: boolean;
  placeholder?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [cents, setCents] = useState(() => Math.round((defaultValue ?? 0) * 100));

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
      )}
      <Input
        id={inputId}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={cents === 0 ? "" : centsToBRL(cents)}
        onChange={(e) => setCents(digitsToCents(e.target.value))}
        required={required}
      />
      <input type="hidden" name={name} value={(cents / 100).toFixed(2)} />
    </div>
  );
}
