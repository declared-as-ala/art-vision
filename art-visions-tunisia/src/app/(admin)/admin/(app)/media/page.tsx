import { AdminTitle, Card } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/media-picker";

export const metadata = { title: "Médiathèque" };

export default function MediaPage() {
  return (
    <>
      <AdminTitle title="Médiathèque" desc="Images stockées dans le bucket MinIO de ce projet. Utilisables dans le page builder et pour les images de partage." />
      <Card className="p-6"><MediaLibrary /></Card>
    </>
  );
}
