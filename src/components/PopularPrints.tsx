import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { getPopularPrints } from "@/lib/print-showcase";

/** Compact home section: the most requested print products, with a real example configuration and its catalogue price. */
export default function PopularPrints() {
  const items = getPopularPrints();
  if (items.length === 0) return null;

  return (
    <section id="impressions" aria-labelledby="popular-prints-title" className="pt-8 pb-14 md:pt-12 md:pb-20 relative border-t border-brand-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-magenta">Impression</span>
            <h2 id="popular-prints-title" className="mt-2 text-2xl sm:text-3xl md:text-4xl font-montserrat font-extrabold text-white leading-tight">
              Nos impressions les plus demandées
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Un exemple de configuration et son tarif pour chaque support. Les autres formats, quantités et papiers sont détaillés sur chaque fiche.
            </p>
          </div>
          <Link
            href="/impression"
            data-tracking="cta_click"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-white transition shrink-0"
          >
            Tout le catalogue et les tarifs <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((p) => (
            <li key={p.slug} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-brand-purple/20 bg-[#1A1238]/50 p-4 transition hover:border-brand-magenta/50">
                <Link href={p.href} data-tracking="cta_click" className="group block" aria-label={`${p.name} : voir la fiche et les tarifs`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-brand-purple/15 bg-[#120a28]/80 p-2">
                    <img src={p.image} alt={p.alt} loading="lazy" width={400} height={300} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold font-montserrat uppercase tracking-tight text-white group-hover:text-brand-magenta transition-colors">{p.name}</h3>
                </Link>
                <p className="mt-1 text-xs text-white/65">{p.usage}</p>

                <dl className="mt-4 space-y-1 text-xs">
                  <dt className="sr-only">Exemple de configuration</dt>
                  <dd className="text-white/60 leading-relaxed">{p.config}</dd>
                  <dt className="sr-only">Prix</dt>
                  <dd className="pt-1 text-lg font-extrabold text-[#CD7942]">{p.price}</dd>
                </dl>
                <p className="mt-2 flex gap-1.5 text-[11px] leading-snug text-white/45">
                  <Truck size={13} className="mt-px shrink-0" aria-hidden /> {p.delivery}
                </p>

                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <Link
                    href={p.href}
                    data-tracking="cta_click"
                    className="rounded-full bg-brand-magenta px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-magenta/90"
                  >
                    Voir la fiche et les tarifs
                  </Link>
                  <Link
                    href={p.quoteHref}
                    data-tracking="cta_click"
                    className="rounded-full border border-white/20 px-4 py-2 text-center text-xs font-semibold text-white/85 transition hover:border-brand-orange hover:text-white"
                  >
                    Demander un devis
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-white/50">
          Tarifs affichés hors TVA (HT), issus de nos grilles. Frais de port calculés à la validation du devis. Une création graphique ou des corrections de fichier se chiffrent séparément, sur devis.
        </p>
      </div>
    </section>
  );
}
