"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Copy, Download, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";
import type { ToolDef } from "@/lib/tools";

type Row = { id: string; name: string; description: string; price: string };
type Section = { id: string; title: string; rows: Row[] };

const W = 1000;
const H = 1414;
const inputCls = "w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none";
const smallButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-purple/30 px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-brand-magenta/50";
const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-orange/90";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawRound(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-white/70">{label}</span>
      {children}
    </label>
  );
}

function CanvasExport({ canvasRef, draw, filename }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; draw: () => Promise<void>; filename: string }) {
  const downloadPng = async () => {
    await draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${filename}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPdf = async () => {
    await draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
    pdf.save(`${filename}.pdf`);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button className={primaryButton} onClick={downloadPng}><Download size={14} /> PNG</button>
      <button className={primaryButton.replace("bg-brand-orange", "bg-brand-purple").replace("hover:bg-brand-orange/90", "hover:bg-brand-purple/90")} onClick={downloadPdf}><Download size={14} /> PDF</button>
    </div>
  );
}

function useFileData() {
  const [src, setSrc] = useState("");
  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      alert("Fichier trop lourd. Utilisez une image de moins de 7 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setSrc(String(e.target?.result || ""));
    reader.readAsDataURL(file);
  };
  return { src, setSrc, onFile };
}

function VisualDocumentTool({ tool }: { tool: ToolDef }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logo = useFileData();
  const [accent, setAccent] = useState(tool.accent);
  const [template, setTemplate] = useState("moderne");
  const [title, setTitle] = useState(defaultTitle(tool.slug));
  const [subtitle, setSubtitle] = useState(defaultSubtitle(tool.slug));
  const [contact, setContact] = useState("12 rue des Arts, Paris | 01 23 45 67 89");
  const [sections, setSections] = useState<Section[]>(defaultSections(tool.slug));
  const [qrValue, setQrValue] = useState("https://art-visions.fr");
  const [stamps, setStamps] = useState(8);
  const [message, setMessage] = useState(defaultMessage(tool.slug));

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await document.fonts.ready;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const font = "Montserrat, Arial, sans-serif";
    const dark = template === "premium" || template === "bar";
    const bg = dark ? "#10071f" : "#fffaf4";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, 260);
    grad.addColorStop(0, accent);
    grad.addColorStop(1, dark ? "#2D2966" : "#f3e8ff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 250);
    ctx.fillStyle = dark ? "#ffffff" : "#171625";
    ctx.textBaseline = "top";
    ctx.font = `800 58px ${font}`;
    wrap(ctx, title, 700).slice(0, 2).forEach((line, index) => ctx.fillText(line, 70, 62 + index * 66));
    ctx.font = `400 26px ${font}`;
    ctx.fillStyle = dark ? "rgba(255,255,255,.78)" : "#4b415a";
    wrap(ctx, subtitle, 700).slice(0, 2).forEach((line, index) => ctx.fillText(line, 72, 175 + index * 34));

    if (logo.src) {
      try {
        const image = await loadImage(logo.src);
        const size = 150;
        ctx.drawImage(image, W - 220, 62, size, (image.height / image.width) * size);
      } catch {}
    }

    if (tool.slug.includes("qr-code")) {
      const qr = await QRCode.toDataURL(qrValue || "https://art-visions.fr", { margin: 2, width: 520, errorCorrectionLevel: "H", color: { dark: "#111111", light: "#ffffff" } });
      const image = await loadImage(qr);
      ctx.fillStyle = "#ffffff";
      drawRound(ctx, 235, 365, 530, 530, 26);
      ctx.fill();
      ctx.drawImage(image, 250, 380, 500, 500);
      ctx.fillStyle = "#171625";
      ctx.font = `800 50px ${font}`;
      ctx.textAlign = "center";
      wrap(ctx, message, 780).slice(0, 3).forEach((line, index) => ctx.fillText(line, W / 2, 930 + index * 60));
      ctx.textAlign = "left";
    } else if (tool.slug.includes("fidelite")) {
      ctx.fillStyle = dark ? "#ffffff" : "#171625";
      ctx.font = `800 44px ${font}`;
      ctx.fillText(message, 70, 320);
      const cols = stamps === 5 ? 5 : stamps === 6 ? 3 : 4;
      const box = 150;
      for (let i = 0; i < stamps; i++) {
        const x = 90 + (i % cols) * 210;
        const y = 450 + Math.floor(i / cols) * 190;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 8;
        drawRound(ctx, x, y, box, box, 26);
        ctx.stroke();
        ctx.font = `700 32px ${font}`;
        ctx.fillStyle = dark ? "rgba(255,255,255,.45)" : "#7a708a";
        ctx.fillText(String(i + 1), x + 58, y + 55);
      }
    } else {
      let y = 330;
      for (const section of sections.slice(0, 6)) {
        ctx.fillStyle = accent;
        ctx.font = `800 34px ${font}`;
        ctx.fillText(section.title, 70, y);
        y += 50;
        for (const row of section.rows.slice(0, 6)) {
          ctx.fillStyle = dark ? "#ffffff" : "#171625";
          ctx.font = `700 27px ${font}`;
          ctx.fillText(row.name, 90, y);
          ctx.textAlign = "right";
          ctx.fillText(row.price, W - 80, y);
          ctx.textAlign = "left";
          ctx.fillStyle = dark ? "rgba(255,255,255,.58)" : "#61576f";
          ctx.font = `400 20px ${font}`;
          wrap(ctx, row.description, 720).slice(0, 2).forEach((line, index) => ctx.fillText(line, 90, y + 34 + index * 25));
          y += row.description ? 92 : 54;
        }
        y += 24;
      }
    }

    ctx.fillStyle = dark ? "rgba(255,255,255,.65)" : "#61576f";
    ctx.font = `500 22px ${font}`;
    wrap(ctx, contact, 820).slice(0, 2).forEach((line, index) => ctx.fillText(line, 70, H - 120 + index * 30));
    ctx.fillStyle = accent;
    ctx.fillRect(70, H - 55, 120, 8);
    ctx.fillStyle = dark ? "rgba(255,255,255,.45)" : "#8a8197";
    ctx.font = `400 18px ${font}`;
    ctx.fillText("Créé avec Art Visions", 210, H - 62);
  }, [accent, contact, logo.src, message, qrValue, sections, stamps, template, title, tool.accent, tool.slug, subtitle]);

  useEffect(() => {
    draw();
  }, [draw]);

  const addRow = (sectionId: string) => {
    setSections((prev) => prev.map((section) => section.id === sectionId ? { ...section, rows: [...section.rows, { id: uid(), name: "Nouvel élément", description: "Description courte", price: "9 €" }] } : section));
  };

  const updateRow = (sectionId: string, rowId: string, key: keyof Row, value: string) => {
    setSections((prev) => prev.map((section) => section.id === sectionId ? { ...section, rows: section.rows.map((row) => row.id === rowId ? { ...row, [key]: value } : row) } : section));
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="glassmorphism space-y-5 rounded-2xl p-5 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom / titre"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Style"><select className={inputCls} value={template} onChange={(e) => setTemplate(e.target.value)}><option value="moderne">Moderne</option><option value="premium">Premium</option><option value="bar">Bar / nuit</option></select></Field>
          <Field label="Sous-titre"><input className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
          <Field label="Couleur"><input type="color" className="h-11 w-full cursor-pointer rounded-lg" value={accent} onChange={(e) => setAccent(e.target.value)} /></Field>
        </div>
        <Field label="Coordonnées"><input className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} /></Field>
        <label className={smallButton}>
          <Upload size={14} /> {logo.src ? "Changer le logo" : "Importer un logo"}
          <input type="file" accept="image/*" className="hidden" onChange={logo.onFile} />
        </label>

        {tool.slug.includes("qr-code") && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL ou texte du QR code"><input className={inputCls} value={qrValue} onChange={(e) => setQrValue(e.target.value)} /></Field>
            <Field label="Message affiche"><input className={inputCls} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
          </div>
        )}

        {tool.slug.includes("fidelite") && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre de cases"><select className={inputCls} value={stamps} onChange={(e) => setStamps(Number(e.target.value))}>{[5, 6, 8, 10].map((n) => <option key={n} value={n}>{n} tampons</option>)}</select></Field>
            <Field label="Récompense"><input className={inputCls} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
          </div>
        )}

        {!tool.slug.includes("qr-code") && !tool.slug.includes("fidelite") && sections.map((section) => (
          <div key={section.id} className="rounded-xl border border-brand-purple/20 p-4">
            <Field label="Catégorie"><input className={inputCls} value={section.title} onChange={(e) => setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s))} /></Field>
            <div className="mt-3 space-y-3">
              {section.rows.map((row) => (
                <div key={row.id} className="grid gap-2 md:grid-cols-[1fr_1.3fr_90px_44px]">
                  <input aria-label="Nom" className={inputCls} value={row.name} onChange={(e) => updateRow(section.id, row.id, "name", e.target.value)} />
                  <input aria-label="Description" className={inputCls} value={row.description} onChange={(e) => updateRow(section.id, row.id, "description", e.target.value)} />
                  <input aria-label="Prix" className={inputCls} value={row.price} onChange={(e) => updateRow(section.id, row.id, "price", e.target.value)} />
                  <button className={smallButton} aria-label="Supprimer" onClick={() => setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, rows: s.rows.filter((r) => r.id !== row.id) } : s))}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button className={`${smallButton} mt-3`} onClick={() => addRow(section.id)}><Plus size={14} /> Ajouter une ligne</button>
          </div>
        ))}
      </div>

      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-5">
          <canvas ref={canvasRef} width={W} height={H} className="mx-auto aspect-[1000/1414] w-full max-w-[360px] rounded-xl border border-white/10 bg-white shadow-2xl" aria-label={`Aperçu ${tool.title}`} />
          <p className="mt-4 text-xs leading-relaxed text-white/55">Confidentialité : les images importées restent dans votre navigateur et servent uniquement à générer l'aperçu.</p>
        </div>
        <CanvasExport canvasRef={canvasRef} draw={draw} filename={tool.slug} />
      </div>
    </div>
  );
}

