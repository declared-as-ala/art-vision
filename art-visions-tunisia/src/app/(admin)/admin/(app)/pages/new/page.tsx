import { connection } from "next/server";
import { createPageAction } from "@/app/(admin)/admin/actions";
import { AdminTitle, Card } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewPageSlug } from "@/components/admin/new-page-slug";
import { ARTICLE_CATEGORIES, KINDS, isKind } from "@/lib/content-kinds";

export const metadata = { title: "Nouveau contenu" };

const ERR: Record<string, string> = { invalid: "Titre ou slug invalide.", reserved: "Ce slug est déjà pris par un contenu existant du site.", exists: "Ce slug existe déjà pour ce type et cette langue." };
const select = "h-10 rounded-lg border border-input bg-white px-3 text-sm";

export default async function NewPage({ searchParams }: PageProps<"/admin/pages/new">) {
  await connection();
  const sp = await searchParams;
  const err = typeof sp.error === "string" ? sp.error : undefined;
  const kind = isKind(sp.kind) ? sp.kind : "page";
  const k = KINDS[kind];
  const bilingual = (k.langs as readonly string[]).includes("ar");
  const labels: Record<string, string> = { page: "Nouvelle page", article: "Nouvel article", project: "Nouveau projet", service: "Nouvelle page de service" };
  return (
    <>
      <AdminTitle title={labels[kind]} desc="Renseignez l'essentiel, puis construisez le contenu avec l'éditeur visuel." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <form action={createPageAction} className="grid gap-5">
          <input type="hidden" name="kind" value={kind} />
          {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{ERR[err] ?? "Erreur."}</p>}
          <NewPageSlug prefix={`art-visions.tn${k.prefix}/`} />
          {kind === "page" || kind === "service" ? (
            <div className="grid gap-1.5">
              <Label htmlFor="template">Modèle</Label>
              <select id="template" name="template" className={select}>
                <option value="landing">Landing page (hero, avantages, processus, FAQ, CTA)</option>
                <option value="service">Page service (avec tarifs)</option>
                <option value="legal">Page légale / institutionnelle (à compléter)</option>
                <option value="blank">Vierge</option>
              </select>
            </div>
          ) : <input type="hidden" name="template" value={kind} />}
          {bilingual && (
            <div className="grid gap-1.5">
              <Label htmlFor="lang">Langue</Label>
              <select id="lang" name="lang" className={select}>
                <option value="fr">Français (fr-TN)</option>
                <option value="ar">العربية (ar-TN) — mise en page RTL, publiée sous /ar</option>
              </select>
            </div>
          )}
          {kind === "article" && (
            <div className="grid gap-1.5"><Label htmlFor="category">Catégorie</Label>
              <select id="category" name="category" className={select}><option value="">—</option>{ARTICLE_CATEGORIES.map((c) => (<option key={c}>{c}</option>))}</select></div>
          )}
          <div className="grid gap-1.5"><Label htmlFor="keyword">Mot-clé principal</Label><Input id="keyword" name="keyword" placeholder="ex. création flyer Tunisie" /></div>
          <div className="grid gap-1.5"><Label htmlFor="seoTitle">Titre SEO</Label><Input id="seoTitle" name="seoTitle" /></div>
          <div className="grid gap-1.5"><Label htmlFor="metaDescription">Méta description</Label><Textarea id="metaDescription" name="metaDescription" rows={3} /></div>
          <button className="justify-self-start rounded-full bg-brand px-7 py-3 text-sm font-medium text-white hover:bg-brand-ink">Créer et ouvrir l&apos;éditeur</button>
        </form>
      </Card>
    </>
  );
}
