"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PersonTypeFields({
  defaultTipoPessoa = "PF",
  defaultDocumento = "",
}: {
  defaultTipoPessoa?: string;
  defaultDocumento?: string;
}) {
  const [tipoPessoa, setTipoPessoa] = useState<"PF" | "PJ">(
    defaultTipoPessoa === "PJ" ? "PJ" : "PF",
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tipo_pessoa">Tipo</Label>
        <Select
          name="tipo_pessoa"
          value={tipoPessoa}
          onValueChange={(value) => setTipoPessoa(value as "PF" | "PJ")}
          items={{ PF: "Pessoa física", PJ: "Pessoa jurídica" }}
        >
          <SelectTrigger id="tipo_pessoa" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PF">Pessoa física</SelectItem>
            <SelectItem value="PJ">Pessoa jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MaskedInput
        key={tipoPessoa}
        id="documento"
        name="documento"
        label={tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
        defaultValue={defaultDocumento}
        mask={tipoPessoa === "PJ" ? "cnpj" : "cpf"}
      />
    </>
  );
}