function SignatureTool() {
  const logo = useFileData();
  const photo = useFileData();
  const [d, setD] = useState({ name: "Camille Martin", role: "Fondatrice", company: "Maison Exemple", phone: "01 23 45 67 89", email: "contact@example.fr", website: "www.example.fr", address: "Paris, France", linkedin: "", instagram: "", color: "#BA3184" });
  const html = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:#171625"><tr><td style="padding-right:14px">${photo.src ? `<img src="${photo.src}" width="72" height="72" style="border-radius:50%;object-fit:cover">` : ""}</td><td style="border-left:3px solid ${d.color};padding-left:14px">${logo.src ? `<img src="${logo.src}" width="96" style="display:block;margin-bottom:8px">` : ""}<strong style="font-size:16px">${d.name}</strong><br><span style="color:#555">${d.role} - ${d.company}</span><br><a href="mailto:${d.email}" style="color:${d.color}">${d.email}</a> · ${d.phone}<br><span>${d.website} · ${d.address}</span></td></tr></table>`;
  const copy = async () => navigator.clipboard.writeText(html);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glassmorphism grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
        {Object.entries(d).filter(([k]) => k !== "color").map(([key, value]) => (
          <Field key={key} label={key}><input className={inputCls} value={value} onChange={(e) => setD((p) => ({ ...p, [key]: e.target.value }))} /></Field>
        ))}
        <Field label="Couleur"><input type="color" className="h-11 w-full rounded-lg" value={d.color} onChange={(e) => setD((p) => ({ ...p, color: e.target.value }))} /></Field>
        <label className={smallButton}><Upload size={14} /> Logo<input type="file" accept="image/*" className="hidden" onChange={logo.onFile} /></label>
        <label className={smallButton}><Upload size={14} /> Photo<input type="file" accept="image/*" className="hidden" onChange={photo.onFile} /></label>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6" dangerouslySetInnerHTML={{ __html: html }} />
        <button className={primaryButton} onClick={copy}><Copy size={14} /> Copier le HTML</button>
        <div className="glassmorphism rounded-2xl p-5 text-sm leading-relaxed text-white/70">
          <h2 className="mb-3 text-lg font-bold text-white">Installation rapide</h2>
          <p>Gmail : Paramètres, Voir tous les paramètres, Signature, collez le HTML. Outlook : Fichier, Options, Courrier, Signatures. Apple Mail : Mail, Réglages, Signatures.</p>
        </div>
      </div>
    </div>
  );
}

