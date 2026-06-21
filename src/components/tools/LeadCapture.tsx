"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export interface LeadPayload {
  toolType: string;
  inputData?: unknown;
  outputData?: unknown;
}

/**
 * Reusable, optional lead-capture module.
 * Saves a ToolSubmission with the user's contact info + the generated result.
 * Used before a download or as a soft conversion step. GDPR-compliant: the
 * marketing consent checkbox is opt-in and required to store the email.
 */
export default function LeadCapture({
  payload,
  title = "Recevez votre création par e-mail",
  description = "Indiquez votre e-mail pour garder une copie. Aucune obligation, vous pouvez aussi simplement télécharger.",
  ctaLabel = "Envoyer",
  compact = false,
  onSaved,
}: {
  payload: LeadPayload;
  title?: string;
  description?: string;
  ctaLabel?: string;
  compact?: boolean;
  onSaved?: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez saisir un e-mail valide.");
      return;
    }
    if (!consent) {
      setError("Merci de cocher la case de consentement pour continuer.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/tools/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: payload.toolType,
          name: name || undefined,
          email,
          phone: phone || undefined,
          consentMarketing: consent,
          inputData: payload.inputData ?? {},
          outputData: payload.outputData ?? {},
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erreur");
      setState("done");
      onSaved?.(data.id);
    } catch (err) {
      setState("error");
      setError("Une erreur est survenue. Réessayez dans un instant.");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-5 flex items-center gap-3">
        <CheckCircle2 className="text-green-400 shrink-0" size={22} />
        <div>
          <p className="text-sm font-semibold text-green-300">C'est enregistré, merci !</p>
          <p className="text-xs text-white/60">Notre équipe pourra revenir vers vous avec une proposition adaptée.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-brand-purple/20 bg-brand-purple-dark/40 backdrop-blur-md p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-brand-magenta/15 text-brand-magenta">
          <Mail size={16} />
        </div>
        <div>
          <h3 className="text-sm font-sora font-bold text-white">{title}</h3>
          {!compact && <p className="text-[11px] text-white/55 leading-relaxed mt-0.5">{description}</p>}
        </div>
      </div>

      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom (facultatif)"
          aria-label="Votre nom"
          className="rounded-lg px-3 py-2.5 text-xs text-white outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre e-mail *"
          aria-label="Votre e-mail"
          required
          className="rounded-lg px-3 py-2.5 text-xs text-white outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone (facultatif)"
          aria-label="Votre téléphone"
          className="rounded-lg px-3 py-2.5 text-xs text-white outline-none"
        />
      </div>

      <label className="flex items-start gap-2.5 text-[11px] text-white/60 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-brand-magenta cursor-pointer"
        />
        <span>
          J'accepte qu'Art Vision conserve mes coordonnées pour me recontacter au sujet de mon projet
          et m'envoyer occasionnellement des conseils. Je peux me désinscrire à tout moment.
        </span>
      </label>

      {error && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer"
      >
        {state === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
        {ctaLabel}
      </button>
    </form>
  );
}
