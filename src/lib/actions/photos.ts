"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const titleSchema = z.object({
  titulo: z.string().trim().min(2, "Dê um título para identificar essas fotos."),
});

async function uploadPhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  groupId: string,
  files: File[],
  startOrdem: number,
) {
  const rows: { group_id: string; photo_url: string; ordem: number }[] = [];

  for (const [index, photo] of files.entries()) {
    const extension = photo.name.split(".").pop() || "jpg";
    const path = `${userId}/progress/${groupId}/${Date.now()}-${index}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("report-photos")
      .upload(path, photo, { contentType: photo.type || "image/jpeg" });

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage.from("report-photos").getPublicUrl(path);
      rows.push({ group_id: groupId, photo_url: publicUrl.publicUrl, ordem: startOrdem + index });
    }
  }

  if (rows.length > 0) {
    await supabase.from("budget_photos").insert(rows);
  }
}

export async function createPhotoGroupAction(budgetId: string, formData: FormData) {
  const parsed = titleSchema.safeParse({ titulo: formData.get("titulo") });

  if (!parsed.success) {
    redirect(`/orcamentos/${budgetId}?tab=objetivo&error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const photos = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (photos.length === 0) {
    redirect(`/orcamentos/${budgetId}?tab=objetivo&error=${encodeURIComponent("Selecione pelo menos uma foto.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: group, error } = await supabase
    .from("budget_photo_groups")
    .insert({ budget_id: budgetId, titulo: parsed.data.titulo })
    .select("id")
    .single();

  if (error || !group) {
    redirect(`/orcamentos/${budgetId}?tab=objetivo&error=${encodeURIComponent(error?.message ?? "Erro ao criar registro.")}`);
  }

  await uploadPhotos(supabase, user.id, group.id, photos, 0);

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=objetivo`);
}

export async function addPhotosToGroupAction(budgetId: string, formData: FormData) {
  const groupId = formData.get("group_id");
  const photos = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (typeof groupId !== "string" || photos.length === 0) {
    redirect(`/orcamentos/${budgetId}?tab=objetivo&error=${encodeURIComponent("Selecione pelo menos uma foto.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count } = await supabase
    .from("budget_photos")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId);

  await uploadPhotos(supabase, user.id, groupId, photos, count ?? 0);

  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=objetivo`);
}

export async function deletePhotoGroupAction(budgetId: string, formData: FormData) {
  const groupId = formData.get("group_id");
  if (typeof groupId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_photo_groups").delete().eq("id", groupId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=objetivo`);
}

export async function deletePhotoAction(budgetId: string, formData: FormData) {
  const photoId = formData.get("photo_id");
  if (typeof photoId === "string") {
    const supabase = await createClient();
    await supabase.from("budget_photos").delete().eq("id", photoId);
  }
  revalidatePath(`/orcamentos/${budgetId}`);
  redirect(`/orcamentos/${budgetId}?tab=objetivo`);
}
