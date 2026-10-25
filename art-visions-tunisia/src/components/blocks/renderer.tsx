import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { TOOLS } from "@/content/tools";
import { TunisiaFlag } from "@/components/site/tunisia-flag";
import { videoEmbed, type Block, type Item } from "@/lib/blocks";
import { SERVICES } from "@/content/services";
import { ARTICLES } from "@/content/blog";
import { PROJECTS } from "@/content/portfolio";
import { QuoteForm } from "@/components/site/quote-form";
import { ProjectCover } from "@/components/site/project-cover";
import { safeUrl } from "@/lib/blocks";

/**
 * Server-compatible renderer (no hooks). Responsive behaviour uses CSS container queries,
 * so the admin preview frames (desktop / tablet / mobile) behave like real viewports.
 */

const BG: Record<Block["style"]["bg"], { cls: string; dark: boolean }> = {
  paper: { cls: "bg-paper", dark: false },
  white: { cls: "bg-white", dark: false },
  violet: { cls: "bg-tint-violet", dark: false },
  brand: { cls: "bg-brand", dark: true },
  copper: { cls: "bg-copper", dark: true },
  indigo: { cls: "bg-indigo", dark: true },
  night: { cls: "hero-field grain relative", dark: true },
};
const SPACE = { sm: "py-10", md: "py-16 @3xl:py-20", lg: "py-24 @3xl:py-32" };
const HIDE = { none: "", mobile: "max-[47.99rem]:hidden", desktop: "@3xl:hidden" } as const;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): Item[] => (Array.isArray(v) ? (v as Item[]) : []);

function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    out.push(text.slice(last, m.index));
    const href = safeUrl(m[2]);
    out.push(href ? <a key={m.index} href={href} className="font-medium text-brand underline underline-offset-4">{m[1]}</a> : m[1]);
    last = (m.index ?? 0) + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

