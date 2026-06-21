import Link from "next/link";
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Identité Visuelle", href: "/identite-visuelle" },
    { name: "Conception Logo", href: "/creation-logo-professionnel" },
    { name: "Projet Graphique", href: "/design-graphique" },
    { name: "Impression", href: "/impression" },
    { name: "Projet Vidéo", href: "/video-publicitaire" },
    { name: "Motion Design", href: "/motion-design" },
    { name: "3D & Produit", href: "/modelisation-3d-rendu-produit" },
    { name: "Site Vitrine", href: "/creation-site-vitrine" },
    { name: "Community Management", href: "/community-management" },
  ];

  const tools = [
    { name: "Créer un CV Gratuit", href: "/cv-modeles-gratuits" },
    { name: "Créer une Carte de Visite", href: "/carte-de-visite-gratuite" },
    { name: "Estimation Impression", href: "/impression" },
  ];

  const cities = [
    { name: "Le Mans", href: "/agence-graphique-le-mans" },
    { name: "Paris", href: "/agence-graphique-paris" },
    { name: "Lyon", href: "/agence-graphique-lyon" },
    { name: "Lille", href: "/agence-graphique-lille" },
    { name: "Nantes", href: "/agence-graphique-nantes" },
  ];

  return (
    <footer className="bg-[#050314] text-white/70 border-t border-brand-purple/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Art Vision Logo" className="h-8 object-contain" />
              <span className="font-sora font-extrabold text-lg tracking-wider text-white">
                ART <span className="text-brand-magenta">VISION</span>
              </span>
            </div>
            <p className="text-xs italic text-brand-white/80">
              « L’art au service de votre image. »
            </p>
            <p className="text-sm leading-relaxed max-w-sm">
              Art Vision est une agence premium de communication visuelle spécialisée en design graphique, branding, logo, vidéo, motion design, 3D et création de sites web.
            </p>
            <div className="flex space-x-3 pt-2">
              <span className="text-xs text-white bg-brand-purple/30 px-3 py-1 rounded-full border border-brand-purple/40">
                SAS ART VISION
              </span>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-sora font-semibold text-white text-base mb-6">
              Nos Services
            </h3>
            <ul className="space-y-3 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="hover:text-brand-magenta transition">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/portfolio" className="hover:text-brand-magenta transition text-brand-magenta font-medium flex items-center space-x-1">
                  <span>Voir toutes les réalisations</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Local SEO */}
          <div>
            <h3 className="font-sora font-semibold text-white text-base mb-6">
              Outils & Villes
            </h3>
            <ul className="space-y-3 text-sm mb-6">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="hover:text-brand-orange transition flex items-center space-x-1 text-white/95">
                    <span>✨</span>
                    <span>{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-sora font-semibold text-white/90 text-xs uppercase tracking-wider mb-3">
              Agences Locales
            </h4>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="text-xs bg-brand-navy border border-brand-purple/10 px-2 py-1 rounded hover:border-brand-magenta hover:text-white transition"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Agency Contacts */}
          <div>
            <h3 className="font-sora font-semibold text-white text-base mb-6">
              Nos Agences
            </h3>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-brand-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">France (Siège) :</span>
                  <span>5 Rue de Constantine, 72000 Le Mans</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Tunisie :</span>
                  <span>Rue Salem Bchir, 5000 Monastir, Tunisie</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-orange shrink-0" />
                <span>contact2artvision@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={16} className="text-brand-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block">GSM : +216 55 804 227</span>
                  <span className="text-white/60 text-[10px]">WhatsApp : +32 490 22 49 05</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal and Copyright */}
        <div className="border-t border-brand-purple/15 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
          <div>
            <p>© {currentYear} SAS ART VISION. Tous droits réservés.</p>
            <p className="text-white/40 mt-1">Slogan : L’art au service de votre image.</p>
          </div>
          <div className="flex space-x-6 text-white/50">
            <Link href="/mentions-legales" className="hover:text-brand-magenta transition flex items-center space-x-1">
              <Shield size={12} />
              <span>Mentions Légales</span>
            </Link>
            <Link href="/cookies" className="hover:text-brand-magenta transition flex items-center space-x-1">
              <HelpCircle size={12} />
              <span>Gestion des Cookies</span>
            </Link>
            <Link href="/admin/login" className="hover:text-white transition flex items-center space-x-1 font-semibold text-brand-purple">
              <span>🔒 Espace Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
