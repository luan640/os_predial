import { CalendarDays, Images } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { AddMorePhotosDialog } from "@/components/budgets/add-more-photos-dialog";
import { formatDate } from "@/lib/format";

type Photo = { id: string; photo_url: string };

export function PhotoGroupCard({
  group,
  addPhotosAction,
  deletePhotoAction,
  deleteGroupAction,
}: {
  group: { id: string; titulo: string; created_at: string; photos: Photo[] };
  addPhotosAction: (formData: FormData) => void;
  deletePhotoAction: (formData: FormData) => void;
  deleteGroupAction: (formData: FormData) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Images className="size-4 text-muted-foreground" />
            {group.titulo}
          </CardTitle>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3" />
            {formatDate(group.created_at?.slice(0, 10))}
            <span className="mx-0.5">·</span>
            <Images className="size-3" />
            {group.photos.length} {group.photos.length === 1 ? "foto" : "fotos"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <AddMorePhotosDialog groupId={group.id} titulo={group.titulo} addAction={addPhotosAction} />
          <ConfirmDeleteButton
            action={deleteGroupAction}
            hiddenFieldName="group_id"
            hiddenFieldValue={group.id}
            title="Excluir registro?"
            description={`Isso remove "${group.titulo}" e todas as suas fotos. Essa ação não pode ser desfeita.`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {group.photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {group.photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.photo_url} alt={group.titulo} className="size-full object-cover" />
                <form
                  action={deletePhotoAction}
                  className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <button
                    type="submit"
                    className="flex size-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                    title="Remover foto"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma foto neste registro.</p>
        )}
      </CardContent>
    </Card>
  );
}
