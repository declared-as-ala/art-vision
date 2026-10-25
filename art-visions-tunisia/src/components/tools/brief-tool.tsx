"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STYLES = ["Minimaliste", "Élégant", "Moderne", "Traditionnel / artisanal", "Ludique", "Premium"];

export function BriefTool() {
  const [v, setV] = useState({ name: "", activity: "", audience: "", values: "", colors: "", avoid: "", usage: "" });
  const [styles, setStyles] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const toggle = (s: string) => setStyles((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]));

  const brief = [
    `BRIEF LOGO — ${v.name || "[Nom de la marque]"}`,
    `Activité : ${v.activity || "—"}`,
    `Clientèle cible : ${v.audience || "—"}`,
    `Valeurs / ce que la marque doit évoquer : ${v.values || "—"}`,
    `Style souhaité : ${styles.join(", ") || "—"}`,
    `Couleurs envisagées : ${v.colors || "—"}`,
    `À éviter : ${v.avoid || "—"}`,
    `Supports principaux : ${v.usage || "—"}`,
  ].join("\n");

  async function copy() {
    await navigator.clipboard?.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const fields: [keyof typeof v, string, boolean][] = [
    ["name", "Nom de la marque", false], ["activity", "Activité", false], ["audience", "Clientèle cible", false],
    ["values", "Valeurs / émotion à transmettre", true], ["colors", "Couleurs envisagées", false], ["avoid", "À éviter", false], ["usage", "Supports principaux (enseigne, menu, réseaux…)", false],
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-line">
        {fields.map(([k, label, area]) => (
          <div key={k} className="grid gap-1.5">
            <Label htmlFor={k}>{label}</Label>
            {area ? <Textarea id={k} rows={3} value={v[k]} onChange={set(k)} /> : <Input id={k} value={v[k]} onChange={set(k)} />}
          </div>
        ))}
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Style</legend>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (<button type="button" key={s} onClick={() => toggle(s)} aria-pressed={styles.includes(s)} className={`rounded-full px-3.5 py-1.5 text-sm ${styles.includes(s) ? "bg-copper text-white" : "bg-tint-copper text-ink-soft"}`}>{s}</button>))}
          </div>
        </fieldset>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <pre className="whitespace-pre-wrap rounded-3xl bg-night p-6 text-sm leading-7 text-white/90">{brief}</pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white hover:bg-brand">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copié" : "Copier le brief"}</button>
          <Link href={`/contact?service=creation-logo-tunisie&brief=${encodeURIComponent(brief)}`} className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-ink">Envoyer à Art Visions</Link>
        </div>
      </div>
    </div>
  );
}
