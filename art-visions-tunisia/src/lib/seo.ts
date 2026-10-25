import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/** Canonical + hreflang block. Only pass `ar`/`fr` when a real translation exists. */
export function alternates(paths: { fr?: string; ar?: string }, self: "fr" | "ar"): Metadata["alternates"] {
  const abs = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
  const languages: Record<string, string> = {};
  if (paths.fr !== undefined) languages["fr-TN"] = abs(paths.fr);
  if (paths.ar !== undefined) languages["ar-TN"] = abs(paths.ar);
  if (paths.fr !== undefined) languages["x-default"] = abs(paths.fr);
  return { canonical: abs(paths[self] ?? "/"), ...(paths.fr !== undefined && paths.ar !== undefined ? { languages } : {}) };
}
