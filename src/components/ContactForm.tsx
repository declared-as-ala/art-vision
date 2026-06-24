"use client";

import React, { useState } from "react";
import { Send, Check, ShieldAlert } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg("Vous devez accepter que vos données soient collectées pour envoyer le message.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, website, sourceUrl: window.location.href }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Une erreur s'est produite lors de l'envoi.");
      }
    } catch (e) {
      setErrorMsg("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
          <Check size={24} />
        </div>
        <h3 className="font-sora font-bold text-lg text-white">Message envoyé !</h3>
        <p className="text-xs text-white/70 leading-relaxed">
          Merci pour votre message. Un conseiller d'Art Vision va l'étudier et vous répondra sous peu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-white/70">Nom Complet *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Adresse Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/70">Téléphone (Optionnel)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/70">Votre message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
          required
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start space-x-2 pt-2">
        <input
          type="checkbox"
          id="contact-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-brand-purple/30 bg-brand-navy accent-brand-magenta cursor-pointer"
          required
        />
        <label htmlFor="contact-consent" className="text-[10px] text-white/55 leading-relaxed cursor-pointer select-none">
          J'accepte que mes données soient transmises à SAS ART VISION pour le traitement de ma demande. *
        </label>
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
          <ShieldAlert size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-brand-orange/15"
      >
        <span>{submitting ? "Envoi..." : "Envoyer mon message"}</span>
        <Send size={12} />
      </button>
    </form>
  );
}
