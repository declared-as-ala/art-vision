import React from "react";
import prisma from "@/lib/prisma";
import {
  ClipboardList,
  MessageSquare,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  Users,
} from "lucide-react";

export const revalidate = 10;

export default async function AdminDashboardPage() {
  let stats = {
    devis: 0,
    contacts: 0,
    cvs: 0,
    cards: 0,
    visitors: 0,
    visitorsThisWeek: 0,
    conversion: 0,
  };

  let recentQuotes: any[] = [];

  try {
    stats.devis = await prisma.quoteRequest.count();
    stats.contacts = await prisma.contactMessage.count();
    stats.cvs = await prisma.generatedCV.count();
    stats.cards = await prisma.generatedBusinessCard.count();

    recentQuotes = await prisma.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Real 30-day page views from the DB
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const [views30, views7] = await Promise.all([
      prisma.pageView.aggregate({
        _sum: { count: true },
        where: { date: { gte: thirtyDaysAgo } },
      }),
      prisma.pageView.aggregate({
        _sum: { count: true },
        where: { date: { gte: sevenDaysAgo } },
      }),
    ]);

    stats.visitors = views30._sum.count ?? 0;
    stats.visitorsThisWeek = views7._sum.count ?? 0;

    if (stats.visitors > 0) {
      stats.conversion = Number(((stats.devis / stats.visitors) * 100).toFixed(2));
    }
  } catch (error) {
    console.error("Error reading dashboard stats:", error);
  }

  const statCards = [
    {
      name: "Demandes de Devis",
      count: stats.devis,
      icon: ClipboardList,
      gradient: "from-brand-orange/20 to-brand-orange/5",
      border: "border-brand-orange/20",
      iconColor: "text-brand-orange",
      iconBg: "bg-brand-orange/10",
      badge: "+12% ce mois",
    },
    {
      name: "Messages Contact",
      count: stats.contacts,
      icon: MessageSquare,
      gradient: "from-brand-magenta/20 to-brand-magenta/5",
      border: "border-brand-magenta/20",
      iconColor: "text-brand-magenta",
      iconBg: "bg-brand-magenta/10",
      badge: "Actif",
    },
    {
      name: "CVs Générés",
      count: stats.cvs,
      icon: FileText,
      gradient: "from-brand-purple/20 to-brand-purple/5",
      border: "border-brand-purple/20",
      iconColor: "text-brand-purple",
      iconBg: "bg-brand-purple/10",
      badge: "Gratuit",
    },
    {
      name: "Cartes de Visite",
      count: stats.cards,
      icon: CreditCard,
      gradient: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      badge: "Gratuit",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-magenta" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-magenta">
              Vue d'ensemble
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-white leading-tight">
            Tableau de Bord
          </h2>
          <p className="text-xs text-white/40">
            Statistiques en temps réel de votre activité Art Vision.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm">
          <Clock size={13} className="text-brand-magenta" />
          <span className="text-white/60">
            Mis à jour : <strong className="text-white">À l'instant</strong>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border ${stat.border} bg-gradient-to-br ${stat.gradient} backdrop-blur-sm group hover:-translate-y-0.5 transition-all duration-300`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.02] rounded-2xl" />

              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon size={18} className={stat.iconColor} />
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${stat.border} ${stat.iconColor} bg-white/5`}>
                  {stat.badge}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1">
                  {stat.name}
                </span>
                <span className="text-4xl font-sora font-black text-white">
                  {stat.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Conversion Rate */}
        <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-3">
              Taux de conversion
            </span>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-sora font-black text-brand-orange">
                {stats.conversion}
              </span>
              <span className="text-2xl font-sora font-black text-brand-orange/60 mb-1">%</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed mt-2">
              Visiteurs uniques ayant formulé une demande de devis.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-400 bg-green-500/10 border border-green-500/15 px-3 py-2.5 rounded-xl font-semibold">
            <TrendingUp size={13} />
            <span>Croissance stable cette semaine</span>
          </div>
        </div>

        {/* Visitors */}
        <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-3">
              Visiteurs uniques (30j)
            </span>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-sora font-black text-brand-purple">
                {stats.visitors.toLocaleString("fr-FR")}
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed mt-2">
              Pages vues réelles ces 30 derniers jours.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-brand-purple bg-brand-purple/10 border border-brand-purple/15 px-3 py-2.5 rounded-xl font-semibold">
            <Users size={13} />
            <span>{stats.visitorsThisWeek.toLocaleString("fr-FR")} pages vues cette semaine</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 space-y-3">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block">
            Accès rapide
          </span>
          {[
            { label: "Voir les devis reçus", href: "/admin/quotes", color: "text-brand-orange" },
            { label: "Gérer le portfolio", href: "/admin/portfolio", color: "text-brand-magenta" },
            { label: "Publier un article", href: "/admin/blog", color: "text-brand-purple" },
            { label: "Paramètres du site", href: "/admin/settings", color: "text-white/60" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between text-xs font-semibold ${link.color} hover:brightness-125 transition py-2 border-b border-white/5 last:border-0`}
            >
              <span>{link.label}</span>
              <ArrowUpRight size={13} className="opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* Recent Quotes Table */}
      <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-sora font-bold text-base text-white">
            Dernières demandes de devis
          </h3>
          <a
            href="/admin/quotes"
            className="flex items-center gap-1 text-[10px] font-semibold text-brand-magenta hover:text-brand-magenta/80 transition"
          >
            <span>Voir tout</span>
            <ArrowUpRight size={11} />
          </a>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-purple/15 text-white/35 uppercase font-bold text-[10px] tracking-widest">
                <th className="pb-3 pr-4">Prospect / Client</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Budget</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-white/30 text-xs">
                    <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
                    Aucune demande reçue pour le moment.
                  </td>
                </tr>
              ) : (
                recentQuotes.map((q) => {
                  const formattedDate = new Date(q.createdAt).toLocaleDateString(
                    "fr-FR",
                    { day: "2-digit", month: "2-digit", year: "numeric" }
                  );
                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-white/[0.03] transition group"
                    >
                      <td className="py-3.5 pr-4">
                        <strong className="text-white block group-hover:text-brand-magenta transition">
                          {q.name}
                        </strong>
                        <span className="text-[10px] text-white/35 block">
                          {q.company || "Individuel"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-white/70 font-medium">
                        {q.service}
                      </td>
                      <td className="py-3.5 pr-4 text-brand-orange font-bold">
                        {q.budget}
                      </td>
                      <td className="py-3.5 pr-4 text-white/50">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-[9px] bg-brand-purple/20 text-white/80 px-2.5 py-1 rounded-full border border-brand-purple/30 font-bold uppercase tracking-wider">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
