import { Camera, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-4 text-muted-foreground" />
            Objetivo
          </CardTitle>
          <CardDescription>O que esse serviço pretende resolver. Vira o tópico 1 do relatório.</CardDescription>
        </CardHeader>
        <CardContent>
          {message && <p className="mb-3 text-sm text-[color:var(--chart-2)]">{message}</p>}
          <form action={updateObjetivoAction} className="flex flex-col gap-3">
            <Textarea
              name="descricao"
              rows={4}
              placeholder="Ex: Corrigir os trechos danificados da parede e recuperar o acabamento da superfície."
              defaultValue={descricao ?? ""}
            />
            <Button type="submit" variant="secondary" className="w-fit self-end">
              Salvar objetivo
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Camera className="size-4 text-muted-foreground" />
          Fotos do estado atual
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
