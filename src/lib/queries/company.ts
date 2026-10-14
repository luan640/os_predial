import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireCompanyId(supabase: SupabaseClient, userId: string) {
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (!company) {
    redirect("/onboarding");
  }

  return company.id as string;
}
