"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Info, MessageCircle, PenTool, Truck, UploadCloud } from "lucide-react";
import { STUDIO_PRODUCTS } from "@/components/studio/studioProducts";
import {
  GRAMMAGE_HELP, PREFS, SIDES_HELP, allValues, candidates, dimLabel, explain, labelOf, matchOffer, priceFor, quoteQuery,
  resolve, summarise, unitPriceText, type Dim, type Offer,
} from "@/lib/print-config";

interface Props {
  /** canonical product slug (labels, preferences) */
  slug: string;
  /** key in the catalogue (Studio compatibility) */
  catalogSlug: string;
  productName: string;
  offers: Offer[];
  perSquareMetre: boolean;
  production?: string;
  shipping?: string;
  express?: string;
}

const CHOICE_DIMS: Dim[] = ["format", "material", "grammage", "sides", "finish"];
const strip = (s?: string) => (s ?? "").replace(/\.$/, "");

/** Studio deep link: product + the format that matches the chosen dimensions, when there is one. */
function studioHref(catalogSlug: string, offer: Offer | undefined): string | null {
  const sp = STUDIO_PRODUCTS.find((p) => p.catalogSlug === catalogSlug);
  if (!sp) return null;
  const qs = new URLSearchParams({ product: sp.id });
  const m = offer && /(\d+(?:[.,]\d+)?)\D+?(\d+(?:[.,]\d+)?)\D*cm/i.exec(offer.dimension);
  if (m && !sp.custom) {
    const pair = [Number(m[1].replace(",", ".")) * 10, Number(m[2].replace(",", ".")) * 10].sort((a, b) => a - b);
    const f = sp.formats.find((x) => {
      const q = [x.widthMm, x.heightMm].sort((a, b) => a - b);
      return Math.abs(q[0] - pair[0]) <= 2 && Math.abs(q[1] - pair[1]) <= 2;
    });
    if (f) qs.set("format", f.id);
  }
  return `/studio/editor?${qs.toString()}`;
}

