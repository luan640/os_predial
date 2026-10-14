"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type BackInfo = { href: string; label: string } | null;

const PageHeaderContext = createContext<{
  back: BackInfo;
  setBack: (back: BackInfo) => void;
} | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [back, setBack] = useState<BackInfo>(null);

  return (
    <PageHeaderContext.Provider value={{ back, setBack }}>{children}</PageHeaderContext.Provider>
  );
}

export function usePageHeaderContext() {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) {
    throw new Error("usePageHeaderContext must be used within PageHeaderProvider");
  }
  return ctx;
}
