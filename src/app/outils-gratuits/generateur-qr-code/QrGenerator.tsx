"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import {
  Link2, MessageCircle, AtSign, Globe, MapPin, UtensilsCrossed,
  Contact, Mail, Wifi, Upload, Download, Loader2, CheckCircle2,
} from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

type QrType = "url" | "whatsapp" | "instagram" | "facebook" | "maps" | "menu" | "vcard" | "email" | "wifi";

const TYPES: { id: QrType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "Site web", icon: Link2 },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "instagram", label: "Instagram", icon: AtSign },
  { id: "facebook", label: "Facebook", icon: Globe },
  { id: "maps", label: "Google Maps", icon: MapPin },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "vcard", label: "vCard", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
];

function buildPayload(type: QrType, f: Record<string, string>): string {
  switch (type) {
    case "url":
    case "menu":
      return f.url || "";
    case "whatsapp": {
      const num = (f.phone || "").replace(/[^0-9]/g, "");
      return `https://wa.me/${num}${f.message ? `?text=${encodeURIComponent(f.message)}` : ""}`;
    }
    case "instagram":
      return `https://instagram.com/${(f.handle || "").replace(/^@/, "")}`;
    case "facebook":
      return f.url || `https://facebook.com/${f.handle || ""}`;
    case "maps":
      return f.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.address || "")}`;
    case "email":
      return `mailto:${f.email || ""}${f.subject ? `?subject=${encodeURIComponent(f.subject)}` : ""}`;
    case "wifi":
      return `WIFI:T:${f.encryption || "WPA"};S:${f.ssid || ""};P:${f.password || ""};;`;
    case "vcard":
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        `N:${f.name || ""}`, `FN:${f.name || ""}`,
        f.org ? `ORG:${f.org}` : "",
        f.phone ? `TEL:${f.phone}` : "",
        f.email ? `EMAIL:${f.email}` : "",
        f.url ? `URL:${f.url}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    default:
      return "";
  }
}

const FIELDS: Record<QrType, { key: string; label: string; placeholder: string }[]> = {
  url: [{ key: "url", label: "URL du site", placeholder: "https://votre-site.fr" }],
  menu: [{ key: "url", label: "Lien du menu", placeholder: "https://votre-site.fr/menu" }],
  whatsapp: [
    { key: "phone", label: "Numéro (indicatif inclus)", placeholder: "33612345678" },
    { key: "message", label: "Message prérempli (option)", placeholder: "Bonjour, je souhaite..." },
  ],
  instagram: [{ key: "handle", label: "Nom d'utilisateur", placeholder: "@votrecompte" }],
  facebook: [{ key: "url", label: "Lien de la page", placeholder: "https://facebook.com/votrepage" }],
  maps: [{ key: "address", label: "Adresse ou lieu", placeholder: "12 rue des Arts, Paris" }],
  email: [
    { key: "email", label: "Adresse e-mail", placeholder: "contact@votre-site.fr" },
    { key: "subject", label: "Objet (option)", placeholder: "Demande d'information" },
  ],
  wifi: [
    { key: "ssid", label: "Nom du réseau (SSID)", placeholder: "MonWifi" },
    { key: "password", label: "Mot de passe", placeholder: "••••••••" },
  ],
  vcard: [
    { key: "name", label: "Nom complet", placeholder: "Sophie Martin" },
    { key: "org", label: "Entreprise", placeholder: "Art Vision" },
    { key: "phone", label: "Téléphone", placeholder: "+33 6 12 34 56 78" },
    { key: "email", label: "E-mail", placeholder: "sophie@art-visions.fr" },
    { key: "url", label: "Site web", placeholder: "https://art-visions.fr" },
  ],
};

const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

