"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePageHeaderContext } from "@/components/layout/page-header-context";

export function HeaderBackSlot() {
  const { back } = usePageHeaderContext();

  if (!back) return null;

  return (
    <Link
      href={back.href}
      className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
    >
      <ArrowLeft className="size-4" />
      {back.label}
    </Link>
  );
}
