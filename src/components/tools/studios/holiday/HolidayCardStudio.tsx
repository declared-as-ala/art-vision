"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Mail, Download, Sparkles, Printer, ArrowRight, Upload } from "lucide-react";

export default function HolidayCardStudio({ isThankYou = false }: { isThankYou?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [style, setStyle] = useState<"gold" | "night" | "minimal" | "traditional">("gold");
  const [format, setFormat] = useState<"simple" | "folded">("simple");
  const [title, setTitle] = useState(isThankYou ? "Merci pour votre confiance" : "Meilleurs Vœux 2027");
  const [subtitle, setSubtitle] = useState(isThankYou ? "Que cette nouvelle année concrétise tous vos projets" : "Paix, succès et créativité pour la nouvelle année");
  const [message, setMessage] = useState(
    isThankYou
      ? "Toute notre équipe vous remercie chaleureusement pour votre fidélité et vos collaborations tout au long de cette année. Nous avons hâte de bâtir de nouveaux succès à vos côtés en 2027."
      : "En cette période festive, nous vous adressons nos vœux les plus sincères de bonheur, d'inspiration et d'accomplissement. Que 2027 s'ouvre sur de magnifiques opportunités pour vous et vos proches."
  );
  const [senderName, setSenderName] = useState("L'équipe Art Vision");
  const [companyDetails, setCompanyDetails] = useState("www.art-visions.fr · contact@art-visions.fr");
  const [accentColor, setAccentColor] = useState("#CD7942");
  const [logoUrl, setLogoUrl] = useState<string>("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions A6 (ou A5 si pliée)
    const isFolded = format === "folded";
    const width = isFolded ? 2400 : 1200;
    const height = 1700;
    canvas.width = width;
    canvas.height = height;

    const drawHalf = async (startX: number, halfW: number, isInnerRight: boolean) => {
      // Fond selon le style
      if (style === "gold") {
        const bgGrad = ctx.createLinearGradient(startX, 0, startX + halfW, height);
        bgGrad.addColorStop(0, "#19082B");
        bgGrad.addColorStop(0.5, "#25123D");
        bgGrad.addColorStop(1, "#120520");
        ctx.fillStyle = bgGrad;
      } else if (style === "night") {
        const bgGrad = ctx.createLinearGradient(startX, 0, startX + halfW, height);
        bgGrad.addColorStop(0, "#0B1528");
        bgGrad.addColorStop(0.5, "#132342");
        bgGrad.addColorStop(1, "#070E1C");
        ctx.fillStyle = bgGrad;
      } else if (style === "traditional") {
        const bgGrad = ctx.createLinearGradient(startX, 0, startX + halfW, height);
        bgGrad.addColorStop(0, "#1B0B14");
        bgGrad.addColorStop(0.5, "#2D0E1C");
        bgGrad.addColorStop(1, "#12050E");
        ctx.fillStyle = bgGrad;
      } else {
        // Minimal
        const bgGrad = ctx.createLinearGradient(startX, 0, startX + halfW, height);
        bgGrad.addColorStop(0, "#1E182E");
        bgGrad.addColorStop(1, "#141021");
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(startX, 0, halfW, height);

      // Bordure ornementale
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(startX + 40, 40, halfW - 80, height - 80);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(startX + 50, 50, halfW - 100, height - 100);

      // Flocons / Étoiles décoratives d'arrière-plan
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      const starCoords = [
        [startX + 90, 90], [startX + halfW - 90, 90],
        [startX + 120, 300], [startX + halfW - 120, 320],
        [startX + 80, height - 120], [startX + halfW - 80, height - 120],
      ];
      for (const [sx, sy] of starCoords) {
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.fillText("✦", sx, sy);
      }

      const centerX = startX + halfW / 2;

      // Titre
      ctx.textAlign = "center";
      ctx.fillStyle = accentColor;
      ctx.font = "600 24px Montserrat, sans-serif";
      ctx.fillText("✦  JOYEUX ÉVÉNEMENT  ✦", centerX, 220);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 64px Montserrat, sans-serif";
      ctx.fillText(title, centerX, 320);

      // Sous-titre
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "500 28px Montserrat, sans-serif";
      ctx.fillText(subtitle, centerX, 385);

      // Filet séparateur
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 120, 440);
      ctx.lineTo(centerX + 120, 440);
      ctx.stroke();

      // Logo (si uploadé)
      if (logoUrl) {
        try {
          const img = new Image();
          img.src = logoUrl;
          await new Promise((res) => { img.onload = res; });
          const imgSize = 130;
          ctx.drawImage(img, centerX - imgSize / 2, 490, imgSize, imgSize);
        } catch {}
      }

      // Message (avec retour à la ligne automatique)
      const textStartY = logoUrl ? 670 : 540;
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.font = "400 27px Montserrat, sans-serif";
      const maxW = halfW - 240;
      const words = message.split(" ");
      let line = "";
      let curY = textStartY;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxW && i > 0) {
          ctx.fillText(line, centerX, curY);
          line = words[i] + " ";
          curY += 46;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, centerX, curY);

      // Signature
      ctx.fillStyle = accentColor;
      ctx.font = "700 32px Montserrat, sans-serif";
      ctx.fillText(senderName, centerX, height - 230);

      // Coordonnées
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "400 18px Montserrat, sans-serif";
      ctx.fillText(companyDetails, centerX, height - 160);
    };

    if (isFolded) {
      // Volet Gauche (Page 1 ou Couverture intérieure)
      await drawHalf(0, width / 2, false);

      // Ligne de pliure centrale en pointillés
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Volet Droit
      await drawHalf(width / 2, width / 2, true);
    } else {
      await drawHalf(0, width, true);
    }
  }, [style, format, title, subtitle, message, senderName, companyDetails, accentColor, logoUrl]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `carte-de-voeux-2027.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isFolded = format === "folded";
    const pdf = new jsPDF({
      orientation: isFolded ? "landscape" : "portrait",
      unit: "mm",
      format: isFolded ? "a5" : "a6",
    });
    const imgData = canvas.toDataURL("image/png");
    if (isFolded) {
      pdf.addImage(imgData, "PNG", 0, 0, 210, 148);
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, 105, 148);
    }
    pdf.save(`carte-de-voeux-2027.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Colonne réglages */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          <Mail size={16} /> Créateur de cartes de vœux {isThankYou ? "& Remerciements" : "2027"}
        </div>

        {/* Style & Format */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Ambiance visuelle</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="gold" className="bg-[#150933]">Or & Prestige</option>
              <option value="night" className="bg-[#150933]">Bleu Nuit Étoilé</option>
              <option value="traditional" className="bg-[#150933]">Rouge & Velours</option>
              <option value="minimal" className="bg-[#150933]">Minimaliste Moderne</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Format de carte</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="simple" className="bg-[#150933]">Simple A6 (105×148 mm)</option>
              <option value="folded" className="bg-[#150933]">Pliée 2 volets (A5 ouvert)</option>
            </select>
          </div>
        </div>

        {/* Upload Logo ou Photo */}
        <div className="border border-dashed border-white/20 p-3.5 rounded-2xl bg-white/5 space-y-1.5">
          <label className="text-xs font-semibold text-[#CD7942] flex items-center gap-1.5">
            <Upload size={14} /> Logo ou Photo personnelle (Optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="text-xs text-white/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-[#BA3184] file:text-white cursor-pointer"
          />
        </div>

        {/* Textes de la carte */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Titre principal</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Sous-titre / Message d'accroche</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Message personnalisé</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-xs leading-relaxed text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/70 block mb-1">Signature / Nom</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Couleur d'accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-white/70 font-mono">{accentColor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Coordonnées / Site</label>
            <input
              type="text"
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
        </div>

        {/* Actions Export & Devis */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-1.5 bg-[#CD7942] hover:bg-[#b86733] text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
            >
              <Download size={14} /> PDF Imprimable
            </button>
            <button
              onClick={downloadPNG}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <Download size={14} /> Image PNG
            </button>
          </div>

          <a
            href="/impression?produit=cartes-de-voeux"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Faire imprimer avec dorure or ou vernis sélectif <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu en direct */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Aperçu direct fidèle (300 DPI)
          </span>
          <span>Sans inscription · Sans filigrane</span>
        </div>
        <div className={`w-full max-w-[500px] ${format === "folded" ? "aspect-[2400/1700]" : "aspect-[1200/1700]"} rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#150933]`}>
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

