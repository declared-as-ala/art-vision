"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QrTool() {
  const [text, setText] = useState("https://art-visions.tn");
  const [fg, setFg] = useState("#150933");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (!text.trim()) return;
    const opts = { margin: 2, width: 640, color: { dark: fg, light: "#ffffff" } };
    QRCode.toDataURL(text, opts).then(setPng).catch(() => setPng(""));
    QRCode.toString(text, { type: "svg", margin: 2, color: { dark: fg, light: "#ffffff" } }).then(setSvg).catch(() => setSvg(""));
  }, [text, fg]);

  const svgUrl = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-5 rounded-3xl bg-white p-6 ring-1 ring-line">
        <div className="grid gap-1.5"><Label htmlFor="qr-text">Lien ou texte</Label><Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} dir="ltr" /></div>
        <div className="grid gap-1.5"><Label htmlFor="qr-color">Couleur</Label>
          <input id="qr-color" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-20 cursor-pointer rounded-lg border border-line" />
        </div>
        <p className="text-xs text-soft">Gardez un fort contraste (foncé sur fond clair) et testez avec plusieurs téléphones avant impression.</p>
      </div>
      <div className="grid place-items-center rounded-3xl bg-tint-violet p-8">
        {png && text.trim() ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={png} alt="QR code généré" width={260} height={260} className="rounded-2xl bg-white p-3 shadow-sm" />
            <div className="mt-6 flex gap-3">
              <a href={png} download="qr-code.png" className="inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 text-sm font-medium text-white hover:bg-brand"><Download size={16} />PNG</a>
              <a href={svgUrl} download="qr-code.svg" className="inline-flex items-center gap-2 rounded-full bg-night px-5 py-2.5 text-sm font-medium text-white hover:bg-brand"><Download size={16} />SVG</a>
            </div>
          </>
        ) : (<p className="text-sm text-soft">Saisissez un lien pour générer le QR code.</p>)}
      </div>
    </div>
  );
}
