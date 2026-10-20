import { Camera, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ObjetivoForm } from "@/components/budgets/objetivo-form";
import { PhotosTab } from "@/components/budgets/photos-tab";

type PhotoGroup = {
  id: string;
  titulo: string;
  created_at: string;
  photos: { id: string; photo_url: string }[];
};

export function ObjetivoTab({
  descricao,
  updateObjetivoAction,
  message,
  photoGroups,
  createGroupAction,
  addPhotosAction,
  deletePhotoAction,
  deleteGroupAction,
  defaultOpenPhotoDialog,
  error,
}: {
  descricao: string | null;
  updateObjetivoAction: (formData: FormData) => void;
  message?: string;
  photoGroups: PhotoGroup[];
  createGroupAction: (formData: FormData) => void;
  addPhotosAction: (formData: FormData) => void;
  deletePhotoAction: (formData: FormData) => void;
  deleteGroupAction: (formData: FormData) => void;
  defaultOpenPhotoDialog?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-base">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="size-4" />
            </span>
            Objetivo
          </CardTitle>
          <CardDescription>O que esse serviço pretende resolver. Vira o tópico 1 do relatório.</CardDescription>
        </CardHeader>
        <CardContent>
          <ObjetivoForm action={updateObjetivoAction} descricao={descricao} message={message} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Camera className="size-4" />
          </span>
          Registros fotográficos
        </p>
        <PhotosTab
          groups={photoGroups}
          createGroupAction={createGroupAction}
          addPhotosAction={addPhotosAction}
          deletePhotoAction={deletePhotoAction}
          deleteGroupAction={deleteGroupAction}
          defaultOpen={defaultOpenPhotoDialog}
          error={error}
        />
      </div>
    </div>
  );
}
