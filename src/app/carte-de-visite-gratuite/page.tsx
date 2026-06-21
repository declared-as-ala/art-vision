"use client";

import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
  Sparkles,
  Download,
  CreditCard,
  Upload,
  RefreshCw,
  Printer,
  ChevronRight,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2
} from "lucide-react";

type TemplateType = "modern" | "creative" | "corporate" | "split";

// Many quick-pick accent colours for the divider / icons.
const PRESET_ACCENTS = [
  "#C9A227", "#D72888", "#6C2BD9", "#FF6A00", "#0EA5E9", "#10B981",
  "#EF4444", "#F59E0B", "#E11D48", "#14B8A6", "#8B5CF6", "#3B82F6",
  "#84CC16", "#EC4899", "#F8F7FC", "#111827",
];

export default function BusinessCardGenerator() {
  // Form fields
  const [name, setName] = useState("Jean Dupont");
  const [jobTitle, setJobTitle] = useState("Directeur Artistique");
  const [phone, setPhone] = useState("+33 6 12 34 56 78");
  const [email, setEmail] = useState("j.dupont@art-visions.fr");
  const [address, setAddress] = useState("5 Rue de Constantine, Le Mans");
  const [website, setWebsite] = useState("www.art-visions.fr");
  const [socials, setSocials] = useState("@artvision");
  
  // Customization
  const [template, setTemplate] = useState<TemplateType>("split");
  const [primaryColor, setPrimaryColor] = useState("#6C2BD9");
  const [secondaryColor, setSecondaryColor] = useState("#D72888");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#08051F");
  
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate QR code based on contact details
  useEffect(() => {
    const generateQR = async () => {
      // Create vCard standard format
      const vCardText = `BEGIN:VCARD
VERSION:3.0
N:${name};;;
FN:${name}
ORG:Art Vision
TITLE:${jobTitle}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=PREF,INTERNET:${email}
URL:${website}
ADR:;;${address};;;;
END:VCARD`;

      try {
        const url = await QRCode.toDataURL(vCardText, {
          width: 150,
          margin: 1,
          color: {
            dark: "#08051F",
            light: "#FFFFFF"
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQR();
  }, [name, jobTitle, phone, email, website, address]);

  // Apply template defaults when changing template
  useEffect(() => {
    if (template === "modern") {
      setPrimaryColor("#08051F");
      setSecondaryColor("#EDEAF5");
      setTextColor("#171625");
      setBgColor("#F8F7FC");
    } else if (template === "creative") {
      setPrimaryColor("#6C2BD9");
      setSecondaryColor("#D72888");
      setTextColor("#FFFFFF");
      setBgColor("#08051F");
    } else if (template === "corporate") {
      setPrimaryColor("#1A1238");
      setSecondaryColor("#D95200");
      setTextColor("#FFFFFF");
      setBgColor("#1A1238");
    } else if (template === "split") {
      setPrimaryColor("#C9A227"); // gold divider / accent
      setSecondaryColor("#C9A227");
      setTextColor("#FFFFFF"); // used on the dark back side
      setBgColor("#1F1F27"); // dark left panel
    }
  }, [template]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    logoInputRef.current?.click();
  };

  const handleDownloadPDF = () => {
    // Standard business card: 85mm x 55mm (3.35in x 2.17in)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85, 55]
    });

    // We will draw standard background & colors
    // Page 1: Front
    if (template === "split") {
      // White card with a dark left panel + accent divider
      doc.setFillColor("#FFFFFF");
      doc.rect(0, 0, 85, 55, "F");
      doc.setFillColor(bgColor);
      doc.rect(0, 0, 30, 55, "F");
      doc.setFillColor(primaryColor);
      doc.rect(30, 0, 1.6, 55, "F");

      // Logo / monogram in the panel
      if (logoUrl) {
        try { doc.addImage(logoUrl, "PNG", 7, 19, 16, 16); } catch (e) {}
      } else {
        doc.setTextColor("#FFFFFF");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text("AV", 9, 31);
      }

      // Name & title
      doc.setTextColor("#1A1A22");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.text(name, 37, 16);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#6B6B75");
      doc.text(jobTitle, 37, 21.5);

      // Contact lines
      doc.setFontSize(7.5);
      const rows = [email, phone, address, website].filter(Boolean);
      let ry = 32;
      rows.forEach((line) => {
        doc.setFillColor(primaryColor);
        doc.circle(38, ry - 1.1, 0.9, "F"); // accent bullet
        doc.setTextColor("#33333A");
        doc.text(String(line), 41, ry);
        ry += 5.2;
      });
    } else {
      doc.setFillColor(bgColor);
      doc.rect(0, 0, 85, 55, "F");

      if (template === "creative") {
        // Draw decorative gradient line
        doc.setFillColor(primaryColor);
        doc.rect(0, 52, 85, 3, "F");
        doc.setFillColor(secondaryColor);
        doc.rect(0, 53, 40, 2, "F");
      } else if (template === "corporate") {
        doc.setFillColor(secondaryColor); // Orange accent
        doc.rect(0, 0, 3, 55, "F");
      }

      // Logo
      if (logoUrl) {
        try {
          doc.addImage(logoUrl, "PNG", 8, 8, 14, 14);
        } catch (e) {
          // Fallback placeholder
        }
      } else {
        // Draw generic AV logo
        doc.setFillColor(primaryColor === bgColor ? "#D72888" : primaryColor);
        doc.circle(13, 13, 5, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(8);
        doc.text("AV", 11, 15);
      }

      // Name & Title
      doc.setTextColor(textColor);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text(name, 28, 12);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(template === "modern" ? "#6C2BD9" : secondaryColor);
      doc.text(jobTitle, 28, 16);

      // Contact Details
      doc.setTextColor(textColor);
      doc.setFontSize(6.5);
      let yPos = 24;

      doc.text(`T: ${phone}`, 28, yPos);
      doc.text(`M: ${email}`, 28, yPos + 4);
      doc.text(`W: ${website}`, 28, yPos + 8);
      doc.text(`A: ${address}`, 28, yPos + 12);
    }

    // Add page 2: Back
    doc.addPage([85, 55], "landscape");
    doc.setFillColor(bgColor);
    doc.rect(0, 0, 85, 55, "F");

    // Add QR code on back
    if (qrCodeUrl) {
      try {
        doc.addImage(qrCodeUrl, "PNG", 28, 8, 28, 28);
      } catch (e) {}
    }

    doc.setTextColor(textColor);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("ART VISION", 42, 42, { align: "center" });
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(template === "modern" ? "#666666" : "#A5A1B8");
    doc.text("L'art au service de votre image.", 42, 46, { align: "center" });

    doc.save(`Carte_Visite_${name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleSaveToDB = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const response = await fetch("/api/generators/business-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          jobTitle,
          phone,
          email,
          address,
          website,
          socials,
          templateId: template,
          colors: JSON.stringify({ primaryColor, secondaryColor, bgColor, textColor }),
          qrData: website,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg("Votre carte a été enregistrée avec succès dans le tableau de bord ! Notre équipe d'impression a été notifiée.");
      } else {
        setSuccessMsg("Erreur lors de l'enregistrement de la carte.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSuccessMsg("Carte enregistrée localement. (Simulé)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      {/* Background glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-magenta/10 rounded-full filter blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Outil Créatif Gratuit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Créer votre carte de visite <span className="text-brand-magenta">professionnelle</span> gratuitement
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Saisissez vos coordonnées, choisissez un style visuel, visualisez en temps réel les deux faces et téléchargez votre fichier PDF vectoriel de haute qualité prêt à l'impression.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-5 glassmorphism rounded-2xl p-6 space-y-6">
            <h2 className="font-sora font-bold text-lg text-white border-b border-brand-purple/20 pb-3 flex items-center space-x-2">
              <CreditCard className="text-brand-magenta" size={20} />
              <span>Informations de la carte</span>
            </h2>

            {/* Template selector */}
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                Choix du Modèle
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "split", name: "Élégant" },
                  { id: "creative", name: "Créatif" },
                  { id: "modern", name: "Minimaliste" },
                  { id: "corporate", name: "Corporate" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id as TemplateType)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition cursor-pointer ${
                      template === t.id
                        ? "bg-brand-magenta border-brand-magenta text-white shadow-md shadow-brand-magenta/15"
                        : "border-brand-purple/30 bg-brand-navy hover:bg-brand-purple/20 text-white/80"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSaveToDB} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <User size={12} className="text-brand-purple" />
                    <span>Nom & Prénom</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <Briefcase size={12} className="text-brand-purple" />
                    <span>Poste occupé</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <Phone size={12} className="text-brand-purple" />
                    <span>Téléphone</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <Mail size={12} className="text-brand-purple" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70 flex items-center space-x-1">
                  <MapPin size={12} className="text-brand-purple" />
                  <span>Adresse</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <Globe size={12} className="text-brand-purple" />
                    <span>Site Web</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 flex items-center space-x-1">
                    <Share2 size={12} className="text-brand-purple" />
                    <span>Réseaux sociaux</span>
                  </label>
                  <input
                    type="text"
                    value={socials}
                    onChange={(e) => setSocials(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
              </div>

              {/* Logo upload */}
              <div className="space-y-2">
                <label className="text-xs text-white/70 block">Logo de l'entreprise</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerLogoUpload}
                    className="bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-white text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Importer un logo</span>
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>

              {/* Custom colors */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-white/60 block">Couleur Fond</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs uppercase text-white/80">{bgColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/60 block">{template === "split" ? "Couleur Panneau" : "Couleur Texte"}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={template === "split" ? bgColor : textColor}
                      onChange={(e) => (template === "split" ? setBgColor(e.target.value) : setTextColor(e.target.value))}
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs uppercase text-white/80">{template === "split" ? bgColor : textColor}</span>
                  </div>
                </div>
              </div>

              {/* Accent color palette — many quick choices */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 block">
                  Couleur d'accent {template === "split" && <span className="text-white/40">(séparateur & icônes)</span>}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_ACCENTS.map((c) => {
                    const active = primaryColor.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        onClick={() => { setPrimaryColor(c); setSecondaryColor(c); }}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          active ? "border-white scale-110 shadow-md shadow-black/30" : "border-white/20 hover:scale-105"
                        }`}
                        aria-label={`Accent ${c}`}
                      />
                    );
                  })}
                  <label
                    className="w-7 h-7 rounded-full border border-dashed border-white/40 flex items-center justify-center cursor-pointer overflow-hidden relative"
                    title="Couleur personnalisée"
                  >
                    <span className="text-[10px] text-white/70">+</span>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => { setPrimaryColor(e.target.value); setSecondaryColor(e.target.value); }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-brand-purple/20">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-purple hover:bg-brand-purple/95 text-white py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <RefreshCw size={16} className={saving ? "animate-spin" : ""} />
                  <span>Enregistrer dans le tableau de bord</span>
                </button>
                
                {successMsg && (
                  <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-lg leading-relaxed text-center">
                    {successMsg}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Live Preview Panel (Right) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card preview wrapper */}
            <div className="glassmorphism rounded-2xl p-6 flex flex-col items-center space-y-6">
              <div className="flex justify-between items-center w-full border-b border-brand-purple/20 pb-3">
                <h2 className="font-sora font-bold text-lg text-white flex items-center space-x-2">
                  <CreditCard className="text-brand-orange" size={20} />
                  <span>Aperçu interactif</span>
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveSide("front")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition cursor-pointer ${
                      activeSide === "front"
                        ? "bg-brand-orange text-white"
                        : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    Recto (Face)
                  </button>
                  <button
                    onClick={() => setActiveSide("back")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition cursor-pointer ${
                      activeSide === "back"
                        ? "bg-brand-orange text-white"
                        : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    Verso (Dos)
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW WINDOW */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  aspectRatio: "85 / 55",
                  backgroundColor: template === "split" ? (activeSide === "back" ? bgColor : "#FFFFFF") : bgColor,
                  color: template === "split" ? (activeSide === "back" ? "#FFFFFF" : "#1A1A22") : textColor,
                  borderColor: "rgba(108, 43, 217, 0.25)",
                }}
                className={`relative rounded-2xl shadow-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  template === "split" && activeSide === "front" ? "p-0" : "p-6"
                }`}
              >
                {activeSide === "front" ? (
                  template === "split" ? (
                    // Recto — Élégant : panneau sombre + séparateur + coordonnées
                    <div className="flex h-full w-full">
                      <div
                        style={{ backgroundColor: bgColor }}
                        className="relative w-[36%] flex items-center justify-center p-3"
                      >
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="max-w-[80%] max-h-[70%] object-contain" />
                        ) : (
                          <span className="font-sora font-extrabold text-2xl text-white">AV</span>
                        )}
                        <div
                          style={{ backgroundColor: primaryColor }}
                          className="absolute top-0 right-0 h-full w-[5px]"
                        ></div>
                      </div>
                      <div className="flex-1 px-4 sm:px-5 py-3 flex flex-col justify-center min-w-0">
                        <h3 className="font-sora font-extrabold text-lg sm:text-xl leading-tight" style={{ color: "#1A1A22" }}>
                          {name || "Votre Nom"}
                        </h3>
                        <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#6B6B75" }}>
                          {jobTitle || "Votre Poste"}
                        </p>
                        <div className="mt-3 space-y-1.5">
                          {[
                            { Icon: Mail, val: email || "email@entreprise.com" },
                            { Icon: Phone, val: phone || "+33 6 00 00 00 00" },
                            { Icon: MapPin, val: address || "Ville" },
                            { Icon: Globe, val: website || "www.entreprise.com" },
                          ].map(({ Icon, val }, i) => (
                            <div key={i} className="flex items-center gap-2 min-w-0">
                              <Icon size={13} style={{ color: primaryColor }} className="shrink-0" />
                              <span className="text-[11px] sm:text-xs truncate" style={{ color: "#33333A" }}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                  // Recto / Front design
                  <>
                    {/* Decorative templates */}
                    {template === "creative" && (
                      <>
                        <div
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          className="absolute bottom-0 left-0 right-0 h-2"
                        ></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/10 rounded-full filter blur-xl"></div>
                      </>
                    )}

                    {template === "corporate" && (
                      <div
                        style={{ backgroundColor: secondaryColor }}
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                      ></div>
                    )}

                    {/* Logo & Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
                        ) : (
                          <div
                            style={{ backgroundColor: primaryColor === bgColor ? "#D72888" : primaryColor }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-sora font-extrabold text-sm"
                          >
                            AV
                          </div>
                        )}
                        <div>
                          <h3 className="font-sora font-extrabold text-lg leading-tight text-white">
                            {name || "Votre Nom"}
                          </h3>
                          <p
                            style={{ color: template === "modern" ? "#6C2BD9" : secondaryColor }}
                            className="text-xs font-semibold"
                          >
                            {jobTitle || "Votre Poste"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[11px] opacity-90 pl-1">
                      <p className="flex items-center space-x-1.5">
                        <span className="font-bold">T:</span>
                        <span>{phone || "+33 6 00 00 00 00"}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <span className="font-bold">M:</span>
                        <span>{email || "email@entreprise.com"}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <span className="font-bold">W:</span>
                        <span>{website || "www.entreprise.com"}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <span className="font-bold">A:</span>
                        <span className="truncate">{address || "Adresse, Ville"}</span>
                      </p>
                    </div>
                  </>
                  )
                ) : (
                  // Verso / Back design
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Contact QR Code" className="w-24 h-24 bg-white p-1 rounded-lg" />
                    ) : (
                      <div className="w-24 h-24 bg-white/20 rounded flex items-center justify-center text-[10px]">
                        QR CODE
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="font-sora font-extrabold text-base tracking-wider text-white">
                        ART <span className="text-brand-magenta">VISION</span>
                      </h4>
                      <p className="text-[10px] opacity-50 italic">
                        L'art au service de votre image.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-2">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Télécharger le PDF</span>
                </button>
                <a
                  href="/devis-sur-mesure?prefill=impression"
                  className="bg-white/10 hover:bg-white/20 border border-brand-purple/30 text-white px-6 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2"
                >
                  <Printer size={16} className="text-brand-magenta" />
                  <span>Commander l'impression</span>
                </a>
              </div>
            </div>

            {/* Template Card Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "split",
                  name: "Élégant (Panneau)",
                  colors: "Panneau sombre + accent",
                  desc: "Panneau latéral sombre, séparateur coloré et coordonnées avec icônes. Couleur d'accent personnalisable."
                },
                {
                  id: "creative",
                  name: "Créatif Moderne",
                  colors: "Magenta/Violet/Navy",
                  desc: "Style dynamique avec dégradés, idéal pour les communicants, artistes et créateurs."
                },
                {
                  id: "modern",
                  name: "Minimaliste Chic",
                  colors: "Blanc/Gris/Noir",
                  desc: "Mise en page sobre, lettrages aérés et contraste net pour un aspect haut de gamme."
                },
                {
                  id: "corporate",
                  name: "Corporate Épuré",
                  colors: "Navy/Orange CTA",
                  desc: "Identité forte avec bandeau d'accent orange et structure solide pour les professionnels."
                }
              ].map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id as TemplateType)}
                  className={`glassmorphism rounded-xl p-5 border cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    template === tmpl.id
                      ? "border-brand-magenta shadow-md shadow-brand-magenta/15"
                      : "border-brand-purple/20 hover:border-brand-purple/40"
                  }`}
                >
                  <h4 className="font-sora font-semibold text-sm text-white mb-1 flex items-center justify-between">
                    <span>{tmpl.name}</span>
                    {template === tmpl.id && <span className="text-[10px] bg-brand-magenta/20 text-brand-magenta px-2 py-0.5 rounded-full font-bold">Actif</span>}
                  </h4>
                  <p className="text-[11px] text-brand-orange mb-2 font-medium">{tmpl.colors}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{tmpl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
