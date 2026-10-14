import Link from "next/link";
import { ArrowUpRight, Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ClientMiniCard({
  client,
}: {
  client: { id: string; nome: string; telefone: string | null; email: string | null };
}) {
  const initials = client.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="size-4 text-muted-foreground" />
          Cliente
        </CardTitle>
        <Link
          href={`/clientes?editar=${client.id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Abrir cliente
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-sm text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-sm font-medium text-foreground">{client.nome}</p>
          {client.telefone && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="size-3" />
              {client.telefone}
            </p>
          )}
          {client.email && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3" />
              {client.email}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
