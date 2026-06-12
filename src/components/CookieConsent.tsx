"use client";

import { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("art_vision_cookie_consent");
    if (!consent) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("art_vision_cookie_consent", "accepted");
    setShowBanner(false);
    // Trigger window event for trackers to reload
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleReject = () => {
    localStorage.setItem("art_vision_cookie_consent", "rejected");
    setShowBanner(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 glassmorphism rounded-2xl shadow-2xl p-6 border border-brand-magenta/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start space-x-4">
        <div className="bg-brand-magenta/10 p-2.5 rounded-xl shrink-0 text-brand-magenta">
          <ShieldCheck size={24} />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-sora font-semibold text-sm text-white">
            Respect de votre vie privée
          </h4>
          <p className="text-xs text-white/75 leading-relaxed">
            Nous utilisons des cookies analytiques pour améliorer votre expérience de navigation et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.
          </p>
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleAccept}
              className="bg-brand-magenta hover:bg-brand-magenta/90 text-white text-xs px-4 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Tout accepter
            </button>
            <button
              onClick={handleReject}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Refuser
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-white/40 hover:text-white transition shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
