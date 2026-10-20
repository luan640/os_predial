import { AddPhotoGroupDialog } from "@/components/budgets/add-photo-group-dialog";
import { PhotoGroupCard } from "@/components/budgets/photo-group-card";

type PhotoGroup = {
  id: string;
  titulo: string;
  created_at: string;
  photos: { id: string; photo_url: string }[];
};

export function PhotosTab({
  groups,
  createGroupAction,
  addPhotosAction,
  deletePhotoAction,
  deleteGroupAction,
  defaultOpen,
  error,
}: {
  groups: PhotoGroup[];
  createGroupAction: (formData: FormData) => void;
  addPhotosAction: (formData: FormData) => void;
  deletePhotoAction: (formData: FormData) => void;
  deleteGroupAction: (formData: FormData) => void;
  defaultOpen?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <AddPhotoGroupDialog createAction={createGroupAction} defaultOpen={defaultOpen} error={error} />

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {groups.map((group) => (
            <PhotoGroupCard
              key={group.id}
              group={group}
              addPhotosAction={addPhotosAction}
              deletePhotoAction={deletePhotoAction}
              deleteGroupAction={deleteGroupAction}
            />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum registro de foto ainda.
        </p>
      )}
    </div>
  );
}
