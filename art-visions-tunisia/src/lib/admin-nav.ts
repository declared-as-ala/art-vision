import { BarChart3, FileText, Globe, Image as ImageIcon, Inbox, Link2, Newspaper, Search, Settings, Shapes, Users, Wrench, History, Map, Replace, LayoutDashboard, Briefcase, Layers, KeyRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; keywords?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const ADMIN_NAV: NavGroup[] = [
  { label: "Vue d'ensemble", items: [{ href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, keywords: "overview dashboard accueil" }] },
  {
    label: "Contenu",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText, keywords: "landing page builder" },
      { href: "/admin/content/blog", label: "Articles de blog", icon: Newspaper, keywords: "blog articles catégories" },
      { href: "/admin/content/services", label: "Services", icon: Layers },
      { href: "/admin/content/portfolio", label: "Portfolio", icon: Briefcase },
      { href: "/admin/content/tools", label: "Outils gratuits", icon: Wrench },
      { href: "/admin/media", label: "Médiathèque", icon: ImageIcon, keywords: "images upload media" },
    ],
  },
  {
    label: "SEO",
    items: [
      { href: "/admin/seo", label: "Vue SEO & audits", icon: Search, keywords: "audit score" },
      { href: "/admin/seo/keywords", label: "Mots-clés", icon: KeyRound, keywords: "keywords cannibalisation" },
      { href: "/admin/seo/links", label: "Maillage interne", icon: Link2, keywords: "internal links orphelines" },
      { href: "/admin/seo/redirects", label: "Redirections", icon: Replace, keywords: "301 redirect" },
      { href: "/admin/seo/sitemap", label: "Sitemap & indexation", icon: Map, keywords: "sitemap noindex" },
    ],
  },
  { label: "Business", items: [{ href: "/admin/leads", label: "Demandes de devis", icon: Inbox, keywords: "leads contacts quote" }, { href: "/admin/analytics", label: "Analytique", icon: BarChart3, keywords: "analytics visites trafic performance" }] },
  {
    label: "Réglages",
    items: [
      { href: "/admin/settings", label: "Général", icon: Settings },
      { href: "/admin/settings/users", label: "Utilisateurs & rôles", icon: Users },
      { href: "/admin/settings/activity", label: "Journal d'activité", icon: History },
    ],
  },
];

export const FLAT_NAV = ADMIN_NAV.flatMap((g) => g.items);
export const ICONS = { BarChart3, Globe, Shapes };

const LABELS: Record<string, string> = Object.fromEntries(FLAT_NAV.map((n) => [n.href, n.label]));
LABELS["/admin/pages/new"] = "Nouvelle page";
LABELS["/admin/content"] = "Contenu";
LABELS["/admin/settings"] = "Réglages";

export function breadcrumbs(pathname: string): { href: string; label: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  const out: { href: string; label: string }[] = [];
  let acc = "";
  for (const p of parts) {
    acc += "/" + p;
    const label = LABELS[acc] ?? (p.length > 16 ? "Édition" : p.charAt(0).toUpperCase() + p.slice(1));
    out.push({ href: acc, label: acc === "/admin" ? "Admin" : label });
  }
  return out;
}
