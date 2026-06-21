"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterCTA({ source = "blog", compact = false }: { source?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState("error"); return; }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      setState(data.success ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className={`glassmorphism rounded-2xl border border-brand-orange/20 ${compact ? "p-5" : "p-6"} text-left space-y-3`}>
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-brand-orange/15 text-brand-orange"><Mail size={16} /></div>
        <h3 className="font-sora font-bold text-sm text-white">Conseils créatifs par e-mail</h3>
      </div>
      <p className="text-[11px] text-white/60 leading-relaxed">
        Recevez nos meilleurs conseils en design, branding et communication. Pas de spam, désinscription en un clic.
      </p>
      {state === "done" ? (
        <p className="flex items-center gap-1.5 text-xs text-green-400">
          <CheckCircle2 size={14} /> Inscription confirmée, merci !
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            className="w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            {state === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            S'inscrire
          </button>
          {state === "error" && <p className="text-[11px] text-red-400">Vérifiez votre e-mail et réessayez.</p>}
        </form>
      )}
    </div>
  );
}
