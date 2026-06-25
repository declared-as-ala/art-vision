import React from "react";
import { Shield, Cookie, Settings, X } from "lucide-react";
import prisma from "@/lib/prisma";
import { parseContent } from "@/lib/cms";

export const metadata = {
  title: "Politique de Cookies (UE) | Art Vision",
  description: "Politique de cookies d'Art Vision – gestion des cookies analytics, consentement et paramétrage selon le RGPD et la directive ePrivacy.",
};

export default async function PolitiqueCookiesPage() {
  let cmsHtml: string | null = null;
  try {
    const page = await prisma.page.findUnique({ where: { slug: "politique-de-cookies-ue" } });
    if (page && page.contentHtml) {
      cmsHtml = parseContent(page.contentJson, page.contentHtml);
    }
  } catch {}

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white uppercase">
            <Cookie size={14} className="text-brand-orange" />
            <span>Cookies</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight text-white">
            Politique de <span className="text-brand-magenta">Cookies (UE)</span>
          </h1>
        </div>

        <div className="glassmorphism rounded-2xl p-8 md:p-10 border border-brand-purple/20 space-y-8 text-white/80 text-sm leading-relaxed">
          {cmsHtml ? (
            <div className="cms-rich-content" dangerouslySetInnerHTML={{ __html: cmsHtml }} />
          ) : (
            <>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Qu&rsquo;est-ce qu&rsquo;un cookie ?</h2>
                <p>Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lors de votre visite sur un site web. Il permet de stocker des informations relatives à votre navigation pour améliorer votre expérience.</p>
              </section>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Cookies utilisés</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold">
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Finalité</th>
                        <th className="p-3 text-left">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-purple/10">
                      <tr><td className="p-3 font-medium text-white">Analytics</td><td className="p-3">Mesure d&rsquo;audience anonymisée</td><td className="p-3">13 mois</td></tr>
                      <tr><td className="p-3 font-medium text-white">Préférences</td><td className="p-3">Mémorisation de votre choix de consentement</td><td className="p-3">6 mois</td></tr>
                      <tr><td className="p-3 font-medium text-white">Fonctionnels</td><td className="p-3">Maintien de la session et sécurité</td><td className="p-3">Session</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Votre consentement</h2>
                <p>Lors de votre première visite, une bannière vous informe de l&rsquo;utilisation des cookies et recueille votre consentement. Vous pouvez à tout moment modifier vos préférences en cliquant sur notre bannière cookies.</p>
              </section>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Paramétrer vos cookies</h2>
                <p className="flex items-center gap-2"><Settings size={14} /> Vous pouvez configurer vos préférences via notre bannière de cookies ou directement depuis les paramètres de votre navigateur.</p>
              </section>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Désactiver les cookies</h2>
                <p className="flex items-center gap-2"><X size={14} /> Vous pouvez désactiver les cookies depuis les réglages de votre navigateur :</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-magenta hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/kb/effacer-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-magenta hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-magenta hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/help/4027947/microsoft-edge-delete-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-magenta hover:underline">Microsoft Edge</a></li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-sora font-bold text-white mb-4">Contact</h2>
                <p>Pour toute question relative à notre politique de cookies, écrivez-nous à : <strong className="text-white">contact@art-visions.fr</strong></p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