function Rich({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <div className="space-y-4 text-[17px] leading-8">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return <ul key={i} className="space-y-2">{lines.map((l, j) => (<li key={j} className="flex gap-3"><span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-brand" /><span><Inline text={l.slice(2)} /></span></li>))}</ul>;
        }
        const h = b.match(/^(#{2,3})\s+(.*)/);
        if (h) return h[1].length === 2 ? <h2 key={i} className="pt-4 text-3xl font-semibold">{h[2]}</h2> : <h3 key={i} className="pt-2 text-2xl font-semibold">{h[2]}</h3>;
        return <p key={i}><Inline text={b} /></p>;
      })}
    </div>
  );
}

function Cta({ href, label, dark }: { href: string; label: string; dark?: boolean }) {
  const h = safeUrl(href);
  if (!h || !label) return null;
  return (
    <Link href={h} className={`mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 font-medium transition-colors ${dark ? "bg-white text-night hover:bg-paper" : "bg-brand text-white hover:bg-brand-ink"}`}>
      {label} <ArrowUpRight size={18} />
    </Link>
  );
}

function Title({ text, dark }: { text: string; dark: boolean }) {
  return text ? <h2 className={`mb-10 max-w-3xl text-4xl font-semibold @3xl:text-5xl ${dark ? "" : "text-indigo"}`}>{text}</h2> : null;
}

function BlockView({ b, dark }: { b: Block; dark: boolean }) {
  const d = b.data;
  const items = arr(d.items);
  const card = dark ? "bg-white/10 ring-1 ring-white/15" : "bg-white ring-1 ring-line";
  switch (b.type) {
    case "hero":
      return (
        <div className="max-w-4xl">
          {str(d.eyebrow) && <p className="num mb-5 text-xs uppercase tracking-[0.22em] text-copper">{str(d.eyebrow)}</p>}
          <h1 className="text-[clamp(2.2rem,8cqw,5.5rem)] font-semibold">{str(d.title)}</h1>
          {str(d.text) && <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">{str(d.text)}</p>}
          <Cta href={str(d.ctaHref)} label={str(d.ctaLabel)} dark={dark} />
        </div>
      );
    case "heading": {
      const L = str(d.level) === "1" ? "h1" : str(d.level) === "3" ? "h3" : "h2";
      return <L className={`${L === "h3" ? "text-2xl" : "text-4xl @3xl:text-5xl"} font-semibold ${dark ? "" : "text-indigo"}`}>{str(d.text)}</L>;
    }
    case "text":
      return <div className="max-w-3xl"><Rich body={str(d.body)} /></div>;
    case "image":
      return str(d.src) ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={str(d.src)} alt={str(d.alt)} loading="lazy" className="w-full rounded-3xl" />
          {str(d.caption) && <figcaption className="mt-3 text-sm opacity-70">{str(d.caption)}</figcaption>}
        </figure>
      ) : null;
    case "gallery":
      return (
        <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-3">
          {items.filter((i) => i.src).map((i, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={k} src={i.src} alt={i.alt ?? ""} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          ))}
        </div>
      );
    case "video": {
      const e = videoEmbed(str(d.url));
      return e ? (
        <figure>
          <div className="aspect-video overflow-hidden rounded-3xl"><iframe src={e} title={str(d.caption) || "Vidéo"} loading="lazy" allowFullScreen className="size-full" /></div>
          {str(d.caption) && <figcaption className="mt-3 text-sm opacity-70">{str(d.caption)}</figcaption>}
        </figure>
      ) : null;
    }
    case "features":
      return (<><Title text={str(d.title)} dark={dark} /><ul className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">{items.map((i, k) => (<li key={k} className={`rounded-3xl p-7 ${card}`}><h3 className="text-xl font-semibold">{i.title}</h3><p className="mt-2 text-sm leading-relaxed opacity-75">{i.text}</p></li>))}</ul></>);
    case "process":
      return (<><Title text={str(d.title)} dark={dark} /><ol className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">{items.map((i, k) => (<li key={k} className={`rounded-3xl p-7 ${card}`}><span className="num text-5xl font-semibold text-brand">{k + 1}</span><h3 className="mt-3 font-semibold">{i.title}</h3><p className="mt-1 text-sm opacity-75">{i.text}</p></li>))}</ol></>);
    case "stats":
      return (<><Title text={str(d.title)} dark={dark} /><dl className="grid grid-cols-2 gap-4 @3xl:grid-cols-4">{items.filter((i) => i.value).map((i, k) => (<div key={k} className={`rounded-3xl p-6 ${card}`}><dd className="num text-4xl font-semibold text-brand">{i.value}</dd><dt className="mt-1 text-sm opacity-75">{i.label}</dt></div>))}</dl></>);
    case "table": {
      const head = str(d.head).split("|").map((x) => x.trim());
      const rows = str(d.rows).split("\n").filter(Boolean).map((r) => r.split("|").map((x) => x.trim()));
      return (<><Title text={str(d.title)} dark={dark} /><div className="overflow-x-auto rounded-3xl ring-1 ring-line"><table className="w-full min-w-[32rem] bg-white text-sm text-charcoal"><thead className="bg-tint-violet text-start text-indigo"><tr>{head.map((h, k) => (<th key={k} className="p-4 text-start font-semibold">{h}</th>))}</tr></thead><tbody>{rows.map((r, k) => (<tr key={k} className="border-t border-line">{r.map((c, j) => (<td key={j} className="p-4">{c}</td>))}</tr>))}</tbody></table></div></>);
    }
    case "faq":
      return (<><Title text={str(d.title)} dark={dark} /><div className="max-w-3xl divide-y divide-current/15 rounded-3xl px-6 ring-1 ring-current/15">{items.map((i, k) => (<details key={k} className="group py-5"><summary className="cursor-pointer list-none text-lg font-medium marker:hidden">{i.q}</summary><p className="mt-3 leading-relaxed opacity-80">{i.a}</p></details>))}</div></>);
    case "testimonials":
      return items.length ? (<><Title text={str(d.title)} dark={dark} /><ul className="grid gap-4 @3xl:grid-cols-2">{items.map((i, k) => (<li key={k} className={`rounded-3xl p-7 ${card}`}><blockquote className="text-lg leading-relaxed">« {i.quote} »</blockquote><p className="mt-4 text-sm font-semibold">{i.name}</p><p className="text-xs opacity-70">{i.role}</p></li>))}</ul></>) : null;
    case "pricing":
      return items.length ? (<><Title text={str(d.title)} dark={dark} /><ul className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">{items.map((i, k) => (<li key={k} className={`rounded-3xl p-7 ${card}`}><h3 className="font-semibold">{i.name}</h3><p className="num mt-2 text-3xl font-semibold text-brand">{i.price}</p><p className="text-xs opacity-70">{i.note}</p><ul className="mt-4 space-y-1.5 text-sm">{(i.features ?? "").split("\n").filter(Boolean).map((f, j) => (<li key={j}>✓ {f}</li>))}</ul></li>))}</ul></>) : null;
    case "cta":
      return (<div className="max-w-3xl"><h2 className="text-4xl font-semibold @3xl:text-6xl">{str(d.title)}</h2>{str(d.text) && <p className="mt-4 text-lg opacity-85">{str(d.text)}</p>}<Cta href={str(d.href)} label={str(d.label)} dark={true} /></div>);
    case "homehero":
      return (
        <div className="grid items-center gap-14 @5xl:grid-cols-12">
          <div className="@5xl:col-span-7">
            <p className="rise rise-1 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 py-1.5 pe-4 ps-1.5">
              <TunisiaFlag className="h-6 w-9 rounded-full object-cover" title="" />
              <span className="num text-xs uppercase tracking-[0.2em] text-white/80">{str(d.eyebrow)}</span>
            </p>
            <h1 className="rise rise-2 mt-7 text-[clamp(2.4rem,7cqw,6rem)] font-semibold">
              {str(d.line1)}<br />
              <span className="text-sun">{str(d.line2)}</span><br />
              <span className="stroke-text">{str(d.line3)}</span>
            </h1>
            {str(d.text) && <p className="rise rise-3 mt-8 max-w-xl text-lg leading-relaxed text-white/75">{str(d.text)}</p>}
            <div className="rise rise-4 mt-10 flex flex-wrap gap-3">
              {safeUrl(str(d.ctaHref)) && str(d.ctaLabel) && <Link href={safeUrl(str(d.ctaHref))} className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 font-medium transition-colors hover:bg-hot">{str(d.ctaLabel)} <ArrowUpRight size={18} className="rtl:-scale-x-100" /></Link>}
              {safeUrl(str(d.cta2Href)) && str(d.cta2Label) && <Link href={safeUrl(str(d.cta2Href))} className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-medium transition-colors hover:border-white hover:bg-white/5">{str(d.cta2Label)}</Link>}
            </div>
          </div>
          <div className="rise rise-3 relative @5xl:col-span-5">
            <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[#E70013]/30 blur-3xl" />
            <div className="drift relative rotate-3 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              <TunisiaFlag className="block w-full" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/15" />
            </div>
            {str(d.flagCaption) && (
              <div className="drift drift-b absolute -bottom-6 -start-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-night shadow-xl">
                <Image src="/brand/logo-mark.svg" alt="" width={20} height={28} className="h-7 w-auto invert" />
                <span className="whitespace-pre-line text-sm font-semibold leading-tight">{str(d.flagCaption)}</span>
              </div>
            )}
          </div>
        </div>
      );
    case "marquee": {
      const list = str(d.items).split("\n").map((x) => x.trim()).filter(Boolean);
      return (
        <div className="-my-4 overflow-hidden" aria-hidden="true">
          <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium">
            {[...list, ...list].map((a, i) => (<span key={i} className="flex items-center gap-10">{a}<span className="text-night/60">✦</span></span>))}
          </div>
        </div>
      );
    }
    case "tools":
      return (
        <>
          {str(d.eyebrow) && <p className="num text-xs uppercase tracking-[0.22em] text-copper">{str(d.eyebrow)}</p>}
          <h2 className="mb-10 mt-4 max-w-2xl text-4xl font-semibold @3xl:text-5xl">{str(d.title)}</h2>
          <ul className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
            {TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/outils-gratuits/${tool.slug}`} className={`group flex h-full min-h-44 flex-col justify-between rounded-3xl p-6 text-white transition-transform hover:-translate-y-1 ${tool.tone}`}>
                  <ArrowUpRight className="self-end" />
                  <div><h3 className="text-lg font-semibold">{tool.name}</h3><p className="mt-1 text-sm text-white/80">{tool.text}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      );
    case "services":
      return (
        <>
          <Title text={str(d.title)} dark={dark} />
          <ul className="grid gap-4 @3xl:grid-cols-6">
            {SERVICES.map((s, i) => (
              <li key={s.id} className={i === 0 || i === 3 ? "@3xl:col-span-4" : "@3xl:col-span-2"}>
                <Link href={`/services/${s.slugs.fr}`} className={`group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 ${s.tone.bg} ${s.tone.fg}`}>
                  <span className="num text-sm opacity-70">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="num pointer-events-none absolute -bottom-6 end-4 text-[9rem] font-semibold leading-none opacity-[0.12]">{i + 1}</span>
                  <div className="relative"><h3 className="text-2xl font-semibold">{s.fr.name}</h3><p className="mt-2 max-w-sm text-sm opacity-85">{s.fr.short}</p></div>
                  <ArrowUpRight className="absolute end-6 top-6" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      );
    case "portfolio": {
      const list = PROJECTS.filter((p) => p.verified);
      return list.length ? (<><Title text={str(d.title)} dark={dark} /><ul className="grid gap-5 @3xl:grid-cols-2">{list.map((p) => (<li key={p.slug}><Link href={`/portfolio/${p.slug}`}><div className="aspect-[4/3] overflow-hidden rounded-3xl"><ProjectCover project={p} /></div><h3 className="mt-3 text-xl font-semibold">{p.title}</h3></Link></li>))}</ul></>) : null;
    }
    case "related":
      return (<><Title text={str(d.title)} dark={dark} /><ul className="grid gap-4 @3xl:grid-cols-3">{ARTICLES.slice(0, 3).map((a) => (<li key={a.slug}><Link href={`/blog/${a.slug}`} className={`block h-full rounded-3xl p-6 ${card}`}><p className="num text-xs uppercase tracking-widest text-copper">{a.category}</p><h3 className="mt-2 text-lg font-semibold leading-snug">{a.title}</h3></Link></li>))}</ul></>);
    case "contact":
      return (<div className="max-w-2xl"><Title text={str(d.title)} dark={dark} />{str(d.text) && <p className="-mt-6 mb-8 opacity-80">{str(d.text)}</p>}<div className="text-charcoal"><Suspense fallback={null}><QuoteForm locale="fr" /></Suspense></div></div>);
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="@container">
      {blocks.map((b) => {
        const bg = BG[b.style.bg];
        return (
          <section key={b.id} data-block={b.type} className={`${bg.cls} ${bg.dark ? "text-white" : "text-charcoal"} ${HIDE[b.style.hide]}`}>
            <div className={`mx-auto max-w-6xl px-5 @3xl:px-8 ${SPACE[b.style.space]} ${b.style.align === "center" ? "text-center [&>*]:mx-auto" : ""}`}>
              <BlockView b={b} dark={bg.dark} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