export default function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ url: "https://art-visions.fr" });
  const [fg, setFg] = useState("#08051F");
  const [bg, setBg] = useState("#FFFFFF");
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [logo, setLogo] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const payload = buildPayload(type, fields);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !payload) return;
    setBusy(true);
    try {
      await QRCode.toCanvas(canvas, payload || " ", {
        errorCorrectionLevel: logo ? "H" : ecc,
        margin: 2,
        width: 480,
        color: { dark: fg, light: bg },
      });
      if (logo) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            const size = canvas.width * 0.22;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            ctx.fillStyle = bg;
            ctx.fillRect(x - 6, y - 6, size + 12, size + 12);
            ctx.drawImage(img, x, y, size, size);
          };
          img.src = logo;
        }
      }
    } finally {
      setBusy(false);
    }
  }, [payload, fg, bg, ecc, logo]);

  useEffect(() => { render(); }, [render]);

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Logo trop lourd (max 2 Mo)."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "qr-code-art-vision.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCode.toString(payload || " ", {
      type: "svg",
      errorCorrectionLevel: ecc,
      margin: 2,
      color: { dark: fg, light: bg },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = "qr-code-art-vision.svg";
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const img = canvas.toDataURL("image/png");
    pdf.setFontSize(16);
    pdf.text("Votre QR Code", 105, 30, { align: "center" });
    pdf.addImage(img, "PNG", 65, 50, 80, 80);
    pdf.setFontSize(9);
    pdf.setTextColor(140);
    pdf.text("Généré gratuitement sur art-visions.fr", 105, 145, { align: "center" });
    pdf.save("qr-code-art-vision.pdf");
  };

  const setField = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-white/55 block mb-2">Type de QR code</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setType(t.id); setFields({}); }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[10px] font-semibold transition cursor-pointer ${
                    active ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {FIELDS[type].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs text-white/70">{f.label}</label>
              <input
                className={inputCls}
                value={fields[f.key] || ""}
                onChange={(e) => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            </div>
          ))}
          {type === "wifi" && (
            <select className={inputCls} value={fields.encryption || "WPA"} onChange={(e) => setField("encryption", e.target.value)}>
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Aucun mot de passe</option>
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Couleur du code</label>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Arrière-plan</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Correction d'erreur</label>
            <select className={inputCls} value={ecc} onChange={(e) => setEcc(e.target.value as any)} disabled={!!logo}>
              <option value="L">Faible (L)</option>
              <option value="M">Moyenne (M)</option>
              <option value="Q">Élevée (Q)</option>
              <option value="H">Maximale (H)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Logo central (option)</label>
            <label className="flex items-center justify-center gap-2 h-10 rounded-lg border border-brand-purple/30 text-xs text-white/75 cursor-pointer hover:border-brand-magenta/40">
              <Upload size={13} /> {logo ? "Changer" : "Importer"}
              <input type="file" accept="image/*" onChange={onLogo} className="hidden" />
            </label>
          </div>
        </div>
        {logo && (
          <button onClick={() => setLogo("")} className="text-[11px] text-red-400 hover:text-red-300">Retirer le logo</button>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="glassmorphism rounded-2xl p-6 flex flex-col items-center">
          <div className="relative rounded-xl overflow-hidden bg-white p-3">
            <canvas ref={canvasRef} className="w-[260px] h-[260px] block" />
            {busy && (
              <div className="absolute inset-0 grid place-items-center bg-white/70">
                <Loader2 className="animate-spin text-brand-magenta" />
              </div>
            )}
          </div>
          {!payload && <p className="text-xs text-white/50 mt-4">Remplissez les champs pour générer votre QR code.</p>}

          <div className="grid grid-cols-3 gap-2 w-full mt-5">
            <button onClick={downloadPng} className="flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              <Download size={13} /> PNG
            </button>
            <button onClick={downloadSvg} className="flex items-center justify-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              <Download size={13} /> SVG
            </button>
            <button onClick={downloadPdf} className="flex items-center justify-center gap-1.5 border border-white/15 hover:border-brand-magenta/40 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        <LeadCapture
          payload={{ toolType: "generateur-qr-code", inputData: { type, fields }, outputData: { payload } }}
          title="Enregistrer ce projet QR"
          description="Gardez une trace de ce QR code et recevez nos conseils pour vos supports imprimés."
          ctaLabel="Enregistrer le projet"
          compact
          onSaved={() => setSaved(true)}
        />
        {saved && (
          <p className="flex items-center gap-1.5 text-xs text-green-400">
            <CheckCircle2 size={14} /> Projet enregistré.
          </p>
        )}
      </div>
    </div>
  );
}
