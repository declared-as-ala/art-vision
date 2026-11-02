"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Sparkles, Download, FileText, Printer, ArrowRight } from "lucide-react";

export default function HolidayInvitationStudio({ isSantaLetter = false }: { isSantaLetter?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Invitation fields
  const [eventTitle, setEventTitle] = useState("Réveillon du Nouvel An 2027");
  const [eventDate, setEventDate] = useState("Jeudi 31 Décembre 2026 dès 20h00");
  const [eventLocation, setEventLocation] = useState("Manoir des Arts, 14 Avenue Victor Hugo, 75016 Paris");
  const [dressCode, setDressCode] = useState("Tenue de soirée & Touche dorée");
  const [rsvpText, setRsvpText] = useState("Réponse souhaitée avant le 15 Décembre au 06 12 34 56 78");
  const [accentColor, setAccentColor] = useState("#CD7942");

  // Santa Letter fields
  const [childName, setChildName] = useState("Emma");
  const [childAge, setChildAge] = useState("7");
  const [childTown, setChildTown] = useState("Paris");
  const [goodDeeds, setGoodDeeds] = useState("J'ai bien travaillé à l'école, aidé mon petit frère et rangé ma chambre.");
  const [wishlist, setWishlist] = useState("1. Une boîte de peinture magique\n2. Un livre d'aventures avec des licornes\n3. Une trottinette lumineuse");

  const drawDocument = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 Format
    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    if (isSantaLetter) {
      // Fond féérique clair parchemin
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#FFF9F0");
      bgGrad.addColorStop(1, "#F6ECE0");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cadre festif rouge & or
      ctx.strokeStyle = "#BA3184";
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.strokeStyle = "#CD7942";
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 52, width - 104, height - 104);

      // Titre lettre
      ctx.textAlign = "center";
      ctx.fillStyle = "#BA3184";
      ctx.font = "800 64px Montserrat, sans-serif";
      ctx.fillText("🎅 CHER PÈRE NOËL ❄", width / 2, 170);

      ctx.font = "600 24px Montserrat, sans-serif";
      ctx.fillStyle = "#CD7942";
      ctx.fillText("✦ DIRECTION LE PÔLE NORD · MISSION NOËL ✦", width / 2, 220);

      // Encart présentation enfant
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "rgba(186, 49, 132, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(100, 270, width - 200, 160, 20);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "600 26px Montserrat, sans-serif";
      ctx.fillStyle = "#2D124D";
      ctx.fillText(`Je m'appelle : ${childName}`, 140, 335);
      ctx.fillText(`J'ai : ${childAge} ans`, 140, 385);
      ctx.fillText(`J'habite à : ${childTown}`, width / 2 + 30, 385);

      // Bonnes actions
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(100, 470, width - 200, 240, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#BA3184";
      ctx.font = "700 24px Montserrat, sans-serif";
      ctx.fillText("🌟 Cette année, j'ai été très sage :", 140, 525);

      ctx.fillStyle = "#333333";
      ctx.font = "500 22px Montserrat, sans-serif";
      ctx.fillText(goodDeeds, 140, 580);

      // Ma liste de souhaits
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(100, 750, width - 200, 680, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#CD7942";
      ctx.font = "700 26px Montserrat, sans-serif";
      ctx.fillText("🎁 Pour Noël, voici mes plus grands rêves :", 140, 815);

      const wishes = wishlist.split("\n").filter(Boolean);
      ctx.fillStyle = "#222222";
      ctx.font = "500 24px Montserrat, sans-serif";
      wishes.forEach((w, i) => {
        ctx.fillText(w, 140, 880 + i * 65);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(140, 895 + i * 65);
        ctx.lineTo(width - 140, 895 + i * 65);
        ctx.stroke();
      });

      // Espace dessin / mot
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(100, 1470, width - 200, 360, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#888888";
      ctx.font = "500 20px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🎨 Espace pour mon plus beau dessin pour le Père Noël et les rennes :", width / 2, 1520);

      // Signature enfant
      ctx.textAlign = "right";
      ctx.fillStyle = "#BA3184";
      ctx.font = "700 24px Montserrat, sans-serif";
      ctx.fillText(`Signé avec amour : ${childName} ❄`, width - 140, 1900);
    } else {
      // Fond carton invitation nuit de gala
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#120524");
      bgGrad.addColorStop(0.5, "#1F0E3D");
      bgGrad.addColorStop(1, "#0A0214");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Double bordure dorée
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      ctx.strokeStyle = "rgba(205, 121, 66, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(65, 65, width - 130, height - 130);

      ctx.textAlign = "center";

      // Accroche
      ctx.fillStyle = accentColor;
      ctx.font = "600 24px Montserrat, sans-serif";
      ctx.fillText("✦ VOUS ÊTES CHALEUREUSEMENT INVITÉS AU ✦", width / 2, 300);

      // Titre événement
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 64px Montserrat, sans-serif";
      ctx.fillText(eventTitle, width / 2, 420);

      // Séparateur étoile
      ctx.fillStyle = accentColor;
      ctx.font = "32px serif";
      ctx.fillText("✦  ❄  ✦", width / 2, 510);

      // Date et Heure
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 36px Montserrat, sans-serif";
      ctx.fillText(eventDate, width / 2, 660);

      // Lieu
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "400 26px Montserrat, sans-serif";
      ctx.fillText(eventLocation, width / 2, 750);

      // Dress code
      ctx.fillStyle = accentColor;
      ctx.font = "600 24px Montserrat, sans-serif";
      ctx.fillText(`DRESS CODE : ${dressCode.toUpperCase()}`, width / 2, 880);

      // Encart RSVP
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(140, 1050, width - 280, 200, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 26px Montserrat, sans-serif";
      ctx.fillText("CONFIRMATION DE PRÉSENCE (RSVP)", width / 2, 1120);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "400 22px Montserrat, sans-serif";
      ctx.fillText(rsvpText, width / 2, 1180);

      // Signature / Hôtes
      ctx.fillStyle = accentColor;
      ctx.font = "600 22px Montserrat, sans-serif";
      ctx.fillText("Nous nous réjouissons de célébrer ce moment d'exception ensemble.", width / 2, 1450);
    }
  }, [
    isSantaLetter,
    eventTitle,
    eventDate,
    eventLocation,
    dressCode,
    rsvpText,
    accentColor,
    childName,
    childAge,
    childTown,
    goodDeeds,
    wishlist,
  ]);

  useEffect(() => {
    drawDocument();
  }, [drawDocument]);

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(isSantaLetter ? "lettre-au-pere-noel.pdf" : "invitation-reveillon.pdf");
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = isSantaLetter ? "lettre-au-pere-noel.png" : "invitation-reveillon.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          {isSantaLetter ? <FileText size={16} /> : <Sparkles size={16} />}{" "}
          {isSantaLetter ? "Lettre au Père Noël" : "Invitation Réveillon"}
        </div>

        {isSantaLetter ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Prénom de l'enfant</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
                />
              </div>
              <div>
                <label className="text-xs text-white/70 block mb-1">Âge</label>
                <input
                  type="text"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Ville</label>
              <input
                type="text"
                value={childTown}
                onChange={(e) => setChildTown(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Mes bonnes actions</label>
              <input
                type="text"
                value={goodDeeds}
                onChange={(e) => setGoodDeeds(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Liste de cadeaux (1 par ligne)</label>
              <textarea
                rows={4}
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-sm leading-relaxed text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/70 block mb-1">Titre de l'invitation</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Date et Heure</label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Lieu & Adresse</label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Dress Code</label>
              <input
                type="text"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">Modalités RSVP</label>
              <input
                type="text"
                value={rsvpText}
                onChange={(e) => setRsvpText(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
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
        )}

        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-1.5 bg-[#CD7942] hover:bg-[#b86733] text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
            >
              <Download size={14} /> PDF Imprimable A4
            </button>
            <button
              onClick={downloadPNG}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <Download size={14} /> Image PNG
            </button>
          </div>

          <a
            href="/impression?produit=invitations"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Faire imprimer vos cartons d'invitation <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Document A4 Haute Définition
          </span>
          <span>100% Gratuit · Prêt à imprimer</span>
        </div>
        <div className="w-full max-w-[480px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