function ResolutionTool() {
  const [result, setResult] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState("A4");
  const formats: Record<string, [number, number]> = { A6: [105, 148], A5: [148, 210], A4: [210, 297], A3: [297, 420], A2: [420, 594], A1: [594, 841], Flyer: [148, 210], "Carte de visite": [85, 55], Poster: [500, 700], "Roll-up": [850, 2000] };
  const dims = formats[format];
  const dpi = result ? Math.min(result.w / (dims[0] / 25.4), result.h / (dims[1] / 25.4)) : 0;
  const status = dpi >= 300 ? "Excellent pour impression" : dpi >= 150 ? "Acceptable" : "Résolution insuffisante";
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setResult({ w: img.width, h: img.height });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glassmorphism space-y-4 rounded-2xl p-6">
        <Field label="Image à vérifier"><input className={inputCls} type="file" accept="image/*" onChange={onFile} /></Field>
        <Field label="Format visé"><select className={inputCls} value={format} onChange={(e) => setFormat(e.target.value)}>{Object.keys(formats).map((f) => <option key={f}>{f}</option>)}</select></Field>
        <p className="text-sm text-white/60">Votre image est analysée localement dans le navigateur.</p>
      </div>
      <div className="glassmorphism rounded-2xl p-6">
        {result ? (
          <div className="space-y-4">
            <p className="text-2xl font-extrabold text-white">{status}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Pixels" value={`${result.w} x ${result.h}`} />
              <Stat label="Ratio" value={(result.w / result.h).toFixed(2)} />
              <Stat label={`DPI estimé ${format}`} value={`${Math.round(dpi)} DPI`} />
              <Stat label="Max à 300 DPI" value={`${Math.round((result.w / 300) * 25.4)} x ${Math.round((result.h / 300) * 25.4)} mm`} />
              <Stat label="Acceptable à 150 DPI" value={`${Math.round((result.w / 150) * 25.4)} x ${Math.round((result.h / 150) * 25.4)} mm`} />
            </dl>
          </div>
        ) : <p className="text-white/65">Importez une image pour obtenir le diagnostic.</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-brand-purple/20 p-4"><dt className="text-xs text-white/45">{label}</dt><dd className="mt-1 font-bold text-white">{value}</dd></div>;
}

function PlannerTool({ brief = false }: { brief?: boolean }) {
  const [business, setBusiness] = useState("Restaurant indépendant");
  const [objective, setObjective] = useState("visibilité");
  const [platforms, setPlatforms] = useState("Instagram, Facebook");
  const [weeks, setWeeks] = useState(4);
  const rows = useMemo(() => {
    if (brief) return [];
    const ideas = ["Conseil pratique", "Coulisses", "Preuve client", "Offre", "Avant / après", "Question à la communauté", "Focus produit"];
    return Array.from({ length: weeks * 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i * 2);
      return { date: date.toLocaleDateString("fr-FR"), platform: platforms.split(",")[i % platforms.split(",").length]?.trim() || "Instagram", theme: ideas[i % ideas.length], format: i % 3 === 0 ? "Reel" : i % 3 === 1 ? "Carrousel" : "Post", idea: `${ideas[i % ideas.length]} pour ${business}`, cta: objective === "ventes" ? "Réserver / acheter" : "Commenter / partager" };
    });
  }, [business, objective, platforms, weeks, brief]);
  const briefText = `Brief site web - ${business}\n\nObjectif principal : ${objective}\nType de site : site vitrine / e-commerce selon besoin\nPages attendues : Accueil, Services, À propos, Réalisations, Contact\nFonctionnalités : formulaire, SEO local, analytics, contenus administrables\nLangues : français, option Belgique francophone\nInspirations : à compléter\nDélai et budget : à préciser\n\nCe brief peut être envoyé à Art Visions pour préparer un devis.`;
  const downloadCsv = () => {
    const csv = ["date,plateforme,theme,format,idee,cta", ...rows.map((r) => [r.date, r.platform, r.theme, r.format, r.idea, r.cta].map((v) => `"${v}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "planning-publications.csv";
    a.click();
  };
  const copyBrief = () => navigator.clipboard.writeText(briefText);
  return (
    <div className="space-y-6">
      <div className="glassmorphism grid gap-4 rounded-2xl p-6 md:grid-cols-4">
        <Field label="Activité"><input className={inputCls} value={business} onChange={(e) => setBusiness(e.target.value)} /></Field>
        <Field label="Objectif"><select className={inputCls} value={objective} onChange={(e) => setObjective(e.target.value)}>{["visibilité", "engagement", "ventes", "trafic", "leads", "notoriété"].map((o) => <option key={o}>{o}</option>)}</select></Field>
        <Field label="Plateformes"><input className={inputCls} value={platforms} onChange={(e) => setPlatforms(e.target.value)} /></Field>
        {!brief && <Field label="Période"><input className={inputCls} type="number" min={1} max={12} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} /></Field>}
      </div>
      {brief ? (
        <div className="glassmorphism rounded-2xl p-6">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{briefText}</pre>
          <button className={`${primaryButton} mt-4`} onClick={copyBrief}><Copy size={14} /> Copier le brief</button>
        </div>
      ) : (
        <div className="glassmorphism overflow-x-auto rounded-2xl p-4">
          <table className="w-full min-w-[760px] text-left text-sm text-white/70">
            <thead className="text-xs uppercase text-white/45"><tr>{["Date", "Plateforme", "Thème", "Format", "Idée", "CTA", "Statut"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-white/10"><td className="p-3">{r.date}</td><td className="p-3">{r.platform}</td><td className="p-3">{r.theme}</td><td className="p-3">{r.format}</td><td className="p-3">{r.idea}</td><td className="p-3">{r.cta}</td><td className="p-3"><input type="checkbox" aria-label="Statut" /></td></tr>)}</tbody>
          </table>
          <button className={`${primaryButton} mt-4`} onClick={downloadCsv}><Download size={14} /> Export CSV</button>
        </div>
      )}
    </div>
  );
}

export default function UniversalToolStudio({ tool }: { tool: ToolDef }) {
  if (tool.slug === "generateur-signature-email") return <SignatureTool />;
  if (tool.slug === "verificateur-resolution-image-impression") return <ResolutionTool />;
  if (tool.slug === "planificateur-publications") return <PlannerTool />;
  if (tool.slug === "generateur-brief-site-web") return <PlannerTool brief />;
  return <VisualDocumentTool tool={tool} />;
}

function defaultTitle(slug: string) {
  if (slug.includes("menu")) return "Maison Délicieuse";
  if (slug.includes("tarifaire")) return "Grille tarifaire";
  if (slug.includes("fidelite")) return "Carte fidélité";
  if (slug.includes("cadeau")) return "Bon cadeau";
  if (slug.includes("horaires")) return "Horaires d'ouverture";
  if (slug.includes("mockup")) return "Aperçu de marque";
  if (slug.includes("visuel-produit")) return "Offre spéciale";
  if (slug.includes("charte")) return "Mini charte graphique";
  return "Votre support";
}

function defaultSubtitle(slug: string) {
  if (slug.includes("menu")) return "Cuisine fraîche et maison";
  if (slug.includes("tarifaire")) return "Prestations et prix";
  if (slug.includes("cadeau")) return "À offrir à la personne de votre choix";
  if (slug.includes("qr-code")) return "Scannez le code avec votre téléphone";
  if (slug.includes("horaires")) return "Nous sommes heureux de vous accueillir";
  return "Personnalisez ce modèle avec vos informations";
}

function defaultMessage(slug: string) {
  if (slug.includes("fidelite")) return "10e passage offert";
  if (slug.includes("qr-code")) return "Scannez-moi";
  if (slug.includes("cadeau")) return "Bon cadeau valable 6 mois";
  return "Votre message principal";
}

function defaultSections(slug: string): Section[] {
  if (slug.includes("horaires")) {
    return [{ id: uid(), title: "Horaires", rows: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => ({ id: uid(), name: day, description: day === "Dimanche" ? "Fermé" : "09:00 - 18:30", price: "" })) }];
  }
  if (slug.includes("charte")) {
    return [{ id: uid(), title: "Palette", rows: [{ id: uid(), name: "Couleur principale", description: "HEX #BA3184 / RGB 186, 49, 132", price: "" }, { id: uid(), name: "Typographie", description: "Montserrat pour les titres et textes", price: "" }] }];
  }
  if (slug.includes("produit")) {
    return [{ id: uid(), title: "Promotion", rows: [{ id: uid(), name: "Produit phare", description: "Description courte de l'offre", price: "29 €" }, { id: uid(), name: "Remise", description: "Offre limitée cette semaine", price: "-20%" }] }];
  }
  return [
    { id: uid(), title: slug.includes("menu") ? "Entrées" : "Prestations", rows: [{ id: uid(), name: slug.includes("menu") ? "Salade de saison" : "Service essentiel", description: "Description courte et claire", price: "9 €" }, { id: uid(), name: slug.includes("menu") ? "Plat du jour" : "Formule complète", description: "Votre texte de présentation", price: "18 €" }] },
    { id: uid(), title: slug.includes("menu") ? "Desserts" : "Options", rows: [{ id: uid(), name: "Suggestion", description: "À personnaliser", price: "6 €" }] },
  ];
}
