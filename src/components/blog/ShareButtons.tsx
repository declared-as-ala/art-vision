"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const shareUrl = enc(url);
  const shareTitle = enc(title);

  const links = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: "X / Twitter", href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${shareTitle}%20${shareUrl}` },
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 text-left space-y-4">
      <h3 className="font-sora font-bold text-sm text-white flex items-center gap-2">
        <Share2 size={16} className="text-brand-orange" /> Partager l'article
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-magenta/30 text-white/80 text-xs py-2 rounded-lg font-medium transition text-center"
          >
            {l.name}
          </a>
        ))}
      </div>
      <button
        onClick={copy}
        className="w-full flex items-center justify-center gap-1.5 bg-brand-purple/20 border border-brand-purple/30 hover:bg-brand-purple/30 text-white/85 text-xs py-2 rounded-lg font-medium transition cursor-pointer"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Link2 size={13} />}
        {copied ? "Lien copié !" : "Copier le lien"}
      </button>
    </div>
  );
}
