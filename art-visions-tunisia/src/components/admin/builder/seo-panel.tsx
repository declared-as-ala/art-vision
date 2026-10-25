"use client";

import { useMemo, useState } from "react";
import { Check, CircleAlert, Info, Smartphone, Monitor } from "lucide-react";
import { runChecks, score, scoreTone, titlePixels, type SeoContext, type SeoInput } from "@/lib/seo-score";
import { analyseBlocks } from "@/lib/blocks";
import { SITE } from "@/lib/site";
import { MediaPickerField } from "@/components/admin/media-picker";

export type SeoState = SeoInput & {
  secondaryKeywords: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumbLabel: string;
  lang: string;
};

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";
const SCHEMAS = ["WebPage", "Service", "FAQPage", "AboutPage", "ContactPage", "CollectionPage", "Article"];

function F({ label, children, hint }: { label: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (<div><label className="mb-1.5 block text-xs font-medium">{label}</label>{children}{hint && <div className="mt-1 text-[11px] text-soft">{hint}</div>}</div>);
}

function Meter({ value, min, max, hardMax }: { value: number; min: number; max: number; hardMax: number }) {
  const pct = Math.min(100, (value / hardMax) * 100);
  const ok = value >= min && value <= max;
  return <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-tint-violet"><div className={`h-full rounded-full transition-all ${ok ? "bg-emerald-500" : value > max ? "bg-red-500" : "bg-amber-400"}`} style={{ width: `${pct}%` }} /></div>;
}

function Serp({ s, mobile }: { s: SeoState; mobile: boolean }) {
  const host = SITE.url.replace(/^https?:\/\//, "");
  const crumb = s.breadcrumbLabel || s.title;
  const title = s.seoTitle || s.title || "Titre de la page";
  const desc = s.metaDescription || "Ajoutez une méta description : c'est le texte affiché sous le titre dans les résultats.";
  return (
    <div className={`rounded-xl border border-line bg-white p-4 ${mobile ? "max-w-[22rem]" : ""}`} style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="flex items-center gap-2 text-[12px]">
        <span className="grid size-6 place-items-center rounded-full bg-tint-violet text-[10px] font-bold text-indigo">AV</span>
        <div className="min-w-0"><p className="truncate text-[#202124]">Art Visions</p><p className="truncate text-[#4d5156]">{host} › {crumb.slice(0, 40)}</p></div>
      </div>
      <p className="mt-2 text-[19px] leading-snug text-[#1a0dab]" style={{ display: "-webkit-box", WebkitLineClamp: mobile ? 2 : 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title}</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-[#4d5156]" style={{ display: "-webkit-box", WebkitLineClamp: mobile ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</p>
    </div>
  );
}

function jsonLd(s: SeoState) {
  const an = analyseBlocks(s.blocks);
  const url = `${SITE.url}/${s.slug}`;
  const ld: Record<string, unknown>[] = [{ "@context": "https://schema.org", "@type": s.schemaType, name: s.seoTitle || s.title, description: s.metaDescription, url, inLanguage: s.lang === "ar" ? "ar-TN" : "fr-TN" }];
  if (an.hasFaq) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: an.faqs.filter((f) => f.q && f.a).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  ld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url }, { "@type": "ListItem", position: 2, name: s.breadcrumbLabel || s.title, item: url }] });
  return ld;
}

