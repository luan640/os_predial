"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  formatCNPJ,
  isValidCNPJ,
  formatCPF,
  isValidCPF,
  formatTelefone,
  isValidTelefone,
} from "@/lib/validators";

const MASKS = {
  cnpj: { format: formatCNPJ, validate: isValidCNPJ, errorMessage: "CNPJ inválido." },
  cpf: { format: formatCPF, validate: isValidCPF, errorMessage: "CPF inválido." },
  telefone: { format: formatTelefone, validate: isValidTelefone, errorMessage: "Telefone inválido." },
} as const;

export type MaskType = keyof typeof MASKS;

export function MaskedInput({
  id,
  name,
  label,
  labelClassName,
  defaultValue = "",
  required,
  placeholder,
  mask,
  errorMessage,
}: {
  id?: string;
  name: string;
  label: string;
  labelClassName?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  mask: MaskType;
  errorMessage?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { format, validate, errorMessage: defaultErrorMessage } = MASKS[mask];
  const [value, setValue] = useState(() => format(defaultValue));
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && value.length > 0 && !validate(value);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId} className={labelClassName}>{label}</Label>
      <Input
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={isInvalid}
        onChange={(e) => setValue(format(e.target.value))}
        onBlur={() => setTouched(true)}
        className={cn(isInvalid && "border-destructive focus-visible:ring-destructive/20")}
      />
      {isInvalid && <p className="text-xs text-destructive">{errorMessage ?? defaultErrorMessage}</p>}
    </div>
  );
}
