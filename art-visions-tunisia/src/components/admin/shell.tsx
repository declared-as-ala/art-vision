"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, LogOut, Menu, Search } from "lucide-react";
import { ADMIN_NAV, FLAT_NAV, breadcrumbs } from "@/lib/admin-nav";
import { logoutAction } from "@/app/(admin)/admin/actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SB_KEY = "avtn-sidebar";
const subscribeSb = (cb: () => void) => { window.addEventListener("storage", cb); window.addEventListener(SB_KEY, cb); return () => { window.removeEventListener("storage", cb); window.removeEventListener(SB_KEY, cb); }; };
const readSb = () => { try { return localStorage.getItem(SB_KEY) === "1"; } catch { return false; } };

type U = { name: string; email: string; role: string };

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));
  return (
    <nav aria-label="Navigation admin" className="space-y-5 px-3 py-4">
      {ADMIN_NAV.map((g) => (
        <div key={g.label}>
          {!collapsed && <p className="num mb-1.5 px-3 text-[10px] uppercase tracking-[0.18em] text-soft">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map((n) => {
              const on = active(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={onNavigate}
                    title={collapsed ? n.label : undefined}
                    aria-current={on ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${on ? "bg-indigo text-white" : "text-charcoal/80 hover:bg-tint-violet"} ${collapsed ? "justify-center" : ""}`}
                  >
                    <n.icon size={17} className="shrink-0" />
                    {!collapsed && <span className="truncate">{n.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Palette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const actions = useMemo(
    () => [
      ...FLAT_NAV.map((n) => ({ label: n.label, href: n.href, hint: "Aller à", kw: n.keywords ?? "" })),
      { label: "Nouvelle page", href: "/admin/pages/new", hint: "Action", kw: "créer page landing" },
      { label: "Voir le site public", href: "/", hint: "Action", kw: "site front" },
    ],
    [],
  );
  const results = actions.filter((a) => (a.label + " " + a.kw).toLowerCase().includes(q.toLowerCase()));
  const go = (href: string) => { setOpen(false); setQ(""); router.push(href); };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[20%] translate-y-0 gap-0 p-0 sm:max-w-lg" showCloseButton={false}>
        <DialogTitle className="sr-only">Palette de commandes</DialogTitle>
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
            if (e.key === "Enter" && results[idx]) go(results[idx].href);
          }}
          placeholder="Rechercher une page, une action…"
          className="w-full border-b border-line bg-transparent px-4 py-4 text-sm outline-none"
          aria-label="Rechercher"
        />
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {results.map((r, i) => (
            <li key={r.href + r.label} role="option" aria-selected={i === idx}>
              <button onClick={() => go(r.href)} onMouseEnter={() => setIdx(i)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm ${i === idx ? "bg-tint-violet" : ""}`}>
                {r.label}<span className="num text-[10px] uppercase tracking-widest text-soft">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-soft">Aucun résultat</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function AdminShell({ user, newLeads, children }: { user: U; newLeads: number; children: React.ReactNode }) {
  const path = usePathname();
  const collapsed = useSyncExternalStore(subscribeSb, readSb, () => false);
  const [drawer, setDrawer] = useState(false);
  const [pal, setPal] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((v) => !v); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const toggle = () => { try { localStorage.setItem(SB_KEY, collapsed ? "0" : "1"); } catch { /* ignore */ } window.dispatchEvent(new Event(SB_KEY)); };
  const crumbs = breadcrumbs(path);
  const builder = /^\/admin\/pages\/[^/]+$/.test(path) && !path.endsWith("/new");

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-e border-line bg-white transition-[width] duration-200 md:flex ${collapsed ? "w-[68px]" : "w-64"}`}>
        <div className={`flex h-14 items-center border-b border-line px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/brand/logo-mark.svg" alt="" width={20} height={28} className="h-6 w-auto invert" />
            {!collapsed && <span className="text-sm font-semibold tracking-tight">Art Visions <span className="num text-[10px] text-soft">ADMIN</span></span>}
          </Link>
          {!collapsed && <button onClick={toggle} aria-label="Réduire le menu" className="rounded-md p-1.5 text-soft hover:bg-tint-violet"><ChevronLeft size={16} /></button>}
        </div>
        <div className="flex-1 overflow-y-auto" data-lenis-prevent><NavList collapsed={collapsed} /></div>
        {collapsed && <button onClick={toggle} aria-label="Développer le menu" className="m-3 flex justify-center rounded-md p-2 text-soft hover:bg-tint-violet"><ChevronRight size={16} /></button>}
      </aside>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-line"><SheetTitle>Art Visions Admin</SheetTitle></SheetHeader>
          <div className="overflow-y-auto"><NavList onNavigate={() => setDrawer(false)} /></div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur">
          <button onClick={() => setDrawer(true)} aria-label="Ouvrir le menu" className="rounded-md p-2 hover:bg-tint-violet md:hidden"><Menu size={18} /></button>
          <ol aria-label="Fil d'Ariane" className="hidden min-w-0 items-center gap-1.5 text-sm text-soft sm:flex">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === crumbs.length - 1 ? <span className="truncate font-medium text-charcoal">{c.label}</span> : <Link href={c.href} className="hover:text-charcoal">{c.label}</Link>}
              </li>
            ))}
          </ol>
          <div className="ms-auto flex items-center gap-2">
            <button onClick={() => setPal(true)} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-soft hover:border-brand">
              <Search size={15} /><span className="hidden sm:inline">Rechercher</span><kbd className="num hidden rounded bg-white px-1.5 text-[10px] ring-1 ring-line sm:inline">Ctrl K</kbd>
            </button>
            <Link href="/admin/leads" aria-label={`${newLeads} nouvelle(s) demande(s)`} className="relative rounded-lg p-2 hover:bg-tint-violet">
              <Bell size={18} />
              {newLeads > 0 && <span className="num absolute -end-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">{newLeads}</span>}
            </Link>
            <div className="flex items-center gap-2 border-s border-line ps-3">
              <div className="hidden text-end leading-tight sm:block"><p className="text-sm font-medium">{user.name}</p><p className="num text-[10px] uppercase text-soft">{user.role}</p></div>
              <form action={logoutAction}><button aria-label="Se déconnecter" title="Se déconnecter" className="rounded-lg p-2 hover:bg-tint-violet"><LogOut size={17} /></button></form>
            </div>
          </div>
        </header>
        <main className={`min-w-0 flex-1 ${builder ? "" : "mx-auto w-full max-w-7xl p-5 sm:p-8"}`}>{children}</main>
      </div>
      <Palette open={pal} setOpen={setPal} />
    </div>
  );
}