export function SeoPanel({ state, set, ctx, canEditSeo }: { state: SeoState; set: (p: Partial<SeoState>) => void; ctx: SeoContext; canEditSeo: boolean }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const checks = useMemo(() => runChecks(state, ctx), [state, ctx]);
  const total = score(checks);
  const groups = useMemo(() => [...new Set(checks.map((c) => c.group))].map((g) => ({ g, items: checks.filter((c) => c.group === g) })), [checks]);
  const px = titlePixels(state.seoTitle);
  const ld = useMemo(() => JSON.stringify(jsonLd(state), null, 2), [state]);
  const dis = !canEditSeo;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
        <div className={`num grid size-16 shrink-0 place-items-center rounded-full text-2xl font-semibold ${scoreTone(total)}`} aria-label={`Score SEO ${total} sur 100`}>{total}</div>
        <p className="text-xs leading-relaxed text-soft"><strong className="text-charcoal">Score éditorial interne.</strong> Il mesure la qualité des bonnes pratiques de cette page. Ce n&apos;est pas une prévision de classement Google : 100/100 ne garantit aucune position.</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Aperçu dans les résultats</h3>
          <div className="flex gap-1 rounded-lg bg-tint-violet p-0.5">{([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([d, Icon]) => (<button key={d} onClick={() => setDevice(d)} aria-pressed={device === d} aria-label={d} className={`rounded-md p-1.5 ${device === d ? "bg-white shadow-sm" : ""}`}><Icon size={14} /></button>))}</div></div>
        <Serp s={state} mobile={device === "mobile"} />
        <p className="text-[11px] text-soft">Simulation indicative : Google peut afficher un titre ou un extrait différent.</p>
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="grid aspect-[1.91/1] place-items-center bg-tint-violet text-xs text-soft">
            {state.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={state.ogImage} alt="" className="size-full object-cover" />
            ) : (
              "Aucune image de partage"
            )}
          </div>
          <div className="p-3"><p className="num text-[10px] uppercase text-soft">{SITE.url.replace(/^https?:\/\//, "")}</p><p className="truncate text-sm font-semibold">{state.ogTitle || state.seoTitle || state.title}</p><p className="line-clamp-2 text-xs text-soft">{state.ogDescription || state.metaDescription}</p></div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Mots-clés</h3>
        <F label="Mot-clé principal"><input disabled={dis} value={state.keyword} onChange={(e) => set({ keyword: e.target.value })} className={input} /></F>
        <F label="Mots-clés secondaires" hint="Séparés par des virgules"><input disabled={dis} value={state.secondaryKeywords} onChange={(e) => set({ secondaryKeywords: e.target.value })} className={input} /></F>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Balises</h3>
        <F label="Titre SEO" hint={<span className="num">{state.seoTitle.length} car. · ≈ {px}px / 600px</span>}>
          <input disabled={dis} value={state.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} className={input} /><Meter value={px} min={300} max={600} hardMax={700} /></F>
        <F label="Méta description" hint={<span className="num">{state.metaDescription.length} / 160 car.</span>}>
          <textarea disabled={dis} rows={3} value={state.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} className={input} /><Meter value={state.metaDescription.length} min={120} max={160} hardMax={200} /></F>
        <F label="Libellé du fil d'Ariane"><input disabled={dis} value={state.breadcrumbLabel} onChange={(e) => set({ breadcrumbLabel: e.target.value })} className={input} /></F>
        <F label="URL canonique" hint="Vide = l'URL de la page"><input disabled={dis} value={state.canonicalUrl} onChange={(e) => set({ canonicalUrl: e.target.value })} placeholder="https://…" className={input} /></F>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm"><input disabled={dis} type="checkbox" checked={state.noindex} onChange={(e) => set({ noindex: e.target.checked })} />noindex</label>
          <label className="flex items-center gap-2 text-sm"><input disabled={dis} type="checkbox" checked={state.nofollow} onChange={(e) => set({ nofollow: e.target.checked })} />nofollow</label>
        </div>
        <F label="Type de données structurées"><select disabled={dis} value={state.schemaType} onChange={(e) => set({ schemaType: e.target.value })} className={input}>{SCHEMAS.map((x) => (<option key={x}>{x}</option>))}</select></F>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Réseaux sociaux (Open Graph / X)</h3>
        <F label="Titre"><input disabled={dis} value={state.ogTitle} onChange={(e) => set({ ogTitle: e.target.value })} className={input} /></F>
        <F label="Description"><textarea disabled={dis} rows={2} value={state.ogDescription} onChange={(e) => set({ ogDescription: e.target.value })} className={input} /></F>
        <F label="Image (1200×630)"><MediaPickerField value={state.ogImage} onChange={(v) => set({ ogImage: v })} /></F>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Audit</h3>
        {groups.map(({ g, items }) => (
          <div key={g} className="rounded-xl border border-line">
            <p className="num border-b border-line px-3 py-2 text-[10px] uppercase tracking-widest text-soft">{g}</p>
            <ul className="divide-y divide-line">
              {[...items].sort((a, b) => Number(a.pass) - Number(b.pass)).map((c) => (
                <li key={c.id} className="flex gap-2.5 px-3 py-2.5 text-xs">
                  {c.pass ? <Check size={15} className="mt-px shrink-0 text-emerald-600" /> : c.level === "error" ? <CircleAlert size={15} className="mt-px shrink-0 text-red-600" /> : <Info size={15} className="mt-px shrink-0 text-amber-500" />}
                  <div><p className={c.pass ? "text-soft" : "font-medium"}>{c.label}</p>{!c.pass && <p className="mt-0.5 text-soft">{c.hint}</p>}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Données structurées (aperçu JSON-LD)</h3>
        <pre className="max-h-56 overflow-auto rounded-xl bg-night p-3 text-[11px] leading-relaxed text-white/85" data-lenis-prevent>{ld}</pre>
      </section>
    </div>
  );
}
