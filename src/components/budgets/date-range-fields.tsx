"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DateRangeFields({
  defaultDataInicio = "",
  defaultDataPrevisaoEntrega = "",
}: {
  defaultDataInicio?: string;
  defaultDataPrevisaoEntrega?: string;
}) {
  const [dataInicio, setDataInicio] = useState(defaultDataInicio);
  const [dataPrevisaoEntrega, setDataPrevisaoEntrega] = useState(defaultDataPrevisaoEntrega);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="data_inicio">Início previsto</Label>
        <Input
          id="data_inicio"
          name="data_inicio"
          type="date"
          value={dataInicio}
          max={dataPrevisaoEntrega || undefined}
          onChange={(e) => setDataInicio(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="data_previsao_entrega">Previsão de entrega</Label>
        <Input
          id="data_previsao_entrega"
          name="data_previsao_entrega"
          type="date"
          value={dataPrevisaoEntrega}
          min={dataInicio || undefined}
          onChange={(e) => setDataPrevisaoEntrega(e.target.value)}
        />
      </div>
    </>
  );
}
