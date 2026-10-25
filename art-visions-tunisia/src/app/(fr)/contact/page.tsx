import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/site/quote-form";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";
import { SITE } from "@/lib/site";
import { alternates } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return (
    (await dbMetadata("page", "fr", "contact")) ?? {
      title: "Demander un devis gratuit | Art Visions Tunisie",
      description: "Décrivez votre projet de logo, identité visuelle, support imprimé ou site web et recevez une proposition d'Art Visions.",
      alternates: alternates({ fr: "/contact", ar: "/ar/contact" }, "fr"),
    }
  );
}

export default async function Page() {
  if (await getLive("page", "fr", "contact")) return <DbPageView kind="page" lang="fr" slug="contact" />;
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="text-5xl font-semibold text-indigo sm:text-6xl">Demander un devis</h1>
        <p className="mt-6 text-lg text-soft">Quelques lignes sur votre activité et votre besoin suffisent pour démarrer.</p>
        <p className="mt-8 text-sm">Ou écrivez-nous : <a className="num underline decoration-brand decoration-2 underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
      </div>
      <div className="lg:col-span-7"><Suspense fallback={null}><QuoteForm locale="fr" /></Suspense></div>
    </div>
  );
}
