"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Filter, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

type Wish = {
  id: string;
  recipient: "clients" | "partenaires" | "equipe" | "proches";
  tone: "pro" | "warm" | "short" | "inspiring";
  text: string;
};

const WISHES_DATABASE: Wish[] = [
  // B2B & Clients
  {
    id: "c1",
    recipient: "clients",
    tone: "pro",
    text: "Toute l'équipe de [Entreprise] vous remercie chaleureusement pour votre confiance renouvelée tout au long de cette année. Que 2027 soit pour vous et vos collaborateurs synonyme d'ambition, de prospérité et de grandes réussites partagées.",
  },
  {
    id: "c2",
    recipient: "clients",
    tone: "warm",
    text: "Collaborer avec vous au quotidien est un réel privilège. En cette période festive, nous vous transmettons nos vœux les plus sincères de bonheur personnel et de succès professionnel pour cette nouvelle année 2027.",
  },
  {
    id: "c3",
    recipient: "clients",
    tone: "short",
    text: "Joyeuses Fêtes et Meilleurs Vœux 2027 ! Merci pour votre confiance et cap vers de nouveaux accomplissements communs.",
  },
  {
    id: "c4",
    recipient: "clients",
    tone: "inspiring",
    text: "L'avenir appartient à ceux qui osent bâtir avec passion. En 2027, continuons d'inventer, d'innover et de faire rayonner vos plus beaux projets ensemble. Merveilleuse année à vous !",
  },

  // Partenaires & Réseau
  {
    id: "p1",
    recipient: "partenaires",
    tone: "pro",
    text: "À l'aube de 2027, [Entreprise] tient à saluer la solidité de notre partenariat. Que cette nouvelle année renforce nos synergies et ouvre la voie à de nouvelles victoires partagées.",
  },
  {
    id: "p2",
    recipient: "partenaires",
    tone: "warm",
    text: "C'est grâce à des partenaires engagés et fiables comme vous que les défis deviennent des réussites. Merci pour cette belle année écoulée et recevez tous nos vœux d'excellence pour 2027.",
  },
  {
    id: "p3",
    recipient: "partenaires",
    tone: "short",
    text: "Cap sur 2027 ! Meilleurs vœux à toute votre équipe, avec nos remerciements pour notre précieuse collaboration.",
  },
  {
    id: "p4",
    recipient: "partenaires",
    tone: "inspiring",
    text: "Les plus grandes aventures s'écrivent à plusieurs. Que 2027 soit l'année de l'audace partagée et de la croissance pérenne pour nos deux structures.",
  },

  // Équipe & Collaborateurs
  {
    id: "e1",
    recipient: "equipe",
    tone: "warm",
    text: "Un immense merci pour votre énergie, votre rigueur et votre talent déployés chaque jour chez [Entreprise]. Prenez le temps de vous ressourcer auprès de vos proches. Très joyeux Noël et cap sur une année 2027 extraordinaire !",
  },
  {
    id: "e2",
    recipient: "equipe",
    tone: "inspiring",
    text: "Chaque réussite de cette année porte votre empreinte. En 2027, continuons de cultiver notre esprit d'équipe, notre créativité et notre passion du travail bien fait. Belle et heureuse année à vous !",
  },
  {
    id: "e3",
    recipient: "equipe",
    tone: "short",
    text: "Merci à chacun de vous pour cette belle année 2026. Profitez bien des fêtes et bienvenue en 2027 !",
  },

  // Proches & Famille
  {
    id: "f1",
    recipient: "proches",
    tone: "warm",
    text: "Que la magie de Noël illumine votre foyer et que 2027 vous apporte la santé, l'amour, la joie et des moments précieux partagés en famille. Avec toute notre affection.",
  },
  {
    id: "f2",
    recipient: "proches",
    tone: "short",
    text: "Joyeuses Fêtes et 365 jours de bonheur, de sourires et de sérénité pour 2027 !",
  },
  {
    id: "f3",
    recipient: "proches",
    tone: "inspiring",
    text: "Puisse cette nouvelle année 2027 vous combler de lumière, d'amour et de beaux voyages, qu'ils soient au bout du monde ou au coin du feu.",
  },
];

