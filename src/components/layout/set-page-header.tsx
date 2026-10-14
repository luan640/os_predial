"use client";

import { useEffect } from "react";
import { usePageHeaderContext } from "@/components/layout/page-header-context";

export function SetPageHeader({ href, label }: { href: string; label: string }) {
  const { setBack } = usePageHeaderContext();

  useEffect(() => {
    setBack({ href, label });
    return () => setBack(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href, label]);

  return null;
}
