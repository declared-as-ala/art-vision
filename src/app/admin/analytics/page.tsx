"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3, Users, Eye, MousePointerClick, FileText, MessageCircle, Wand2,
  Printer, Download, RefreshCw, Loader2, Globe, Monitor, Smartphone, Tablet, TrendingUp,
} from "lucide-react";

type Range = "today" | "7d" | "30d" | "month" | "lastmonth" | "custom";
const card = "rounded-2xl p-4 border bg-white/[0.02] backdrop-blur-sm";

function flag(code?: string) {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const now = new Date();
    const d = (x: Date) => x.toISOString().slice(0, 10);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (range === "custom" && from && to) return `from=${from}&to=${to}`;
    if (range === "today") return `from=${d(now)}&to=${d(now)}`;
    if (range === "7d") { const f = new Date(now); f.setDate(f.getDate() - 6); return `from=${d(f)}&to=${d(now)}`; }
    if (range === "30d") { const f = new Date(now); f.setDate(f.getDate() - 29); return `from=${d(f)}&to=${d(now)}`; }
    if (range === "month") return `from=${d(startOfMonth)}&to=${d(now)}`;
    if (range === "lastmonth") { const f = new Date(now.getFullYear(), now.getMonth() - 1, 1); const t = new Date(now.getFullYear(), now.getMonth(), 0); return `from=${d(f)}&to=${d(t)}`; }
    return "";
  }, [range, from, to]);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`/api/admin/analytics?${params}`).then((x) => x.json()).catch(() => ({}));
    if (r.success) setData(r);
    setLoading(false);
  }, [params]);
  useEffect(() => { load(); }, [load]);

  const presets = data?.presets;
  const rg = data?.range;
  const active = !!data && (presets?.total ?? 0) === 0 ? false : true;

  const RANGES: [Range, string][] = [["today", "Aujourd'hui"], ["7d", "7 jours"], ["30d", "30 jours"], ["month", "Ce mois"], ["lastmonth", "Mois dernier"], ["custom", "Personnalisé"]];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white flex items-center gap-2"><BarChart3 className="text-brand-magenta" size={24} /> Analytique</h1>
          <p className="text-xs text-white/50 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${active ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
            {active ? "Suivi analytique actif (anonyme, après consentement)" : "Aucune donnée — le suivi démarre après acceptation des cookies."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-brand-magenta/40 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"><RefreshCw size={13} /> Actualiser</button>
          <a href={`/api/admin/analytics?${params}&format=csv`} className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"><Download size={13} /> CSV</a>
        </div>
      </div>

      {/* Range selector */}
      <div className="flex flex-wrap gap-2 items-center">
        {RANGES.map(([id, label]) => (
          <button key={id} onClick={() => setRange(id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${range === id ? "bg-brand-magenta border-brand-magenta text-white" : "border-white/10 text-white/60 hover:text-white"}`}>{label}</button>
        ))}
        {range === "custom" && (
          <span className="flex items-center gap-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-brand-navy border border-brand-purple/30 rounded-lg px-2 py-1.5 text-xs text-white" />
            <span className="text-white/40">→</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-brand-navy border border-brand-purple/30 rounded-lg px-2 py-1.5 text-xs text-white" />
          </span>
        )}
      </div>

      {loading ? <div className="py-20 text-center text-white/40"><Loader2 className="animate-spin mx-auto" /></div> : !data ? (
        <div className="py-20 text-center text-white/40 text-sm">Impossible de charger les données.</div>
      ) : (
        <>
          {/* Visitor preset cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat icon={Users} label="Aujourd'hui" value={presets.today} color="text-brand-magenta" />
            <Stat icon={Users} label="7 derniers jours" value={presets.last7} color="text-brand-purple" />
            <Stat icon={Users} label="Ce mois-ci" value={presets.thisMonth} color="text-brand-orange" />
            <Stat icon={Users} label="Total visiteurs" value={presets.total} color="text-green-400" />
          </div>

          {/* Range KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat icon={Eye} label="Pages vues" value={rg.pageViews} />
            <Stat icon={TrendingUp} label="Sessions" value={rg.sessions} />
            <Stat icon={Users} label="Nouveaux" value={rg.newVisitors} />
            <Stat icon={RefreshCw} label="Récurrents" value={rg.returningVisitors} />
          </div>

          {/* Conversions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Stat icon={FileText} label="Devis" value={rg.conversions.quoteRequests} color="text-brand-orange" small />
            <Stat icon={Printer} label="Devis impression" value={rg.conversions.printQuotes} color="text-brand-orange" small />
            <Stat icon={MessageCircle} label="Contacts" value={rg.conversions.contacts} small />
            <Stat icon={Wand2} label="Outils" value={rg.conversions.toolGenerations} small />
            <Stat icon={MousePointerClick} label="Clics WhatsApp" value={rg.conversions.whatsappClicks} small />
            <Stat icon={MousePointerClick} label="Clics CTA" value={rg.conversions.ctaClicks} small />
          </div>

          {/* Daily chart */}
          <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15">
            <h3 className="text-sm font-sora font-bold text-white mb-4">Visiteurs par jour</h3>
            <DailyChart daily={rg.daily} />
          </div>

          {/* Breakdowns */}
          <div className="grid lg:grid-cols-2 gap-5">
            <Panel title="Pages les plus visitées">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-white/5">
                  {rg.topPages.slice(0, 8).map((p: any) => (
                    <tr key={p.path}><td className="py-2 text-white/75 truncate max-w-[260px]">{p.path}</td><td className="py-2 text-right text-white/50">{p.visitors} vis.</td><td className="py-2 text-right text-white font-semibold w-16">{p.views}</td></tr>
                  ))}
                  {!rg.topPages.length && <tr><td className="py-4 text-white/30">Aucune donnée.</td></tr>}
                </tbody>
              </table>
            </Panel>
            <Panel title="Pays">
              <BarList items={rg.countries.map((c: any) => ({ label: `${flag(c.name)} ${c.name}`, count: c.count }))} icon={<Globe size={14} />} />
            </Panel>
            <Panel title="Appareils">
              <BarList items={rg.devices.map((d: any) => ({ label: d.name, count: d.count, icon: d.name === "mobile" ? <Smartphone size={13} /> : d.name === "tablet" ? <Tablet size={13} /> : <Monitor size={13} /> }))} />
            </Panel>
            <Panel title="Navigateurs">
              <BarList items={rg.browsers.map((b: any) => ({ label: b.name, count: b.count }))} />
            </Panel>
            <Panel title="Sources de trafic">
              <BarList items={rg.sources.map((s: any) => ({ label: SOURCE_LABEL[s.name] || s.name, count: s.count }))} />
            </Panel>
            <Panel title="Villes">
              <BarList items={rg.cities.map((c: any) => ({ label: c.name, count: c.count }))} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

const SOURCE_LABEL: Record<string, string> = { direct: "Direct", organic: "Recherche Google", social: "Réseaux sociaux", referral: "Référents", paid: "Campagne payante", email: "E-mail" };

function Stat({ icon: Icon, label, value, color = "text-white", small }: any) {
  return (
    <div className={card + " border-brand-purple/15"}>
      <div className={`inline-flex p-2 rounded-lg bg-white/5 mb-2 ${color}`}><Icon size={small ? 14 : 17} /></div>
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">{label}</span>
      <span className={`${small ? "text-2xl" : "text-3xl"} font-sora font-black text-white`}>{value ?? 0}</span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15"><h3 className="text-sm font-sora font-bold text-white mb-3">{title}</h3>{children}</div>;
}

function BarList({ items, icon }: { items: { label: string; count: number; icon?: React.ReactNode }[]; icon?: React.ReactNode }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (!items.length) return <p className="text-xs text-white/30 py-2">Aucune donnée.</p>;
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="text-[11px] text-white/70 w-40 truncate flex items-center gap-1.5">{it.icon || icon} {it.label}</span>
          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-purple to-brand-magenta" style={{ width: `${(it.count / max) * 100}%` }} /></div>
          <span className="text-[11px] text-white font-semibold w-8 text-right">{it.count}</span>
        </div>
      ))}
    </div>
  );
}

function DailyChart({ daily }: { daily: { date: string; visitors: number; views: number }[] }) {
  if (!daily?.length) return <p className="text-xs text-white/30">Aucune donnée.</p>;
  const max = Math.max(1, ...daily.map((d) => d.views));
  const w = 100, h = 40;
  const pts = daily.map((d, i) => `${(i / Math.max(1, daily.length - 1)) * w},${h - (d.visitors / max) * h}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-28">
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D72888" stopOpacity="0.4" /><stop offset="100%" stopColor="#D72888" stopOpacity="0" /></linearGradient></defs>
        {daily.map((d, i) => <rect key={i} x={(i / daily.length) * w} y={h - (d.views / max) * h} width={w / daily.length - 0.3} height={(d.views / max) * h} fill="#6C2BD9" opacity="0.35" />)}
        <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#ag)" />
        <polyline points={pts} fill="none" stroke="#D72888" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="flex justify-between text-[9px] text-white/30 mt-1">
        <span>{daily[0]?.date.slice(5)}</span>
        <span className="text-white/50">Visiteurs (ligne) · Pages vues (barres)</span>
        <span>{daily[daily.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
