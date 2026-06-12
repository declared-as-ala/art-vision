"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogIn, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(data.error || "Identifiants incorrects.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col justify-center items-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-purple/20 rounded-full filter blur-[80px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md space-y-8 text-center">
        {/* Title Logo */}
        <div className="space-y-3">
          <span className="font-sora font-extrabold text-3xl tracking-widest text-white">
            ART <span className="text-brand-magenta">VISION</span>
          </span>
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold flex items-center justify-center space-x-1">
            <Sparkles size={12} className="text-brand-orange" />
            <span>Tableau de Bord Sécurisé</span>
          </p>
        </div>

        {/* Login box */}
        <div className="glassmorphism rounded-2xl p-6 md:p-8 border border-brand-purple/30 shadow-2xl">
          <h2 className="font-sora font-bold text-lg text-white mb-6 text-left">
            Connexion
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs text-white/70">Adresse e-mail admin</label>
              <input
                type="email"
                placeholder="admin@artvision.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                required
              />
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
              className="w-full bg-brand-magenta hover:bg-brand-magenta/95 text-white py-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-brand-magenta/15"
            >
              <span>{submitting ? "Connexion..." : "Accéder à l'administration"}</span>
              <LogIn size={14} />
            </button>
          </form>
        </div>

        <p className="text-[10px] text-white/45">
          Réservé aux collaborateurs habilités de SAS ART VISION.
        </p>
      </div>
    </div>
  );
}
