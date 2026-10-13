"use client";

import React, { useState, useRef } from "react";
import { Copy, Check, Upload, Mail, Phone, Globe, MapPin, Sparkles, AlertCircle } from "lucide-react";

export default function EmailSignatureStudio() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // All fields in French
  const [fullName, setFullName] = useState("Alexandre Dupont");
  const [jobTitle, setJobTitle] = useState("Directeur de Création");
  const [company, setCompany] = useState("Art Vision Studio");
  const [phone, setPhone] = useState("+32 490 22 49 05");
  const [email, setEmail] = useState("contact@art-visions.fr");
  const [website, setWebsite] = useState("https://art-visions.fr");
  const [address, setAddress] = useState("5 Rue de Constantine, 72000 Le Mans");
  const [primaryColor, setPrimaryColor] = useState("#D72888");

  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [logoSrc, setLogoSrc] = useState<string>("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setPhotoSrc(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogoSrc(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  // Ultra-compatible HTML table string for email clients
  const getSignatureHtml = () => {
    const cleanPhone = phone.replace(/\s+/g, "");
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#1c1917;font-size:13px;line-height:1.45;max-width:550px;">
  <tr>
    ${
      photoSrc
        ? `<td valign="top" style="padding-right:16px;">
        <img src="${photoSrc}" alt="${fullName}" width="72" height="72" style="border-radius:50%;display:block;width:72px;height:72px;object-fit:cover;border:2px solid ${primaryColor};" />
      </td>`
        : ""
    }
    <td valign="top" style="border-left:3px solid ${primaryColor};padding-left:16px;">
      ${
        logoSrc
          ? `<div style="margin-bottom:8px;">
          <img src="${logoSrc}" alt="${company}" height="32" style="display:block;height:32px;max-width:140px;object-fit:contain;" />
        </div>`
          : ""
      }
      <div style="font-size:16px;font-weight:bold;color:#110722;letter-spacing:-0.2px;">${fullName}</div>
      <div style="font-size:13px;color:${primaryColor};font-weight:600;margin-bottom:6px;">${jobTitle} • ${company}</div>
      <div style="font-size:12px;color:#555555;line-height:1.6;">
        <span style="display:inline-block;margin-right:12px;">📞 <a href="tel:${cleanPhone}" style="color:#110722;text-decoration:none;font-weight:500;">${phone}</a></span>
        <span style="display:inline-block;">✉️ <a href="mailto:${email}" style="color:${primaryColor};text-decoration:none;font-weight:500;">${email}</a></span>
        <br />
        <span style="display:inline-block;margin-right:12px;">🌐 <a href="${website}" target="_blank" style="color:#110722;text-decoration:none;">${website.replace(/^https?:\/\//, "")}</a></span>
        <span style="display:inline-block;color:#777777;">📍 ${address}</span>
      </div>
    </td>
  </tr>
</table>`;
  };

  // Copy visual formatted rich text (crucial for 1-click paste into Gmail and Apple Mail)
  const copyFormattedRichText = async () => {
    try {
      const html = getSignatureHtml();
      if (typeof window !== "undefined" && window.ClipboardItem) {
        const typeHtml = "text/html";
        const typePlain = "text/plain";
        const blobHtml = new Blob([html], { type: typeHtml });
        const blobPlain = new Blob([`${fullName}\n${jobTitle} - ${company}\n${phone} | ${email}\n${website}`], { type: typePlain });
        const data = [new ClipboardItem({ [typeHtml]: blobHtml, [typePlain]: blobPlain })];
        await navigator.clipboard.write(data);
      } else {
        await navigator.clipboard.writeText(html);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      await navigator.clipboard.writeText(getSignatureHtml());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyRawHtml = async () => {
    await navigator.clipboard.writeText(getSignatureHtml());
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2500);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_480px] text-left">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur de Signature E-mail</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Configurez votre signature avec photo, logo et liens cliquables. Compatible Gmail, Outlook et Apple Mail.
          </p>
        </div>

        {/* Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Fonction / Titre</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom de l'entreprise</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Couleur d'accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-10 rounded cursor-pointer bg-white/5"
              />
              <span className="text-xs text-white uppercase">{primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Téléphone direct</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Site internet</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Adresse postale</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Distinct Uploads: Photo & Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Photo de profil</label>
            <label className="flex items-center gap-2 px-3 py-2 border border-white/20 rounded-lg cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
              <Upload size={13} />
              <span>{photoSrc ? "Changer la photo" : "Importer ma photo"}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Logo entreprise</label>
            <label className="flex items-center gap-2 px-3 py-2 border border-white/20 rounded-lg cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
              <Upload size={13} />
              <span>{logoSrc ? "Changer le logo" : "Importer le logo"}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Visual Preview & Copy Buttons */}
      <div className="sticky top-24 space-y-4">
        {/* Visual Preview on white card */}
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl space-y-2">
          <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">
            Aperçu en direct (rendu client de messagerie)
          </span>
          <div
            ref={previewRef}
            className="p-5 rounded-xl bg-white shadow-lg overflow-x-auto text-left"
            dangerouslySetInnerHTML={{ __html: getSignatureHtml() }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={copyFormattedRichText}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Signature Copiée !" : "Copier la signature"}</span>
          </button>
          <button
            onClick={copyRawHtml}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            {copiedRaw ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedRaw ? "Code HTML Copié !" : "Copier code HTML"}</span>
          </button>
        </div>

        {/* Installation Instructions */}
        <div className="glassmorphism rounded-2xl p-5 border border-white/10 text-xs text-white/70 space-y-3">
          <div className="font-bold text-white text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-brand-orange" />
            <span>Instructions d'installation en 1 clic :</span>
          </div>

          <div className="space-y-2">
            <p>
              <strong className="text-white">Gmail :</strong> Cliquez sur <em>« Copier la signature »</em>, rendez-vous dans <em>Paramètres ⚙️ → Général → Signature</em>, puis faites simplement <strong>Ctrl + V (ou Cmd + V)</strong> dans la zone de texte.
            </p>
            <p>
              <strong className="text-white">Outlook :</strong> Allez dans <em>Fichier → Options → Courrier → Signatures</em>, créez une nouvelle signature et collez-la directement (Ctrl + V).
            </p>
            <p>
              <strong className="text-white">Apple Mail :</strong> Allez dans <em>Mail → Réglages → Signatures</em>, désactivez « Toujours utiliser ma police par défaut » et collez la signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
