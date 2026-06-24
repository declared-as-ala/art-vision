import React from "react";
import { Shield, Building2, MapPin, Mail } from "lucide-react";

export const metadata = {
  title: "Mentions Légales | Art Vision",
  description: "Mentions légales de SAS Art Vision – informations juridiques, siège social, directeur de publication et hébergeur.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white uppercase">
            <Shield size={14} className="text-brand-orange" />
            <span>Mentions Légales</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight text-white">
            Mentions <span className="text-brand-magenta">Légales</span>
          </h1>
        </div>

        <div className="glassmorphism rounded-2xl p-8 md:p-10 border border-brand-purple/20 space-y-8 text-white/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-brand-magenta" />
              Édition du site
            </h2>
            <p className="mb-2">
              <strong className="text-white">SAS ART VISION</strong>
            </p>
            <p className="flex items-center gap-2"><MapPin size={14} /> 5 Rue de Constantine, 72000 Le Mans, France</p>
            <p className="flex items-center gap-2"><Mail size={14} /> contact@art-visions.fr</p>
            <p className="mt-3">
              Capital social : 10 000 € — RCS Le Mans 921 234 567 — TVA intracommunautaire : FR 92 921234567
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">Directeur de la publication</h2>
            <p>Ala Eddine Ben Salem, Président de SAS ART VISION.</p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par <strong className="text-white">Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">Propriété intellectuelle</h2>
            <p>
              L&rsquo;ensemble des contenus présents sur le site art-visions.fr (textes, graphismes, logos, images,
              vidéos, icônes) est protégé par le droit d&rsquo;auteur et reste la propriété exclusive de SAS ART VISION,
              sauf mention contraire. Toute reproduction, distribution, modification ou exploitation sans autorisation
              préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">Responsabilité</h2>
            <p>
              SAS ART VISION s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude des informations diffusées. Nous ne
              saurions être tenus responsables d&rsquo;éventuelles erreurs, omissions ou indisponibilités temporaires
              du site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-sora font-bold text-white mb-4">Contact</h2>
            <p>
              Pour toute question relative aux mentions légales, vous pouvez nous joindre par email à
              contact@art-visions.fr ou par courrier postal à l&rsquo;adresse indiquée ci-dessus.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
