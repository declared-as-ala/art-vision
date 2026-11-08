"use client";

import React, { useState } from "react";
import {
  StudioDesign,
  StudioElement,
  StudioTemplate,
} from "./studioTypes";
import { STUDIO_TEMPLATES } from "./StudioTemplates";
import {
  Type,
  Square,
  Circle,
  Minus,
  Image as ImageIcon,
  Palette,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  AlertTriangle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from "lucide-react";

interface StudioSidebarProps {
  design: StudioDesign;
  activeSide: "recto" | "verso";
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: StudioElement) => void;
  onUpdateElement: (id: string, updates: Partial<StudioElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onUpdateBackgroundColor: (color: string) => void;
  onApplyTemplate: (template: StudioTemplate) => void;
}

type SidebarTab = "templates" | "text" | "shapes" | "images" | "background" | "layers";

export default function StudioSidebar({
  design,
  activeSide,
  selectedElementId,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onUpdateBackgroundColor,
  onApplyTemplate,
}: StudioSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("templates");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lowResWarning, setLowResWarning] = useState<string | null>(null);

  const currentSide = activeSide === "recto" ? design.recto : design.verso;
  const selectedElement = currentSide.elements.find((el) => el.id === selectedElementId) || null;

  // Predefined Google Fonts
  const FONTS = [
    { name: "Montserrat", label: "Montserrat (Moderne)" },
    { name: "Playfair Display", label: "Playfair (Élégant / Luxe)" },
    { name: "Inter", label: "Inter (Épuré)" },
    { name: "Cinzel", label: "Cinzel (Classique)" },
    { name: "Oswald", label: "Oswald (Impact)" },
  ];

  // Quick Colors
  const PALETTE_COLORS = [
    "#000000", "#ffffff", "#08051F", "#1A1238", "#6C2BD9", "#D72888", "#FF6A00",
    "#f59e0b", "#10b981", "#3b82f6", "#06b6d4", "#ec4899", "#d4af37", "#94a3b8",
  ];

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (PNG, JPG, SVG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Quality check: less than 600px width might be blurry when printed
        if (img.width < 600 || img.height < 600) {
          setLowResWarning("Attention : votre image fait moins de 600 px. Pour une impression optimale à 300 DPI, privilégiez un fichier haute résolution ou vectoriel.");
        } else {
          setLowResWarning(null);
        }

        // Calculate aspect ratio
        const aspect = img.width / img.height;
        const defaultWidth = 30; // 30mm
        const defaultHeight = defaultWidth / aspect;

        const newElement: StudioElement = {
          id: `img-${Date.now()}`,
          type: "image",
          x: (design.widthMm - defaultWidth) / 2,
          y: (design.heightMm - defaultHeight) / 2,
          width: Math.round(defaultWidth),
          height: Math.round(defaultHeight),
          src,
          naturalWidth: img.width,
          naturalHeight: img.height,
        };

        onAddElement(newElement);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <aside className="w-80 md:w-88 bg-[#0c081e] border-r border-brand-purple/20 flex flex-col h-full z-20">
      {/* Tab Navigation Icons */}
      <div className="flex border-b border-brand-purple/20 bg-[#080516] px-1 py-1 overflow-x-auto no-scrollbar">
        {[
          { id: "templates", label: "Modèles", icon: Sparkles },
          { id: "text", label: "Texte", icon: Type },
          { id: "shapes", label: "Formes", icon: Square },
          { id: "images", label: "Images", icon: ImageIcon },
          { id: "background", label: "Fond", icon: Palette },
          { id: "layers", label: "Calques", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SidebarTab)}
              className={`flex-1 min-w-[50px] py-2.5 flex flex-col items-center gap-1 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-brand-purple/30 text-brand-orange border border-brand-purple/40"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: TEMPLATES */}
        {activeTab === "templates" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-montserrat">
                <Sparkles size={15} className="text-brand-orange" /> Modèles professionnels
              </h3>
              <p className="text-[11px] text-white/50">Choisissez un modèle prêt à personnaliser pour vos cartes.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Tous" },
                { id: "artisan", label: "Artisans" },
                { id: "restaurant", label: "Restauration" },
                { id: "beaute", label: "Beauté" },
                { id: "commerce", label: "Commerces" },
                { id: "freelance", label: "Studios" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-full transition cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-brand-magenta text-white font-bold"
                      : "bg-white/5 text-white/65 hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Template Cards */}
            <div className="space-y-3 pt-1">
              {STUDIO_TEMPLATES.filter(
                (t) => selectedCategory === "all" || t.category === selectedCategory
              ).map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    if (confirm(`Appliquer le modèle « ${t.name} » ? Votre création actuelle sera remplacée.`)) {
                      onApplyTemplate(t);
                    }
                  }}
                  className="group relative p-3 rounded-xl border border-brand-purple/20 bg-[#160f2e]/60 hover:border-brand-orange transition-all cursor-pointer overflow-hidden space-y-2 hover:shadow-lg hover:shadow-brand-orange/10"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white group-hover:text-brand-orange transition">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {t.categoryLabel}
                    </span>
                  </div>

                  {/* Micro Visual Card Mockup */}
                  <div
                    className="w-full h-24 rounded-lg flex flex-col justify-between p-2.5 border border-white/10"
                    style={{ backgroundColor: t.design.recto.backgroundColor }}
                  >
                    <div className="space-y-1">
                      <div
                        className="h-2 w-20 rounded-xs"
                        style={{
                          backgroundColor:
                            t.design.recto.elements.find((el) => el.type === "text")?.color || "#ffffff",
                        }}
                      />
                      <div className="h-1 w-28 bg-white/20 rounded-xs" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="h-1 w-16 bg-white/30 rounded-xs" />
                      <span className="text-[9px] text-brand-orange font-bold">Recto/Verso</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TEXT */}
        {activeTab === "text" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-montserrat">Ajouter du texte</h3>
              <p className="text-[11px] text-white/50">Cliquez pour ajouter un bloc de texte sur le {activeSide}.</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  onAddElement({
                    id: `text-${Date.now()}`,
                    type: "text",
                    x: 10,
                    y: 15,
                    width: 65,
                    height: 8,
                    text: "VOTRE TITRE ICI",
                    fontFamily: "Montserrat",
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#ffffff",
                    textAlign: "center",
                  })
                }
                className="w-full p-2.5 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 rounded-xl text-xs font-bold text-white text-left flex items-center justify-between transition cursor-pointer"
              >
                <span>+ Titre principal</span>
                <span className="text-[10px] text-white/40">15 pt</span>
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: `text-${Date.now()}`,
                    type: "text",
                    x: 10,
                    y: 25,
                    width: 65,
                    height: 6,
                    text: "Sous-titre ou activité",
                    fontFamily: "Montserrat",
                    fontSize: 9,
                    fontWeight: "600",
                    color: "#FF6A00",
                    textAlign: "center",
                  })
                }
                className="w-full p-2.5 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 rounded-xl text-xs font-semibold text-white text-left flex items-center justify-between transition cursor-pointer"
              >
                <span>+ Sous-titre</span>
                <span className="text-[10px] text-white/40">9 pt</span>
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: `text-${Date.now()}`,
                    type: "text",
                    x: 10,
                    y: 35,
                    width: 65,
                    height: 5,
                    text: "+33 6 00 00 00 00 • contact@email.fr",
                    fontFamily: "Montserrat",
                    fontSize: 7.5,
                    color: "#e2e8f0",
                    textAlign: "center",
                  })
                }
                className="w-full p-2.5 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 rounded-xl text-xs text-white/80 text-left flex items-center justify-between transition cursor-pointer"
              >
                <span>+ Coordonnées / Texte normal</span>
                <span className="text-[10px] text-white/40">7.5 pt</span>
              </button>
            </div>

            {/* Selected Text Properties */}
            {selectedElement && selectedElement.type === "text" && (
              <div className="pt-4 border-t border-brand-purple/20 space-y-3">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                  Propriétés du texte
                </span>

                {/* Edit Text Content */}
                <div className="space-y-1">
                  <label className="text-[11px] text-white/60">Contenu</label>
                  <textarea
                    rows={2}
                    value={selectedElement.text || ""}
                    onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
                    className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>

                {/* Font Family */}
                <div className="space-y-1">
                  <label className="text-[11px] text-white/60">Typographie</label>
                  <select
                    value={selectedElement.fontFamily || "Montserrat"}
                    onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                    className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  >
                    {FONTS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size & Alignment */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-white/60">Taille (pt)</label>
                    <input
                      type="number"
                      min={4}
                      max={40}
                      step={0.5}
                      value={selectedElement.fontSize || 12}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { fontSize: parseFloat(e.target.value) || 12 })
                      }
                      className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/60">Alignement</label>
                    <div className="flex bg-[#160f2e] border border-brand-purple/30 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateElement(selectedElement.id, { textAlign: "left" })}
                        className={`flex-1 p-1 rounded flex justify-center ${
                          selectedElement.textAlign === "left" ? "bg-brand-magenta text-white" : "text-white/60"
                        }`}
                      >
                        <AlignLeft size={13} />
                      </button>
                      <button
                        onClick={() => onUpdateElement(selectedElement.id, { textAlign: "center" })}
                        className={`flex-1 p-1 rounded flex justify-center ${
                          selectedElement.textAlign === "center" ? "bg-brand-magenta text-white" : "text-white/60"
                        }`}
                      >
                        <AlignCenter size={13} />
                      </button>
                      <button
                        onClick={() => onUpdateElement(selectedElement.id, { textAlign: "right" })}
                        className={`flex-1 p-1 rounded flex justify-center ${
                          selectedElement.textAlign === "right" ? "bg-brand-magenta text-white" : "text-white/60"
                        }`}
                      >
                        <AlignRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Style buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                      })
                    }
                    className={`flex-1 p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                      selectedElement.fontWeight === "bold"
                        ? "bg-brand-magenta border-brand-magenta text-white"
                        : "bg-[#160f2e] border-brand-purple/30 text-white/70"
                    }`}
                  >
                    <Bold size={13} /> Gras
                  </button>

                  <button
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                      })
                    }
                    className={`flex-1 p-2 rounded-lg border text-xs italic flex items-center justify-center gap-1 transition cursor-pointer ${
                      selectedElement.fontStyle === "italic"
                        ? "bg-brand-magenta border-brand-magenta text-white"
                        : "bg-[#160f2e] border-brand-purple/30 text-white/70"
                    }`}
                  >
                    <Italic size={13} /> Italique
                  </button>
                </div>

                {/* Text Color Picker */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-white/60">Couleur du texte</label>
                    <input
                      type="color"
                      value={selectedElement.color || "#ffffff"}
                      onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {PALETTE_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateElement(selectedElement.id, { color: c })}
                        style={{ backgroundColor: c }}
                        className="w-5 h-5 rounded-full border border-white/20 transition hover:scale-110 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHAPES */}
        {activeTab === "shapes" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-montserrat">Formes géométriques</h3>
              <p className="text-[11px] text-white/50">Ajoutez des blocs, séparateurs ou cadres.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  onAddElement({
                    id: `rect-${Date.now()}`,
                    type: "rect",
                    x: 10,
                    y: 10,
                    width: 30,
                    height: 20,
                    fill: "#6C2BD9",
                  })
                }
                className="p-3 bg-[#160f2e] hover:bg-brand-purple/30 border border-brand-purple/20 rounded-xl flex flex-col items-center gap-1 text-xs text-white transition cursor-pointer"
              >
                <Square size={22} className="text-brand-magenta" />
                <span>Rectangle</span>
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: `circle-${Date.now()}`,
                    type: "circle",
                    x: 25,
                    y: 15,
                    width: 20,
                    height: 20,
                    fill: "#FF6A00",
                  })
                }
                className="p-3 bg-[#160f2e] hover:bg-brand-purple/30 border border-brand-purple/20 rounded-xl flex flex-col items-center gap-1 text-xs text-white transition cursor-pointer"
              >
                <Circle size={22} className="text-brand-orange" />
                <span>Cercle</span>
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: `line-${Date.now()}`,
                    type: "line",
                    x: 10,
                    y: 27,
                    width: 40,
                    height: 1,
                    stroke: "#ffffff",
                    strokeWidth: 0.5,
                  })
                }
                className="p-3 bg-[#160f2e] hover:bg-brand-purple/30 border border-brand-purple/20 rounded-xl flex flex-col items-center gap-1 text-xs text-white transition cursor-pointer"
              >
                <Minus size={22} className="text-white" />
                <span>Ligne séparatrice</span>
              </button>

              <button
                onClick={() =>
                  onAddElement({
                    id: `frame-${Date.now()}`,
                    type: "rect",
                    x: 4,
                    y: 4,
                    width: design.widthMm - 8,
                    height: design.heightMm - 8,
                    fill: "transparent",
                    stroke: "#D72888",
                    strokeWidth: 0.5,
                  })
                }
                className="p-3 bg-[#160f2e] hover:bg-brand-purple/30 border border-brand-purple/20 rounded-xl flex flex-col items-center gap-1 text-xs text-white transition cursor-pointer"
              >
                <Square size={22} className="text-brand-magenta" />
                <span>Cadre bordure</span>
              </button>
            </div>

            {/* Shape editing controls if a shape is selected */}
            {selectedElement && (selectedElement.type === "rect" || selectedElement.type === "circle" || selectedElement.type === "line") && (
              <div className="pt-4 border-t border-brand-purple/20 space-y-3">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                  Propriétés de la forme
                </span>

                {selectedElement.type !== "line" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] text-white/60">Couleur de fond</label>
                      <input
                        type="color"
                        value={selectedElement.fill || "#6C2BD9"}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {PALETTE_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateElement(selectedElement.id, { fill: c })}
                          style={{ backgroundColor: c }}
                          className="w-5 h-5 rounded-full border border-white/20 transition hover:scale-110 cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Border / Stroke */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-white/60">Contour (Stroke)</label>
                    <input
                      type="color"
                      value={selectedElement.stroke || "#ffffff"}
                      onChange={(e) => onUpdateElement(selectedElement.id, { stroke: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-white/50">Épaisseur :</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={selectedElement.strokeWidth || 0}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, { strokeWidth: parseFloat(e.target.value) || 0 })
                      }
                      className="w-16 bg-[#160f2e] border border-brand-purple/30 rounded p-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: IMAGES & LOGO */}
        {activeTab === "images" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-montserrat">Importer votre logo & images</h3>
              <p className="text-[11px] text-white/50">Formats acceptés : PNG transparent, JPG, SVG, WebP.</p>
            </div>

            <label className="block w-full border-2 border-dashed border-brand-purple/40 hover:border-brand-magenta/60 rounded-2xl p-6 text-center cursor-pointer transition bg-[#160f2e]/50">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload size={28} className="text-brand-orange mx-auto mb-2 animate-bounce" />
              <span className="text-xs font-bold text-white block">Cliquez pour importer</span>
              <span className="text-[10px] text-white/50 block mt-1">Recommandé : PNG transparent à 300 DPI</span>
            </label>

            {lowResWarning && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>{lowResWarning}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BACKGROUND */}
        {activeTab === "background" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-montserrat">Arrière-plan ({activeSide})</h3>
              <p className="text-[11px] text-white/50">Modifiez la couleur de fond de cette face.</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#160f2e] rounded-xl border border-brand-purple/20">
              <span className="text-xs font-semibold text-white">Couleur personnalisée</span>
              <input
                type="color"
                value={currentSide.backgroundColor}
                onChange={(e) => onUpdateBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-white/70">Palettes tendance Art Vision</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Nuit Pure", color: "#08051F" },
                  { name: "Violet Sombre", "#1A1238": "#1A1238", color: "#1A1238" },
                  { name: "Noir Mat", color: "#121214" },
                  { name: "Blanc Pur", color: "#ffffff" },
                  { name: "Crème Doux", color: "#fdf8f5" },
                  { name: "Or Noir", color: "#1a140f" },
                  { name: "Gris Anthracite", color: "#1e1e24" },
                  { name: "Bleu Nuit", color: "#0f172a" },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => onUpdateBackgroundColor(b.color)}
                    className="p-2 rounded-lg border border-white/10 flex flex-col items-center gap-1 hover:border-brand-magenta transition cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-md border border-white/20" style={{ backgroundColor: b.color }} />
                    <span className="text-[9px] text-white/60 truncate w-full text-center">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: LAYERS */}
        {activeTab === "layers" && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-montserrat">Calques ({activeSide})</h3>
              <p className="text-[11px] text-white/50">{currentSide.elements.length} élément(s) sur cette face.</p>
            </div>

            <div className="space-y-1.5">
              {currentSide.elements.map((el, idx) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onClick={() => onSelectElement(el.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-brand-orange text-white font-bold"
                        : "bg-[#160f2e] text-white/70 hover:bg-brand-purple/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-white/40">#{idx + 1}</span>
                      <span className="truncate">
                        {el.type === "text"
                          ? `Texte: "${el.text?.slice(0, 16)}..."`
                          : el.type === "image"
                          ? "Image / Logo"
                          : `Forme: ${el.type}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBringForward(el.id);
                        }}
                        title="Monter d'un niveau"
                        className="p-1 text-white/60 hover:text-white"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendBackward(el.id);
                        }}
                        title="Descendre d'un niveau"
                        className="p-1 text-white/60 hover:text-white"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement(el.id);
                        }}
                        title="Dupliquer"
                        className="p-1 text-white/60 hover:text-white"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(el.id);
                        }}
                        title="Supprimer"
                        className="p-1 text-white/60 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
