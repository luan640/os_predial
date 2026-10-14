"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps, KeyboardEvent, MouseEvent } from "react";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableRowLink({
  href,
  className,
  ...props
}: ComponentProps<typeof TableRow> & { href: string }) {
  const router = useRouter();

  const navigate = () => router.push(href);

  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button'], input, select, textarea")) return;
    navigate();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "Enter") navigate();
  };

  return (
    <TableRow
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn("cursor-pointer outline-none focus-visible:bg-muted/50", className)}
      {...props}
    />
  );
}
