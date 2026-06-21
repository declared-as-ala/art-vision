import React from "react";
import prisma from "@/lib/prisma";
import { Wand2, Sparkles, FileText, CreditCard, QrCode, PenTool, Image as ImageIcon, Calculator, Users, TrendingUp, Trophy } from "lucide-react";
import { tools } from "@/lib/tools";
import ToolsClient from "./ToolsClient";

export const revalidate = 5;

const labelFor = (slug: string) => tools.find((t) => t.slug === slug)?.title || slug;

export default async function AdminToolsPage() {
  let byType: { toolType: string; _count: { _all: number } }[] = [];
  let totalSubs = 0, leads = 0, withConsent = 0, generatedCV = 0, generatedCard = 0;
  let recent: any[] = [];

  try {
    [byType, totalSubs, leads, withConsent, generatedCV, generatedCard, recent] = await Promise.all([
      prisma.toolSubmission.groupBy({ by: ["toolType"], _count: { _all: true } }) as any,
      prisma.toolSubmission.count(),
      prisma.toolSubmission.count({ where: { NOT: { email: null } } }),
      prisma.toolSubmission.count({ where: { consentMarketing: true } }),
      prisma.generatedCV.count(),
      prisma.generatedBusinessCard.count(),
      prisma.toolSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    ]);
  } catch (e) {
    console.error("Admin tools stats error:", e);
  }

  const countOf = (slug: string) => byType.find((b) => b.toolType === slug)?._count._all || 0;
  const totalGenerations = totalSubs + generatedCV + generatedCard;
  const captureRate = totalSubs > 0 ? Number(((withConsent / totalSubs) * 100).toFixed(1)) : 0;
  const mostUsed = [...byType].sort((a, b) => b._count._all - a._count._all)[0];

  const cards = [
    { name: "Générations totales", count: totalGenerations, icon: Sparkles, color: "text-brand-magenta", bg: "bg-brand-magenta/10", border: "border-brand-magenta/20" },
    { name: "CV créés", count: generatedCV + countOf("cv-gratuit"), icon: FileText, color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/20" },
    { name: "Cartes de visite", count: generatedCard + countOf("carte-de-visite-gratuite"), icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "QR codes", count: countOf("generateur-qr-code"), icon: QrCode, color: "text-brand-magenta", bg: "bg-brand-magenta/10", border: "border-brand-magenta/20" },
    { name: "Briefs logo", count: countOf("generateur-brief-logo"), icon: PenTool, color: "text-brand-orange", bg: "bg-brand-orange/10", border: "border-brand-orange/20" },
    { name: "Flyers créés", count: countOf("creer-flyer"), icon: ImageIcon, color: "text-brand-orange", bg: "bg-brand-orange/10", border: "border-brand-orange/20" },
    { name: "Devis impression", count: countOf("calculateur-impression"), icon: Calculator, color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/20" },
    { name: "Leads collectés", count: leads, icon: Users, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wand2 size={16} className="text-brand-magenta" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-magenta">Outils Gratuits</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-white leading-tight">Performance des outils</h2>
          <p className="text-xs text-white/40">Générations, leads collectés et conversion de vos outils gratuits.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs">
            <span className="text-white/50">Taux de capture : </span>
            <strong className="text-green-400">{captureRate}%</strong>
          </div>
          {mostUsed && (
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <Trophy size={13} className="text-brand-orange" />
              <span className="text-white/50">Top : </span>
              <strong className="text-white">{labelFor(mostUsed.toolType)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`rounded-2xl p-5 border ${c.border} bg-white/[0.02] backdrop-blur-sm`}>
              <div className={`inline-flex p-2.5 rounded-xl ${c.bg} mb-3`}>
                <Icon size={17} className={c.color} />
              </div>
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1">{c.name}</span>
              <span className="text-3xl font-sora font-black text-white">{c.count}</span>
            </div>
          );
        })}
      </div>

      {/* Conversion strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2">Leads avec consentement</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-sora font-black text-green-400">{withConsent}</span>
            <span className="text-xs text-white/40 mb-1.5">/ {totalSubs} soumissions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-400 mt-3"><TrendingUp size={12} /> Prospects exploitables</div>
        </div>
        <div className="lg:col-span-2 glassmorphism rounded-2xl p-5 border border-brand-purple/15">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-3">Répartition par outil</span>
          <div className="space-y-2">
            {tools.map((t) => {
              const c = countOf(t.slug);
              const pct = totalSubs > 0 ? (c / totalSubs) * 100 : 0;
              return (
                <div key={t.slug} className="flex items-center gap-3">
                  <span className="text-[11px] text-white/60 w-44 shrink-0 truncate">{t.title}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-purple to-brand-magenta" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-white/70 font-semibold w-8 text-right">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submissions manager */}
      <ToolsClient initial={JSON.parse(JSON.stringify(recent))} />
    </div>
  );
}
