import React from "react";
import { Shield, Lock, Eye, Mail } from "lucide-react";

export const metadata = {
  title: "Politique de Confidentialité | Art Vision",
  description: "Politique de confidentialité de SAS Art Vision – collecte des données, droits RGPD, cookies et sécurité des informations personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white uppercase">
            <Lock size={14} className="text-brand-orange" />
            <span>Confidentialité</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight text-white">
            Politique de <span className="text-brand-magenta">Confidentialité</span>
          </h1>
        </div>

        <div className="glassmorphism rounded-2xl p-8 md:p-10 border border-brand-purple/20 space-y-8 text-white/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">1. Données collectées</h2>
            <p className="mb-2">
              Dans le cadre de votre navigation sur art-visions.fr, nous pouvons collecter les données suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nom, prénom et adresse email (via le formulaire de contact ou de devis)</li>
              <li>Données de navigation : pages visitées, durée, navigateur, adresse IP anonymisée</li>
              <li>Préférences de cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">2. Finalités du traitement</h2>
            <p>Vos données sont traitées pour :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Répondre à vos demandes de contact et de devis</li>
              <li> Améliorer votre expérience de navigation (analytics)</li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">3. Base légale</h2>
            <p>
              Le traitement de vos données repose sur votre consentement (cookies, formulaire de contact) et sur
              notre intérêt légitime (amélioration du site, sécurité).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">4. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire aux finalités décrites : 3 ans après le dernier
              contact pour les données de formulaire, 13 mois pour les cookies analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">5. Vos droits RGPD</h2>
            <p className="mb-2">Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Droit d&rsquo;accès, de rectification et d&rsquo;effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&rsquo;opposition</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">6. Exercer vos droits</h2>
            <p className="flex items-center gap-2">
              <Mail size={14} /> Pour exercer vos droits, contactez-nous à : <strong className="text-white">contact@art-visions.fr</strong>
            </p>
            <p className="mt-2">
              Vous avez également le droit d&rsquo;introduire une réclamation auprès de la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"
                 className="text-brand-magenta hover:underline">www.cnil.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">7. Sécurité</h2>
            <p className="flex items-center gap-2">
              <Shield size={14} /> Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
