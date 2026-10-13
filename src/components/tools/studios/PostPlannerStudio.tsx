"use client";

import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import { Download, Calendar, Copy, Check, Sparkles, Filter } from "lucide-react";

interface PostIdea {
  date: string;
  dayName: string;
  platform: string;
  theme: string;
  format: string;
  idea: string;
  hook: string;
  cta: string;
}

export default function PostPlannerStudio() {
  const [business, setBusiness] = useState("Boutique de prêt-à-porter & accessoires");
  const [objective, setObjective] = useState<"ventes" | "visibilite" | "engagement" | "confiance">("ventes");
  const [frequency, setFrequency] = useState<number>(3); // 2, 3 or 5 posts per week
  const [periodWeeks, setPeriodWeeks] = useState<number>(4); // 2, 4 or 8 weeks
  const [platforms, setPlatforms] = useState<string>("Instagram, Facebook, TikTok");

  const rows = useMemo(() => {
    const list: PostIdea[] = [];
    const platformArr = platforms.split(/[,/]/).map((p) => p.trim()).filter(Boolean);
    const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    // Contextual ideas depending on objective and business
    const strategicThemes: Record<string, { theme: string; format: string; hook: string; template: string; cta: string }[]> = {
      ventes: [
        {
          theme: "Focus Produit Phare",
          format: "Carrousel photos",
          hook: "3 raisons d'adopter cette pièce cette semaine 👀",
          template: `Zoom sur notre article star chez ${business}. Présentation des finitions, coupe et matières en gros plan.`,
          cta: "Lien en bio pour commander ou réserver en boutique !",
        },
        {
          theme: "Offre Flash / Nouveauté",
          format: "Reel vidéo",
          hook: "Alerte arrivage : ils sont enfin de retour 🔥",
          template: `Unboxing dynamique ou essayage rapide pour ${business}. Présentation du stock limité.`,
          cta: "Dispo en quantité limitée ! Envoyez 'INFO' en DM pour recevoir le lien direct.",
        },
        {
          theme: "Preuve Sociale & Avis",
          format: "Post citation",
          hook: "Ce que nos clients en disent le mieux ⭐⭐⭐⭐⭐",
          template: `Partage d'un avis client enthousiaste sur ${business} avec mise en avant du produit acheté.`,
          cta: "Rejoignez ceux qui nous font confiance. Lien dans notre bio !",
        },
        {
          theme: "Avant / Après ou Lookbook",
          format: "Carrousel multipages",
          hook: "Comment porter cette pièce de 3 façons différentes ?",
          template: `Guide de style pratique adapté aux clients de ${business} pour déclencher le coup de cœur.`,
          cta: "Quel look préférez-vous ? Répondez en commentaire !",
        },
        {
          theme: "Promotion temporaire",
          format: "Story ou Post carré",
          hook: "Ce week-end seulement : -15% sur la sélection ⏳",
          template: `Rappel de l'offre spéciale en cours chez ${business} avec compte à rebours.`,
          cta: "Profitez-en avant dimanche soir en cliquant sur le lien en bio.",
        },
      ],
      visibilite: [
        {
          theme: "Conseil d'Expert / Astuce",
          format: "Carrousel éducatif",
          hook: "L'erreur que 90% des personnes font sans le savoir ❌",
          template: `Partage d'un savoir-faire professionnel ou astuce d'entretien pour ${business}.`,
          cta: "Enregistrez ce post pour l'avoir sous la main plus tard 📌",
        },
        {
          theme: "Dans les Coulisses (Behind The Scenes)",
          format: "Reel court",
          hook: "Une journée type dans notre atelier 🎬",
          template: `Immersion authentique et humaine dans le quotidien de l'équipe de ${business}.`,
          cta: "Abonnez-vous pour ne pas manquer nos prochaines créations !",
        },
        {
          theme: "Tendance & Inspiration",
          format: "Reel tendance",
          hook: "La couleur / tendance incontournable du moment ✨",
          template: `Analyse visuelle des nouveautés du secteur en lien avec l'univers de ${business}.`,
          cta: "Partagez ce contenu avec un(e) ami(e) passionné(e) !",
        },
        {
          theme: "Mythe vs Réalité",
          format: "Post comparatif",
          hook: "Ce qu'on imagine vs la réalité dans notre métier 💡",
          template: `Démystifier une idée reçue courante dans le domaine de ${business}.`,
          cta: "Vous le saviez ? Dites-le nous en commentaire !",
        },
      ],
      engagement: [
        {
          theme: "Sondage / Débat amical",
          format: "Post interactif",
          hook: "Plutôt Option A ou Option B ? On hésite pour la suite 🤔",
          template: `Faire voter la communauté de ${business} sur les futurs produits ou choix graphiques.`,
          cta: "Votez en commentaire : écrivez A ou B !",
        },
        {
          theme: "Anecdote de l'équipe",
          format: "Post storytelling",
          hook: "L'histoire improbable derrière ce lancement 😅",
          template: `Récit sincère d'un défi relevé par ${business} qui humanise la marque.`,
          cta: "Est-ce que cela vous est déjà arrivé ? Racontez-nous !",
        },
        {
          theme: "Jeu-concours / Remerciement",
          format: "Post concours",
          hook: "Pour vous remercier, nous vous offrons un cadeau 🎁",
          template: `Opération engagement pour ${business} avec invitation à commenter et mentionner un proche.`,
          cta: "Tentez votre chance : commentez et taguez 2 personnes !",
        },
        {
          theme: "Question ouverte",
          format: "Carrousel question",
          hook: "Quelle est votre plus grande difficulté en ce moment ?",
          template: `Recueillir les besoins réels des prospects de ${business} pour créer les futurs contenus.`,
          cta: "On répond à chacun de vos messages ci-dessous !",
        },
      ],
      confiance: [
        {
          theme: "Valeurs & Engagements",
          format: "Carrousel manifeste",
          hook: "Pourquoi nous refusons de faire des compromis sur la qualité 🌿",
          template: `Explication concrète des choix éthiques, locaux ou qualitatifs de ${business}.`,
          cta: "Découvrez notre histoire complète sur notre site internet.",
        },
        {
          theme: "Présentation de l'Équipe",
          format: "Portrait photo",
          hook: "Qui se cache derrière vos commandes ? Rencontrez notre équipe 👥",
          template: `Focus sur un collaborateur ou fondateur de ${business} avec son rôle au quotidien.`,
          cta: "Un petit mot d'encouragement en commentaire ? ❤️",
        },
        {
          theme: "Garantie & Service Client",
          format: "Infographie claire",
          hook: "Commander l'esprit tranquille chez nous : nos 4 engagements 🛡️",
          template: `Rappel de la réactivité, du suivi personnalisé et de la qualité assurée par ${business}.`,
          cta: "Une question avant de commander ? Contactez-nous par WhatsApp !",
        },
      ],
    };

    const templates = strategicThemes[objective] || strategicThemes.ventes;
    const totalPosts = frequency * periodWeeks;

    let currentDate = new Date();
    // Advance to next Monday if weekend
    const currentDay = currentDate.getDay();
    const daysUntilNext = currentDay === 0 ? 1 : currentDay === 6 ? 2 : 0;
    currentDate.setDate(currentDate.getDate() + daysUntilNext);

    for (let i = 0; i < totalPosts; i++) {
      const t = templates[i % templates.length];
      const plat = platformArr[i % (platformArr.length || 1)] || "Instagram";

      // Days spacing: 3/week -> Mon, Wed, Fri
      const daysToAdd = frequency === 2 ? (i % 2 === 0 ? 3 : 4) : frequency === 3 ? (i % 3 === 2 ? 3 : 2) : 2;
      if (i > 0) {
        currentDate.setDate(currentDate.getDate() + daysToAdd);
      }

      list.push({
        date: currentDate.toLocaleDateString("fr-FR"),
        dayName: dayNames[(currentDate.getDay() + 6) % 7],
        platform: plat,
        theme: t.theme,
        format: t.format,
        idea: t.template,
        hook: t.hook,
        cta: t.cta,
      });
    }

    return list;
  }, [business, objective, frequency, periodWeeks, platforms]);

  const downloadCsv = () => {
    const headers = ["Date", "Jour", "Plateforme", "Thème", "Format", "Accroche / Hook", "Détail de la publication", "Appel à l'action (CTA)"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [r.date, r.dayName, r.platform, r.theme, r.format, r.hook, r.idea, r.cta]
          .map((val) => `"${val.replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `planning-publications-${periodWeeks}semaines.csv`;
    a.click();
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(108, 43, 217);
    pdf.text(`CALENDRIER ÉDITORIAL - ${business.toUpperCase()}`, 15, 15);

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Période : ${periodWeeks} semaines (${rows.length} publications) • Objectif : ${objective.toUpperCase()} • Fréquence : ${frequency} posts/semaine`,
      15,
      22
    );

    let y = 30;
    const pageHeight = 190;

    rows.forEach((r, idx) => {
      if (y > pageHeight) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(17, 7, 34);
      pdf.text(`${r.dayName} ${r.date} | [${r.platform}] ${r.theme} (${r.format})`, 15, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(70, 70, 70);
      const text = pdf.splitTextToSize(`Accroche : "${r.hook}"\nContenu : ${r.idea}\nCTA : ${r.cta}`, 265);
      pdf.text(text, 15, y + 4.5);

      y += text.length * 4 + 7;
    });

    pdf.save(`planning-publications-${periodWeeks}semaines.pdf`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Parameters Header */}
      <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-brand-purple/20 shadow-2xl space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white font-montserrat">Générateur de Calendrier Éditorial</h2>
          <p className="text-xs text-white/60 mt-1">
            Générez des idées concrètes, adaptées à votre activité et articulées selon vos objectifs marketing réels.
          </p>
        </div>

        {/* Business & Objective */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Activité ou marque</label>
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Objectif principal</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
            >
              <option value="ventes" className="bg-[#12091f]">🎯 Ventes & Promotions (Conversions et commandes)</option>
              <option value="visibilite" className="bg-[#12091f]">🚀 Visibilité & Portée (Nouveaux abonnés et viralité)</option>
              <option value="engagement" className="bg-[#12091f]">💬 Engagement communautaire (Commentaires & échanges)</option>
              <option value="confiance" className="bg-[#12091f]">🛡️ Crédibilité & Réassurance (Savoir-faire et coulisses)</option>
            </select>
          </div>
        </div>

        {/* Frequency, Period, Platforms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Fréquence de publication</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value={2} className="bg-[#12091f]">2 publications / semaine (Régulier)</option>
              <option value={3} className="bg-[#12091f]">3 publications / semaine (Recommandé)</option>
              <option value={5} className="bg-[#12091f]">5 publications / semaine (Intensif)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Période planifiée</label>
            <select
              value={periodWeeks}
              onChange={(e) => setPeriodWeeks(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value={2} className="bg-[#12091f]">2 semaines ({frequency * 2} posts)</option>
              <option value={4} className="bg-[#12091f]">1 mois ({frequency * 4} posts)</option>
              <option value={8} className="bg-[#12091f]">2 mois ({frequency * 8} posts)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Réseaux sociaux ciblés</label>
            <input
              type="text"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Editorial Calendar Table & Exports */}
      <div className="glassmorphism rounded-3xl p-6 border border-brand-purple/20 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-orange" />
            <h3 className="font-bold text-white text-base font-montserrat">
              Planning généré ({rows.length} idées de publications)
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadCsv}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV (Excel / Notion)</span>
            </button>
            <button
              onClick={downloadPdf}
              className="px-4 py-2 rounded-full bg-[#D95200] hover:bg-[#B84200] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Télécharger le Planning PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[850px] text-left text-xs text-white/80">
            <thead className="bg-white/5 uppercase text-[11px] font-bold text-white/60 border-b border-white/10">
              <tr>
                <th className="p-3 w-28">Date & Jour</th>
                <th className="p-3 w-28">Canal</th>
                <th className="p-3 w-32">Format</th>
                <th className="p-3">Idée & Contenu à créer</th>
                <th className="p-3 w-48">Appel à l'action (CTA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition">
                  <td className="p-3 font-semibold text-white">
                    <div>{r.dayName}</div>
                    <div className="text-[11px] text-white/50">{r.date}</div>
                  </td>
                  <td className="p-3 text-brand-magenta font-semibold">{r.platform}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-white/10 text-[10.5px] font-semibold text-white">
                      {r.format}
                    </span>
                  </td>
                  <td className="p-3 space-y-1">
                    <div className="font-bold text-white">{r.theme}</div>
                    <div className="text-white/70 italic">« {r.hook} »</div>
                    <div className="text-[11px] text-white/60">{r.idea}</div>
                  </td>
                  <td className="p-3 text-[11px] text-emerald-300 font-medium">{r.cta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
