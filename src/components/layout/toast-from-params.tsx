"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ToastFromParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const message = searchParams.get("message");
  const error = searchParams.get("error");

  useEffect(() => {
    if (!message && !error) return;

    if (message) toast.success(message);
    if (error) toast.error(error);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("message");
    params.delete("error");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to message/error changing
  }, [message, error]);

  return null;
}