export default function HolidayWishesStudio() {
  const [recipient, setRecipient] = useState<"all" | "clients" | "partenaires" | "equipe" | "proches">("all");
  const [tone, setTone] = useState<"all" | "pro" | "warm" | "short" | "inspiring">("all");
  const [companyName, setCompanyName] = useState("Art Vision");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = WISHES_DATABASE.filter((w) => {
    const matchRec = recipient === "all" || w.recipient === recipient;
    const matchTone = tone === "all" || w.tone === tone;
    return matchRec && matchTone;
  });

  const handleCopy = (id: string, text: string) => {
    const final = text.replace(/\[Entreprise\]/g, companyName || "notre entreprise");
    navigator.clipboard.writeText(final);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Barre de filtres et personnalisation rapide */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
            <Sparkles size={16} /> Assistant de rédaction de vœux 2027
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/60">Nom de votre structure :</span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Votre entreprise"
              className="bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
        </div>

        {/* Filtres Destinataire et Ton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-white/60 block mb-2 font-medium">Destinataire :</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tous" },
                { id: "clients", label: "Clients B2B / B2C" },
                { id: "partenaires", label: "Partenaires" },
                { id: "equipe", label: "Équipe & Collaborateurs" },
                { id: "proches", label: "Famille & Proches" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setRecipient(btn.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    recipient === btn.id
                      ? "bg-[#CD7942] text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-white/60 block mb-2 font-medium">Style / Tonalité :</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tous les tons" },
                { id: "pro", label: "Institutionnel" },
                { id: "warm", label: "Chaleureux" },
                { id: "short", label: "Court & Percutant" },
                { id: "inspiring", label: "Inspirant" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setTone(btn.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    tone === btn.id
                      ? "bg-[#BA3184] text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des formules de vœux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const formatted = item.text.replace(/\[Entreprise\]/g, companyName || "notre entreprise");
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group bg-[#19082B]/60 border border-white/10 hover:border-[#BA3184]/50 rounded-2xl p-6 transition flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span className="uppercase tracking-wider font-semibold text-[#CD7942]">
                    {item.recipient === "clients" ? "Clientèle" : item.recipient === "partenaires" ? "Partenaire" : item.recipient === "equipe" ? "Équipe" : "Proches"}
                  </span>
                  <span className="bg-white/5 px-2.5 py-0.5 rounded-full">
                    {item.tone === "pro" ? "Institutionnel" : item.tone === "warm" ? "Chaleureux" : item.tone === "short" ? "Court" : "Inspirant"}
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-white/90 font-medium">
                  "{formatted}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(item.id, item.text)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isCopied
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-[#CD7942] hover:bg-[#b86733] text-white shadow-md shadow-[#CD7942]/20"
                  }`}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? "Copié dans le presse-papier !" : "Copier ce texte"}</span>
                </button>

                <Link
                  href="/outils-gratuits/createur-carte-de-voeux"
                  className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-[#BA3184] transition"
                >
                  <Mail size={13} /> Insérer dans une carte <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA de concrétisation */}
      <div className="bg-gradient-to-r from-[#25103E] via-[#1B0B2E] to-[#BA3184]/30 border border-[#BA3184]/40 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Vous souhaitez une campagne de vœux sur-mesure ?</h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl">
            Notre studio graphique crée votre identité saisonnière complète : cartes de vœux imprimées, signatures e-mail animées et visuels réseaux sociaux coordonnés.
          </p>
        </div>
        <Link
          href="/devis-sur-mesure"
          className="inline-flex items-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30 shrink-0"
        >
          <span>Demander un devis vœux</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