export default function ProductConfigurator({ slug, catalogSlug, productName, offers, perSquareMetre, production, shipping, express }: Props) {
  const uid = useId();
  const labels = (d: Dim) => dimLabel(catalogSlug, d);
  const prefs = PREFS[slug] ?? PREFS[catalogSlug];
  const [state, setState] = useState(() => resolve(offers, {}, null, labels, prefs));
  const { sel, notices } = state;

  const offer = useMemo(() => matchOffer(offers, sel), [offers, sel]);
  const price = priceFor(offer, sel.quantity);
  const unit = price ? unitPriceText(price) : null;
  const summary = summarise(productName, offers, sel, price, perSquareMetre);
  const studio = studioHref(catalogSlug, offer);

  const choose = (dim: Dim, value: string) => {
    const r = resolve(offers, { ...sel, [dim]: value }, dim, labels, prefs);
    setState(r);
  };

  const hrefFile = `/devis-sur-mesure?${quoteQuery(summary, { mode: "file_ready", src: "configurator-file" })}`;
  const hrefDesign = `/devis-sur-mesure?${quoteQuery(summary, { prefill: "design", src: "configurator-design" })}`;
  const terms = explain(sel.material, sel.finish, sel.format);

  const totalLabel = price ? `${price.text} HT${perSquareMetre ? " / m²" : ""}` : "Sur devis";

  return (
    <div className="space-y-6">
      {/* ───── guided choices ───── */}
      <div className="space-y-5">
        {CHOICE_DIMS.map((dim) => {
          const global = allValues(offers, dim);
          if (global.length < 2) {
            // A single possible value is a fixed characteristic: say it, so the visitor knows what the catalogue price covers
            if (dim === "sides" && global[0] && global[0] !== "unique") {
              return (
                <div key={dim} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/70">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/85">{labels(dim)}</p>
                  <p className="mt-1">
                    <strong className="text-white">{labelOf(dim, global[0], offers)}</strong> — les tarifs du catalogue sont établis pour {global[0] === "recto-verso" ? "une impression sur les deux faces" : "une impression sur une seule face"}.
                    Un autre besoin ? <Link href={hrefFile} className="font-semibold text-brand-magenta underline underline-offset-4">Demandez un devis</Link>.
                  </p>
                </div>
              );
            }
            return null;
          }
          const avail = candidates(offers, sel, dim);
          const name = `${uid}-${dim}`;
          const help = dim === "grammage" ? GRAMMAGE_HELP : dim === "sides" ? SIDES_HELP : null;
          const useSelect = global.length > 6;
          const restricted = avail.length < global.length;

          return (
            <fieldset key={dim} className="min-w-0">
              <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/85">{labels(dim)}</legend>

              {useSelect ? (
                <select
                  aria-label={labels(dim)}
                  value={sel[dim]}
                  onChange={(e) => choose(dim, e.target.value)}
                  className="w-full rounded-xl border border-brand-purple/30 bg-[#1A1238] px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-magenta"
                >
                  {avail.map((v) => (<option key={v} value={v}>{labelOf(dim, v, offers)}</option>))}
                </select>
              ) : (
                <div role="radiogroup" aria-label={labels(dim)} className="flex flex-wrap gap-2">
                  {global.map((v) => {
                    const ok = avail.includes(v);
                    return (
                      <label key={v} className={ok ? "cursor-pointer" : "cursor-not-allowed"} title={ok ? undefined : "Non disponible avec vos choix précédents"}>
                        <input
                          type="radio"
                          name={name}
                          value={v}
                          checked={sel[dim] === v}
                          disabled={!ok}
                          onChange={() => choose(dim, v)}
                          className="peer sr-only"
                        />
                        <span
                          className={`block rounded-xl border px-4 py-2.5 text-sm font-semibold transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand-magenta peer-checked:border-brand-magenta peer-checked:bg-brand-magenta/20 peer-checked:text-white ${
                            ok ? "border-brand-purple/30 bg-white/[0.04] text-white/80 hover:border-brand-magenta/60" : "border-white/10 bg-white/[0.02] text-white/30 line-through"
                          }`}
                        >
                          {labelOf(dim, v, offers)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {restricted && (
                <p className="mt-1.5 text-[11px] text-white/45">
                  {useSelect ? "Seules les options existantes avec vos choix précédents sont proposées." : "Les options barrées n'existent pas avec vos choix précédents : modifiez-les pour les débloquer."}
                </p>
              )}
              {help && <p className="mt-1.5 flex gap-1.5 text-[11px] text-white/50"><Info size={12} className="mt-px shrink-0" aria-hidden />{help}</p>}
            </fieldset>
          );
        })}

        {terms.length > 0 && (
          <ul className="space-y-1 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-white/60">
            {terms.map((t) => (<li key={t} className="flex gap-1.5"><Info size={12} className="mt-px shrink-0 text-brand-magenta" aria-hidden />{t}</li>))}
          </ul>
        )}

        {/* quantity (or per m² price) */}
        {perSquareMetre ? (
          <div className="rounded-xl border border-brand-purple/30 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white/85">Tarif au m²</p>
            <p className="mt-1 text-2xl font-extrabold text-[#CD7942]">{price ? `${price.text} HT / m²` : "Sur devis"}</p>
            <p className="mt-1 text-xs text-white/60">Le total dépend de votre surface exacte et du nombre de pièces : demandez un devis, vos choix sont conservés.</p>
          </div>
        ) : (
          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/85">{labels("quantity")}</legend>
            <div role="radiogroup" aria-label="Quantité" className="grid gap-2 sm:grid-cols-2">
              {candidates(offers, sel, "quantity").map((q) => {
                const p = priceFor(offer, q);
                const u = p ? unitPriceText(p) : null;
                return (
                  <label key={q} className="cursor-pointer">
                    <input type="radio" name={`${uid}-qty`} value={q} checked={sel.quantity === q} onChange={() => choose("quantity", q)} className="peer sr-only" />
                    <span className="flex items-center justify-between gap-3 rounded-xl border border-brand-purple/30 bg-white/[0.04] px-4 py-3 transition hover:border-brand-magenta/60 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-magenta peer-checked:border-brand-magenta peer-checked:bg-brand-magenta/20">
                      <span className="text-sm font-bold text-white">{labelOf("quantity", q, offers)}</span>
                      <span className="text-right">
                        <span className="block text-sm font-extrabold text-white">{p?.text} <span className="text-[10px] font-semibold text-white/50">HT</span></span>
                        {u && <span className="block text-[10px] text-white/45">{u}</span>}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <div role="status" aria-live="polite" className={notices.length ? "rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-100 space-y-1" : "sr-only"}>
          {notices.map((n) => (<p key={n}>{n}</p>))}
        </div>
      </div>

      {/* ───── price + recap ───── */}
      <div className="rounded-2xl border border-brand-magenta/30 bg-[#1A1238]/70 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">{perSquareMetre ? "Tarif" : "Total"}</p>
          <p className="text-3xl font-extrabold text-[#CD7942]" aria-live="polite">{totalLabel}</p>
        </div>
        {unit && <p className="text-right text-xs text-white/55">{unit}</p>}

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
          <dt className="text-white/45">Produit</dt><dd className="text-white/85">{summary.product}</dd>
          <dt className="text-white/45">Format</dt><dd className="text-white/85">{summary.format}</dd>
          <dt className="text-white/45">Papier</dt><dd className="text-white/85">{summary.paper}</dd>
          {summary.sides && (<><dt className="text-white/45">Impression</dt><dd className="text-white/85">{summary.sides}</dd></>)}
          {summary.finish && (<><dt className="text-white/45">Finition</dt><dd className="text-white/85">{summary.finish}</dd></>)}
          {summary.quantity && (<><dt className="text-white/45">Quantité</dt><dd className="text-white/85">{summary.quantity}</dd></>)}
        </dl>

        <p className="mt-4 flex gap-2 text-[11px] leading-snug text-white/55">
          <Truck size={14} className="mt-px shrink-0 text-brand-magenta" aria-hidden />
          <span>
            {production ? `Production : ${strip(production)}. ` : ""}{shipping ? `Livraison : ${strip(shipping)}. ` : ""}{express ? `${strip(express)}. ` : ""}
            Prix hors TVA (HT) ; frais de port calculés à la validation du devis.
          </span>
        </p>

        {/* ───── next steps, by priority ───── */}
        <div className="mt-5 space-y-2.5">
          <Link href={hrefFile} data-tracking="cta_click" className="flex items-center justify-center gap-2 rounded-full bg-[#D95200] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#D95200]/25 transition hover:bg-[#B84200]">
            <UploadCloud size={17} aria-hidden /> Envoyer mon fichier
          </Link>
          <p className="-mt-1 text-center text-[11px] text-white/45">Vous joignez votre fichier à une demande de devis : aucun paiement à cette étape.</p>
          {studio && (
            <Link href={studio} data-tracking="cta_click" className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D72888] to-[#6C2BD9] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110">
              Personnaliser un modèle
            </Link>
          )}
          <Link href={hrefDesign} data-tracking="cta_click" className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-orange">
            <PenTool size={16} aria-hidden /> Confier la création à un graphiste (sur devis)
          </Link>
        </div>
      </div>

      {/* ───── advice ───── */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <MessageCircle size={15} className="text-brand-magenta" aria-hidden />
          <strong className="text-white">Un doute sur le papier, les finitions ou votre fichier ? Demandez conseil.</strong>
        </p>
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/contact" className="font-semibold text-brand-magenta underline underline-offset-4">Nous écrire</Link>
          <a href="https://wa.me/32490224905" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-300 underline underline-offset-4">WhatsApp</a>
          <a href="tel:+32490224905" className="font-semibold text-white/80 underline underline-offset-4">+32 490 22 49 05</a>
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer font-semibold text-white/85">Ce qui est inclus, ce qui est sur devis</summary>
          <ul className="mt-2 space-y-1.5 list-disc pl-5 text-white/65">
            <li><strong className="text-white/85">Vérification technique du fichier</strong> (format, résolution, fond perdu) : gratuite. Nous vous indiquons ce qui doit être corrigé.</li>
            <li><strong className="text-white/85">Corrections du fichier</strong> (mise aux normes, retouches, remplacement d&apos;éléments) : chiffrées sur devis avant tout travail.</li>
            <li><strong className="text-white/85">Création graphique sur mesure</strong> par notre graphiste : prestation sur devis.</li>
          </ul>
        </details>
      </div>

      {/* mobile: price + main action always within reach (the page keeps bottom padding, so nothing is hidden) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-brand-purple/30 bg-[#0b0314]/95 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pr-20 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-wider text-white/50">{summary.quantity || "Tarif au m²"}</p>
            <p className="truncate text-base font-extrabold text-[#CD7942]">{totalLabel}</p>
          </div>
          <Link href={hrefFile} data-tracking="cta_click" className="shrink-0 rounded-full bg-[#D95200] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
            Envoyer mon fichier
          </Link>
        </div>
      </div>
    </div>
  );
}

