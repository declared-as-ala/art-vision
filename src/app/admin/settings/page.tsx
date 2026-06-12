"use client";

import React, { useState, useEffect } from "react";
import { Settings, Info, MapPin, Search, Share2, Save, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "address" | "google" | "social">("general");

  // Form states
  const [brandName, setBrandName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [franceAddress, setFranceAddress] = useState("");
  const [tunisiaAddress, setTunisiaAddress] = useState("");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleTagManagerId, setGoogleTagManagerId] = useState("");
  const [searchConsoleVerification, setSearchConsoleVerification] = useState("");
  const [socialFb, setSocialFb] = useState("");
  const [socialIg, setSocialIg] = useState("");
  const [socialIn, setSocialIn] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setBrandName(s.brandName || "");
          setSlogan(s.slogan || "");
          setEmail(s.email || "");
          setPhone(s.phone || "");
          setWhatsapp(s.whatsapp || "");
          setFranceAddress(s.franceAddress || "");
          setTunisiaAddress(s.tunisiaAddress || "");
          setGoogleAnalyticsId(s.googleAnalyticsId || "");
          setGoogleTagManagerId(s.googleTagManagerId || "");
          setSearchConsoleVerification(s.searchConsoleVerification || "");
          setSocialFb(s.socialFb || "");
          setSocialIg(s.socialIg || "");
          setSocialIn(s.socialIn || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          slogan,
          email,
          phone,
          whatsapp,
          franceAddress,
          tunisiaAddress,
          googleAnalyticsId,
          googleTagManagerId,
          searchConsoleVerification,
          socialFb,
          socialIg,
          socialIn,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Paramètres enregistrés avec succès !");
      } else {
        setMessage("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
          Configuration Générale
        </h1>
        <p className="text-xs text-white/50">Configurez l'identité visuelle, les contacts, les intégrations Google de l'agence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-col space-y-1 bg-[#050314] p-4 rounded-xl border border-brand-purple/15">
          {[
            { id: "general", label: "Infos Générales", icon: Info },
            { id: "address", label: "Bureaux & Adresses", icon: MapPin },
            { id: "google", label: "Intégrations Google", icon: Search },
            { id: "social", label: "Réseaux Sociaux", icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide text-left transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-magenta text-white"
                    : "text-white/60 hover:text-white hover:bg-brand-purple/10"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form panel */}
        <div className="lg:col-span-9 glassmorphism rounded-2xl p-6 md:p-8 border border-brand-purple/15">
          {loading ? (
            <div className="text-center py-8 text-white/45">Chargement...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-sora font-bold text-sm text-white flex items-center space-x-2">
                    <Info size={16} className="text-brand-magenta" />
                    <span>Informations Générales</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Nom de marque</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Slogan publicitaire</label>
                      <input
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Email de contact</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Téléphone de l'agence</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Numéro WhatsApp</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-sora font-bold text-sm text-white flex items-center space-x-2">
                    <MapPin size={16} className="text-brand-magenta" />
                    <span>Adresses des Agences</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Adresse Siège Social (France)</label>
                      <input
                        type="text"
                        value={franceAddress}
                        onChange={(e) => setFranceAddress(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Adresse Bureau Tunisien</label>
                      <input
                        type="text"
                        value={tunisiaAddress}
                        onChange={(e) => setTunisiaAddress(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Google integration Tab */}
              {activeTab === "google" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-sora font-bold text-sm text-white flex items-center space-x-2">
                    <Search size={16} className="text-brand-magenta" />
                    <span>Google Analytics & SEO Verification</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Google Analytics ID (GA4)</label>
                      <input
                        type="text"
                        placeholder="G-XXXXXXXXXX"
                        value={googleAnalyticsId}
                        onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Google Tag Manager ID (GTM)</label>
                      <input
                        type="text"
                        placeholder="GTM-XXXXXXX"
                        value={googleTagManagerId}
                        onChange={(e) => setGoogleTagManagerId(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/70">Google Search Console Verification Value</label>
                    <input
                      type="text"
                      placeholder="google-site-verification key code"
                      value={searchConsoleVerification}
                      onChange={(e) => setSearchConsoleVerification(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    />
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === "social" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-sora font-bold text-sm text-white flex items-center space-x-2">
                    <Share2 size={16} className="text-brand-magenta" />
                    <span>Réseaux Sociaux</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Lien Facebook</label>
                      <input
                        type="url"
                        value={socialFb}
                        onChange={(e) => setSocialFb(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Lien Instagram</label>
                      <input
                        type="url"
                        value={socialIg}
                        onChange={(e) => setSocialIg(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70">Lien LinkedIn</label>
                      <input
                        type="url"
                        value={socialIn}
                        onChange={(e) => setSocialIn(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-purple/15">
                {message && (
                  <p className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/25 px-4 py-2 rounded-lg">
                    {message}
                  </p>
                )}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ml-auto shadow-md shadow-brand-orange/15"
                >
                  <Save size={14} />
                  <span>{saving ? "Sauvegarde..." : "Enregistrer"}</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
