"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sparkles, PhoneCall } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open (prevents the page from
  // scrolling behind the menu and the drawer "detaching" on mobile).
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

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

  const freeTools = [
    { name: "Tous les outils gratuits", href: "/outils-gratuits" },
    { name: "Générateur de CV", href: "/outils-gratuits/cv-gratuit" },
    { name: "Carte de visite", href: "/outils-gratuits/carte-de-visite-gratuite" },
    { name: "Générateur de QR Code", href: "/outils-gratuits/generateur-qr-code" },
    { name: "Palette de couleurs", href: "/outils-gratuits/generateur-palette-couleurs" },
    { name: "Générateur de slogan", href: "/outils-gratuits/generateur-slogan" },
    { name: "Créateur de flyer", href: "/outils-gratuits/creer-flyer" },
    { name: "Calculateur d'impression", href: "/outils-gratuits/calculateur-impression" },
  ];

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glassmorphism py-3 shadow-lg shadow-brand-navy/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <img src="/logo-mark.svg" alt="Art Vision Logo" className="h-10 w-auto object-contain" />
            <span className="font-sora font-extrabold text-xl tracking-wider text-white flex items-center">
              ART <span className="text-brand-magenta">VISION</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-brand-magenta font-medium text-sm transition ${
                pathname === "/" ? "text-brand-magenta" : "text-brand-white"
              }`}
            >
              Accueil
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-brand-white hover:text-brand-magenta font-medium text-sm transition cursor-pointer">
                <span>Nos Services</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glassmorphism rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-1 gap-1 px-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-2 text-xs rounded-lg hover:bg-brand-purple/20 transition ${
                        pathname === service.href ? "text-brand-magenta font-semibold" : "text-brand-white/80"
                      }`}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Free Tools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-brand-white hover:text-brand-magenta font-medium text-sm transition cursor-pointer">
                <Sparkles size={14} className="text-brand-orange animate-pulse" />
                <span>Outils Gratuits</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glassmorphism rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-2">
                  {freeTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`block px-4 py-2 text-xs rounded-lg hover:bg-brand-purple/20 transition ${
                        pathname === tool.href ? "text-brand-magenta font-semibold" : "text-brand-white/80"
                      }`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/portfolio"
              className={`hover:text-brand-magenta font-medium text-sm transition ${
                pathname === "/portfolio" ? "text-brand-magenta" : "text-brand-white"
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/blog"
              className={`hover:text-brand-magenta font-medium text-sm transition ${
                pathname === "/blog" ? "text-brand-magenta" : "text-brand-white"
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`hover:text-brand-magenta font-medium text-sm transition ${
                pathname === "/contact" ? "text-brand-magenta" : "text-brand-white"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/devis-sur-mesure"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-md shadow-brand-orange/20 flex items-center space-x-2"
            >
              <span>Demander un devis</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brand-magenta transition focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden
        className={`lg:hidden fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer Menu */}
      <div
        style={{ backgroundColor: "#08051f" }}
        className={`lg:hidden fixed inset-y-0 right-0 z-[60] w-80 max-w-sm border-l border-brand-purple/30 shadow-2xl p-6 transition-transform duration-300 transform overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center space-x-2">
            <img src="/logo-mark.svg" alt="Art Vision Logo" className="h-8 w-auto object-contain" />
            <span className="font-sora font-extrabold text-lg text-white">
              ART <span className="text-brand-magenta">VISION</span>
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-brand-magenta transition focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-5 overflow-y-auto max-h-[calc(100vh-160px)] pr-2 no-scrollbar">
          <Link
            href="/"
            className={`text-base font-medium transition ${
              pathname === "/" ? "text-brand-magenta" : "text-white/90"
            }`}
          >
            Accueil
          </Link>

          {/* Services Group */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50 font-bold block">
              Nos Services
            </span>
            <div className="pl-4 grid grid-cols-1 gap-2 border-l border-brand-purple/30">
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`text-sm transition ${
                    pathname === service.href ? "text-brand-magenta font-medium" : "text-white/80 hover:text-brand-magenta"
                  }`}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Free Tools Group */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/50 font-bold block">
              Outils Gratuits
            </span>
            <div className="pl-4 grid grid-cols-1 gap-2 border-l border-brand-purple/30">
              {freeTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`text-sm transition ${
                    pathname === tool.href ? "text-brand-magenta font-medium" : "text-white/80 hover:text-brand-magenta"
                  }`}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/portfolio"
            className={`text-base font-medium transition ${
              pathname === "/portfolio" ? "text-brand-magenta" : "text-white/90"
            }`}
          >
            Portfolio
          </Link>

          <Link
            href="/blog"
            className={`text-base font-medium transition ${
              pathname === "/blog" ? "text-brand-magenta" : "text-white/90"
            }`}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`text-base font-medium transition ${
              pathname === "/contact" ? "text-brand-magenta" : "text-white/90"
            }`}
          >
            Contact
          </Link>

          <div className="pt-6">
            <Link
              href="/devis-sur-mesure"
              className="block text-center bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-full font-medium transition-all shadow-md shadow-brand-orange/20"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
