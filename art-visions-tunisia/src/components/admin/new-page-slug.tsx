"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const base = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
/** Full normalisation (used when deriving from the title and on blur). */
export const slugify = (s: string) => base(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
/** Lenient normalisation while typing: keeps hyphens so you can type them. */
const typing = (s: string) => base(s).replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-").slice(0, 80);

export function NewPageSlug({ prefix = "art-visions.tn/" }: { prefix?: string }) {
  const [slug, setSlug] = useState("");
  const [touched, setTouched] = useState(false);
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required minLength={2} onChange={(e) => { if (!touched) setSlug(slugify(e.target.value)); }} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="slug">URL (slug)</Label>
        <div className="flex items-center rounded-lg border border-input bg-white pl-3 text-sm">
          <span className="num text-soft">{prefix}</span>
          <input id="slug" name="slug" required value={slug} onChange={(e) => { setTouched(true); setSlug(typing(e.target.value)); }} onBlur={() => setSlug((v) => slugify(v))} className="h-10 flex-1 bg-transparent px-1 outline-none" />
        </div>
      </div>
    </>
  );
}
