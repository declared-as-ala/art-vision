import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Palette,
  PenTool,
  Layout,
  Printer,
  Video,
  Sparkles,
  Box,
  Globe,
  Users,
  Award,
  Clock,
  ThumbsUp,
  ChevronRight,
  ArrowUpRight,
  MessageSquare,
  FileText,
  HelpCircle
} from "lucide-react";

// Fallback services in case DB isn't fully ready
const FALLBACK_SERVICES = [
  { slug: "identite-visuelle", name: "Identité visuelle", description: "Création d’une image unique, cohérente et mémorable pour votre marque.", icon: Palette },
  { slug: "creation-logo-professionnel", name: "Conception logo", description: "Un logo professionnel, distinctif et adapté à tous vos supports.", icon: PenTool },
  { slug: "design-graphique", name: "Projet graphique", description: "Supports visuels modernes pour vos campagnes, réseaux sociaux et documents commerciaux.", icon: Layout },
  { slug: "impression-publicitaire", name: "Impression", description: "Supports imprimés de haute qualité pour flyers, affiches, bâches, catalogues, panneaux et cartes de visite.", icon: Printer },
  { slug: "video-publicitaire", name: "Projet vidéo", description: "Vidéos impactantes pour présenter votre marque, vos produits ou vos services.", icon: Video },
  { slug: "motion-design", name: "Motion design", description: "Animations dynamiques pour capter l’attention et renforcer votre communication.", icon: Sparkles },
  { slug: "modelisation-3d-rendu-produit", name: "3D & Design produit", description: "Modélisation 3D, rendu produit, packshot 3D, visualisation 3D et CGI publicitaire.", icon: Box },
  { slug: "creation-site-vitrine", name: "Site vitrine", description: "Sites web élégants, rapides, responsive et optimisés pour convertir.", icon: Globe },
  { slug: "community-management", name: "Community management", description: "Gestion et animation professionnelle de vos réseaux sociaux.", icon: Users },
];

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch from DB
  let dbServices: any[] = [];
  let dbProjects: any[] = [];
  let dbTestimonials: any[] = [];
  let settings: any = null;

  try {
    dbServices = await prisma.service.findMany({ select: { id: true, slug: true, name: true, description: true, icon: true } });
    dbProjects = await prisma.portfolioProject.findMany({ take: 3, include: { category: true } });
    dbTestimonials = await prisma.testimonial.findMany({ take: 3, orderBy: { displayOrder: "asc" } });
    settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  } catch (error) {
    console.error("Home page DB fetch error, using fallbacks:", error);
  }

  const services = dbServices.length > 0 ? dbServices : FALLBACK_SERVICES;

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Palette": return <Palette size={28} className="text-brand-magenta" />;
      case "PenTool": return <PenTool size={28} className="text-brand-magenta" />;
      case "Layout": return <Layout size={28} className="text-brand-magenta" />;
      case "Printer": return <Printer size={28} className="text-brand-magenta" />;
      case "Video": return <Video size={28} className="text-brand-magenta" />;
      case "Sparkles": return <Sparkles size={28} className="text-brand-magenta" />;
      case "Box": return <Box size={28} className="text-brand-magenta" />;
      case "Globe": return <Globe size={28} className="text-brand-magenta" />;
      case "Users": return <Users size={28} className="text-brand-magenta" />;
      default: return <Sparkles size={28} className="text-brand-magenta" />;
    }
  };

  const processSteps = [
    { num: "01", title: "Analyse du besoin", desc: "Audit et cadrage précis de vos attentes créatives." },
    { num: "02", title: "Direction créative", desc: "Planches de tendances, concepts originaux et moodboards." },
    { num: "03", title: "Création & production", desc: "Conception graphique vectorielle, modélisation 3D, tournage/montage vidéo." },
    { num: "04", title: "Validation", desc: "Échanges, affinements et Bon À Tirer (BAT) ou recette web." },
    { num: "05", title: "Livraison finale", desc: "Expédition des impressions et transfert des sources." }
  ];

  const faqs = [
    { q: "Quels sont vos délais moyens de réalisation ?", a: "Les délais dépendent de la complexité. Un logo prend généralement 5 à 7 jours, une identité complète 2 semaines et un site vitrine 3 à 4 semaines." },
    { q: "Proposez-vous des facilités de paiement ?", a: "Oui. En général, nous fonctionnons avec un acompte de 30% ou 50% au lancement du projet et le solde à la livraison." },
    { q: "Vos créations de logos sont-elles libres de droits ?", a: "Absolument. Dès la validation finale et le paiement du solde, la totalité des droits d'exploitation commerciale du logo vous est cédée." }
  ];

  return (
    <div className="relative">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden hero-gradient">
        {/* Vector Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,43,217,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,43,217,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/90 block">
                Agence de design graphique, vidéo & impression en France
              </span>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-sora font-extrabold text-white leading-none tracking-tight">
                CRÉATION, DESIGN <br />
                <span className="text-white">ET PRODUCTION</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                Art Vision est une agence de communication visuelle en France spécialisée en graphisme, publicité, design 3D, audiovisuel et impression. Nous aidons les marques à donner vie à leurs idées à travers des créations percutantes et innovantes.
              </p>

              <div className="flex flex-col gap-3.5 pt-4 w-full sm:w-80">
                <Link
                  href="/devis-sur-mesure"
                  className="bg-[#D95200] hover:bg-[#B84200] text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-102 shadow-lg shadow-[#D95200]/25 text-center block"
                >
                  Demandez un devis
                </Link>
                <Link
                  href="#services"
                  className="bg-[#D95200] hover:bg-[#B84200] text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-102 shadow-lg shadow-[#D95200]/25 text-center block"
                >
                  Découvrez nos services
                </Link>
              </div>
            </div>

            {/* Hero Right Visual: Giant AV monogram */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end select-none">
              <span className="font-sora font-black text-[13rem] sm:text-[18rem] md:text-[23rem] lg:text-[25rem] xl:text-[28rem] text-white leading-none tracking-tighter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-pulse">
                AV
              </span>
            </div>
          </div>

          {/* Promotional Card / Banner */}
          <div className="mt-16 w-full">
            <Link href="/carte-de-visite-gratuite" className="block w-full">
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center text-center gap-6 hover:scale-[1.01] transition-all duration-300 border border-[#D72888]/30 shadow-[0_0_35px_rgba(215,40,136,0.35)] bg-gradient-to-br from-[#1b0530] via-[#0b0314] to-[#07010f] bg-opacity-95">
                {/* Micro lights particles backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(108,43,217,0.35)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(215,40,136,0.35)_0%,transparent_50%)] pointer-events-none -z-10"></div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-sora font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(215,40,136,0.85)]">
                    CARTE DE VISITE GRATUITE
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg font-extrabold text-white/90 uppercase tracking-widest flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-brand-magenta text-lg">•</span> Découvrez notre nouvel outil de création
                  </p>
                </div>
                
                <span className="bg-[#D95200] hover:bg-[#B84200] text-white px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition shadow-md shadow-[#D95200]/25 mt-2">
                  J'en profite
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW */}
      <section id="services" className="py-24 bg-brand-navy relative border-t border-brand-purple/20">
        {/* Soft background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-magenta/5 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-sora font-extrabold text-white">
              Nos Services Créatifs
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-sm">
              Un accompagnement complet et sur-mesure pour tous vos projets de communication physique et digitale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const staticIcon = service.icon && typeof service.icon === "string" 
                ? getIcon(service.icon) 
                : (typeof service.icon === "function" ? React.createElement(service.icon, { size: 28, className: "text-brand-magenta" }) : <Palette size={28} className="text-brand-magenta" />);
              
              return (
                <div
                  key={service.slug || idx}
                  className="bg-[#1A1238]/40 rounded-2xl p-6 border border-brand-purple/15 hover:border-brand-magenta/40 transition-all duration-300 hover:-translate-y-1 group text-left relative overflow-hidden"
                >
                  <div className="bg-brand-purple/10 p-3.5 rounded-xl inline-block mb-6 group-hover:bg-brand-magenta/20 transition">
                    {staticIcon}
                  </div>
                  <h3 className="font-sora font-bold text-base text-white mb-2 flex items-center justify-between">
                    <span>{service.name}</span>
                    <ArrowUpRight size={16} className="text-white/40 group-hover:text-brand-magenta transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    href={`/${service.slug}`}
                    className="text-xs text-brand-orange font-bold flex items-center space-x-1 hover:text-brand-magenta transition"
                  >
                    <span>Découvrir la prestation</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FREE CREATIVE TOOLS HERO CARDS */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-3xl p-8 md:p-12 border border-brand-magenta/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20 inline-block">
                🎁 Outils 100% Gratuits
              </span>
              <h2 className="text-3xl md:text-4xl font-sora font-extrabold leading-tight">
                Générez vos outils pro en quelques secondes
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Besoin d'un CV moderne ou de cartes de visite professionnelles ? Nous avons mis à votre disposition nos outils générateurs interactifs avec prévisualisation en temps réel et export PDF vectoriel prêt pour l'impression.
              </p>
            </div>
            
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* CV generator Card */}
              <div className="bg-[#1A1238]/60 border border-brand-purple/20 p-6 rounded-2xl hover:border-brand-magenta/30 transition text-left space-y-4">
                <FileText size={32} className="text-brand-magenta" />
                <h3 className="font-sora font-bold text-base text-white">Générateur de CV</h3>
                <p className="text-xs text-white/60 leading-relaxed">Création de CV design, remplissage rapide et téléchargement PDF instantané.</p>
                <Link
                  href="/cv-modeles-gratuits"
                  className="inline-flex items-center space-x-1 bg-brand-magenta hover:bg-brand-magenta/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                >
                  <span>Créer mon CV</span>
                  <ChevronRight size={12} />
                </Link>
              </div>

              {/* Card generator Card */}
              <div className="bg-[#1A1238]/60 border border-brand-purple/20 p-6 rounded-2xl hover:border-brand-magenta/30 transition text-left space-y-4">
                <Palette size={32} className="text-brand-orange" />
                <h3 className="font-sora font-bold text-base text-white">Cartes de visite</h3>
                <p className="text-xs text-white/60 leading-relaxed">Design recto/verso avec insertion de QR code dynamique et téléchargement.</p>
                <Link
                  href="/carte-de-visite-gratuite"
                  className="inline-flex items-center space-x-1 bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                >
                  <span>Générer ma carte</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW PROCESS */}
      <section className="py-24 bg-brand-navy relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-sora font-extrabold">
              Notre Méthode de Travail
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm">
              Un process structuré en 5 étapes clés pour garantir la conformité et la qualité créative de vos livrables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="glassmorphism rounded-xl p-5 border border-brand-purple/15 relative">
                <span className="text-4xl font-sora font-extrabold text-brand-purple/20 absolute top-4 right-4">{step.num}</span>
                <h3 className="font-sora font-bold text-sm text-white mb-2 pt-8">{step.title}</h3>
                <p className="text-[11px] text-white/65 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO CASE STUDIES */}
      {dbProjects.length > 0 && (
        <section className="py-24 bg-brand-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 space-y-4 sm:space-y-0">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-sora font-extrabold">Nos Réalisations</h2>
                <p className="text-white/60 text-sm max-w-xl">
                  Découvrez les études de cas de nos clients récents en branding, design 3D et vidéo.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="bg-brand-purple/20 hover:bg-brand-purple/30 text-white text-xs font-semibold px-5 py-2.5 rounded-full border border-brand-purple/40 transition shrink-0"
              >
                Découvrir tout le portfolio
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dbProjects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-brand-purple/20 overflow-hidden relative">
                    <img
                      src={project.images.split(";")[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-brand-navy/80 text-brand-magenta text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {project.category.name}
                    </span>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h3 className="font-sora font-bold text-sm text-white group-hover:text-brand-magenta transition">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-white/50">Client : {project.client}</p>
                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{project.objective}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TESTIMONIALS */}
      {dbTestimonials.length > 0 && (
        <section className="py-24 bg-brand-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-sora font-extrabold mb-16">Ils nous font confiance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbTestimonials.map((t: any) => (
                <div key={t.id} className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 text-left flex flex-col justify-between">
                  <p className="text-xs text-white/80 italic leading-relaxed mb-6">« {t.message} »</p>
                  <div className="flex items-center space-x-3 border-t border-brand-purple/15 pt-4">
                    {t.image && <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />}
                    <div>
                      <strong className="text-xs text-white block">{t.name}</strong>
                      <span className="text-[10px] text-white/55 block">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE ART VISION */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-sora font-extrabold leading-tight">
                Pourquoi travailler avec Art Vision ?
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                En tant que studio créatif à taille humaine, nous plaçons l'excellence visuelle et la réactivité au cœur de chaque projet.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15 space-y-3">
                <Award size={24} className="text-brand-magenta" />
                <h3 className="font-sora font-bold text-sm text-white">Qualité Premium</h3>
                <p className="text-[10px] text-white/60 leading-relaxed">Zéro template bas de gamme. Créations uniques, modernes et pensées pour durer.</p>
              </div>
              <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15 space-y-3">
                <Clock size={24} className="text-brand-purple" />
                <h3 className="font-sora font-bold text-sm text-white">Réactivité 24/7</h3>
                <p className="text-[10px] text-white/60 leading-relaxed">Un suivi direct, des livraisons rapides et des échanges fluides par WhatsApp.</p>
              </div>
              <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15 space-y-3">
                <ThumbsUp size={24} className="text-brand-orange" />
                <h3 className="font-sora font-bold text-sm text-white">BAT Validé</h3>
                <p className="text-[10px] text-white/60 leading-relaxed">Vous ne payez l'impression qu'après validation de votre Bon à Tirer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-12">
          <h2 className="text-3xl font-sora font-extrabold">Foire Aux Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glassmorphism rounded-xl p-5 border border-brand-purple/15 text-left space-y-2">
                <h4 className="font-sora font-bold text-sm text-white flex items-start space-x-2">
                  <HelpCircle size={16} className="text-brand-magenta shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-white/70 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA CONTACT */}
      <section className="py-24 bg-brand-navy border-t border-brand-purple/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight leading-tight">
            Prêt à donner une nouvelle dimension <br className="hidden md:inline" /> à votre communication ?
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto">
            Contactez notre studio dès aujourd'hui ou demandez votre estimation tarifaire complète et gratuite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/devis-sur-mesure"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-4 rounded-full font-bold text-sm transition"
            >
              Demander mon devis gratuit
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-8 py-4 rounded-full font-semibold text-sm transition"
            >
              Nous contacter par message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
