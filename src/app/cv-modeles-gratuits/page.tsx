"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  FolderKanban
} from "lucide-react";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  duration: string;
}

interface Project {
  name: string;
  description: string;
}

export default function CVGenerator() {
  // Tabs: "info" | "experience" | "education" | "skills" | "projects"
  const [activeTab, setActiveTab] = useState<"info" | "experience" | "education" | "skills" | "projects">("info");

  // CV Fields
  const [name, setName] = useState("Sophie Martin");
  const [profession, setProfession] = useState("UX/UI Designer & Intégratrice");
  const [phone, setPhone] = useState("+33 6 98 76 54 32");
  const [email, setEmail] = useState("s.martin@art-visions.fr");
  const [address, setAddress] = useState("Paris, France");
  const [about, setAbout] = useState(
    "Designer créative et passionnée avec 3 ans d'expérience. Spécialisée dans la conception d'interfaces élégantes et centrées sur l'utilisateur, de la recherche UX à l'intégration HTML/CSS."
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "Art Vision Agency",
      role: "Designer UX/UI Junior",
      duration: "2024 - Présent",
      description: "Conception de maquettes de sites vitrines et applications mobiles. Création de chartes graphiques et d'identités visuelles pour des PME françaises."
    },
    {
      company: "Studio Créatif Le Mans",
      role: "Stagiaire Designer Graphique",
      duration: "2023 (6 mois)",
      description: "Création de supports imprimés (flyers, catalogues) et de bannières pour les réseaux sociaux."
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      school: "École Supérieure de Design, Paris",
      degree: "Mastère Direction Artistique & UX Design",
      duration: "2022 - 2024"
    },
    {
      school: "Université de Nantes",
      degree: "Licence Arts Appliqués et Design",
      duration: "2019 - 2022"
    }
  ]);

  const [skills, setSkills] = useState<string[]>(["Figma", "Photoshop", "Illustrator", "React/Next.js", "Tailwind CSS", "SEO"]);
  const [languages, setLanguages] = useState<string[]>(["Français (Langue maternelle)", "Anglais (Professionnel)"]);
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "OléaPure Branding & Site",
      description: "Direction créative complète pour une marque cosmétique bio et développement de la landing page."
    }
  ]);

  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [template, setTemplate] = useState<"creative" | "tech" | "executive">("creative");
  const [themeColor, setThemeColor] = useState("#D72888"); // Magenta defaults for creative
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item Helpers
  const addExperience = () => {
    setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }]);
  };
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...experiences];
    newExp[index][field] = value;
    setExperiences(newExp);
  };

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", duration: "" }]);
  };
  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    setEducation(newEdu);
  };

  const addProject = () => {
    setProjects([...projects, { name: "", description: "" }]);
  };
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProj = [...projects];
    newProj[index][field] = value;
    setProjects(newProj);
  };

  const handleDownloadPDF = () => {
    // We will trigger browser print utility for pixel-perfect standard A4 layout.
    // It's the most flexible and crisp way to render HTML to PDF in A4 size.
    window.print();
  };

  const handleSaveCV = async () => {
    setSaving(true);
    setMsg("");
    try {
      const response = await fetch("/api/generators/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profession,
          phone,
          email,
          address,
          about,
          skills: JSON.stringify(skills),
          languages: JSON.stringify(languages),
          experiences: JSON.stringify(experiences),
          education: JSON.stringify(education),
          projects: JSON.stringify(projects),
          templateId: template,
          sourceUrl: window.location.href,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMsg("Votre CV a été enregistré avec succès !");
      } else {
        setMsg("Erreur d'enregistrement.");
      }
    } catch {
      setMsg("Erreur réseau. Enregistrement du CV impossible.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4 print:bg-white print:p-0 print:pt-0">
      {/* Background glow in non-print mode */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 print:hidden animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-magenta/10 rounded-full filter blur-[100px] -z-10 print:hidden"></div>

      <div className="max-w-7xl mx-auto print:max-w-full print:m-0">
        {/* Header (hidden on print) */}
        <div className="text-center mb-16 space-y-4 print:hidden">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Créateur de CV en Ligne</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Créez un CV professionnel et <span className="text-brand-magenta">design</span> en quelques clics
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Renseignez votre parcours, sélectionnez un style adapté à votre domaine d'activité et téléchargez le résultat instantanément au format PDF officiel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:grid-cols-1 print:gap-0">
          {/* Controls Panel (Left) - hidden on print */}
          <div className="lg:col-span-5 glassmorphism rounded-2xl p-6 space-y-6 print:hidden">
            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                Choix du style de CV
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "creative", name: "Créatif", color: "#D72888" },
                  { id: "tech", name: "Modern Tech", color: "#6C2BD9" },
                  { id: "executive", name: "Corporate", color: "#D95200" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemplate(t.id as any);
                      setThemeColor(t.color);
                    }}
                    className={`px-2 py-2.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      template === t.id
                        ? "bg-brand-magenta border-brand-magenta text-white"
                        : "border-brand-purple/30 bg-brand-navy hover:bg-brand-purple/20 text-white/80"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Tabs */}
            <div className="flex border-b border-brand-purple/20 overflow-x-auto no-scrollbar">
              {[
                { id: "info", label: "Profil", icon: User },
                { id: "experience", label: "Parcours", icon: Briefcase },
                { id: "education", label: "Études", icon: GraduationCap },
                { id: "skills", label: "Compétences", icon: Wrench },
                { id: "projects", label: "Projets", icon: FolderKanban }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? "border-brand-magenta text-brand-magenta"
                        : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/75">Nom Complet</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/75">Métier</label>
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/75">Téléphone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/75">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/75">Adresse</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/75">Photo (Profil)</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="cv-photo-file"
                      />
                      <label
                        htmlFor="cv-photo-file"
                        className="bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-white text-xs px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Importer une photo</span>
                      </label>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl("")}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/75">À propos (Résumé de profil)</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={4}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Ajouter vos expériences passées</span>
                    <button
                      onClick={addExperience}
                      className="bg-brand-magenta hover:bg-brand-magenta/90 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus size={10} />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="border border-brand-purple/20 rounded-xl p-4 space-y-3 bg-brand-navy/50 relative">
                        <button
                          onClick={() => removeExperience(idx)}
                          className="absolute top-2 right-2 text-white/40 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Entreprise"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, "company", e.target.value)}
                            className="bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Période (Ex: 2022 - 2024)"
                            value={exp.duration}
                            onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                            className="bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Poste / Rôle"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                          className="w-full bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                        />
                        <textarea
                          placeholder="Description des missions"
                          value={exp.description}
                          onChange={(e) => updateExperience(idx, "description", e.target.value)}
                          rows={2}
                          className="w-full bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Ajouter vos formations et diplômes</span>
                    <button
                      onClick={addEducation}
                      className="bg-brand-magenta hover:bg-brand-magenta/90 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus size={10} />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {education.map((edu, idx) => (
                      <div key={idx} className="border border-brand-purple/20 rounded-xl p-4 space-y-3 bg-brand-navy/50 relative">
                        <button
                          onClick={() => removeEducation(idx)}
                          className="absolute top-2 right-2 text-white/40 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="École / Université"
                            value={edu.school}
                            onChange={(e) => updateEducation(idx, "school", e.target.value)}
                            className="bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Période (Ex: 2018 - 2021)"
                            value={edu.duration}
                            onChange={(e) => updateEducation(idx, "duration", e.target.value)}
                            className="bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Nom du Diplôme / Formation"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                          className="w-full bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/80 block">Compétences (Séparées par des virgules)</label>
                    <input
                      type="text"
                      value={skills.join(", ")}
                      onChange={(e) => setSkills(e.target.value.split(",").map((s) => s.trim()))}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      placeholder="Figma, React, UI Design..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/80 block">Langues (Séparées par des virgules)</label>
                    <input
                      type="text"
                      value={languages.join(", ")}
                      onChange={(e) => setLanguages(e.target.value.split(",").map((s) => s.trim()))}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                      placeholder="Français, Anglais..."
                    />
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Ajouter vos projets majeurs</span>
                    <button
                      onClick={addProject}
                      className="bg-brand-magenta hover:bg-brand-magenta/90 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus size={10} />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="border border-brand-purple/20 rounded-xl p-4 space-y-3 bg-brand-navy/50 relative">
                        <button
                          onClick={() => removeProject(idx)}
                          className="absolute top-2 right-2 text-white/40 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        <input
                          type="text"
                          placeholder="Nom du projet"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, "name", e.target.value)}
                          className="w-full bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white pt-2"
                        />
                        <textarea
                          placeholder="Description du projet et technologies utilisées"
                          value={proj.description}
                          onChange={(e) => updateProject(idx, "description", e.target.value)}
                          rows={2}
                          className="w-full bg-brand-navy border border-brand-purple/20 rounded px-2 py-1 text-xs text-white resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-3 pt-6 border-t border-brand-purple/20">
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Télécharger le CV en PDF</span>
              </button>
              
              <button
                onClick={handleSaveCV}
                disabled={saving}
                className="w-full bg-brand-purple hover:bg-brand-purple/95 text-white py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Sauvegarder mon CV dans le Dashboard</span>
              </button>

              {msg && (
                <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-center font-medium">
                  {msg}
                </p>
              )}
            </div>
          </div>

          {/* CV Live Preview (Right) */}
          <div className="lg:col-span-7 flex flex-col items-center print:col-span-12 print:block">
            {/* Action panel above preview (hidden on print) */}
            <div className="w-full max-w-[620px] bg-brand-navy border border-brand-purple/20 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between text-xs text-white/75 print:hidden">
              <span className="font-medium flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                <span>Aperçu réel A4 (Simulé à l'échelle)</span>
              </span>
              <span>Style : <strong className="text-brand-magenta capitalize">{template}</strong></span>
            </div>

            {/* REAL A4 PRINT-READY WINDOW */}
            {/* We scale this down visually in CSS but when print is triggered it resets to full size */}
            <div
              id="cv-print-area"
              style={{
                width: "100%",
                maxWidth: "620px",
                minHeight: "877px", // Standard A4 Aspect Ratio 1:1.414
                backgroundColor: "#FFFFFF",
                color: "#1F2937",
              }}
              className="rounded-xl shadow-2xl overflow-hidden p-8 flex flex-col justify-between border border-white/10 print:border-none print:shadow-none print:rounded-none print:m-0 print:p-8"
            >
              {/* Template: Creative */}
              {template === "creative" && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header Banner */}
                    <div className="flex items-start justify-between border-b-2 pb-6" style={{ borderColor: themeColor }}>
                      <div className="space-y-1">
                        <h2 className="text-3xl font-sora font-extrabold text-brand-navy tracking-tight">{name}</h2>
                        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: themeColor }}>
                          {profession}
                        </h3>
                        {/* Contacts grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 pt-3 text-[10px] text-gray-500 font-medium">
                          <p>📱 {phone}</p>
                          <p>✉️ {email}</p>
                          <p>📍 {address}</p>
                        </div>
                      </div>
                      {photoUrl && (
                        <img
                          src={photoUrl}
                          alt={name}
                          className="w-20 h-20 rounded-full object-cover border-2"
                          style={{ borderColor: themeColor }}
                        />
                      )}
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-12 gap-6 pt-6">
                      {/* Left: Main info (experiences/projects) */}
                      <div className="col-span-8 space-y-6">
                        {/* About */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Profil</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed text-justify">{about}</p>
                        </div>

                        {/* Experience */}
                        <div className="space-y-4">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Expérience Professionnelle</h4>
                          <div className="space-y-3">
                            {experiences.map((exp, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-baseline text-[11px]">
                                  <strong className="text-gray-800 font-bold">{exp.role} — {exp.company}</strong>
                                  <span className="text-[10px] text-gray-400 font-medium shrink-0">{exp.duration}</span>
                                </div>
                                <p className="text-[10px] text-gray-600 leading-relaxed">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects */}
                        {projects.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Projets Clés</h4>
                            <div className="space-y-2">
                              {projects.map((proj, idx) => (
                                <div key={idx} className="text-[10px]">
                                  <strong className="text-gray-800 font-bold block">{proj.name}</strong>
                                  <span className="text-gray-600 leading-relaxed">{proj.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Sidebar (education/skills) */}
                      <div className="col-span-4 border-l pl-5 space-y-6 border-gray-100">
                        {/* Competences */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Compétences</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, idx) => (
                              <span
                                key={idx}
                                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                className="text-[9px] font-semibold px-2 py-0.5 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Formation</h4>
                          <div className="space-y-3">
                            {education.map((edu, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <span className="text-[9px] text-gray-400 font-medium block">{edu.duration}</span>
                                <strong className="text-[10px] text-gray-800 font-bold block">{edu.degree}</strong>
                                <span className="text-[9px] text-gray-500 block">{edu.school}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-navy">Langues</h4>
                          <ul className="text-[10px] text-gray-600 space-y-1">
                            {languages.map((lang, idx) => (
                              <li key={idx} className="flex items-center space-x-1">
                                <span>•</span>
                                <span>{lang}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Branding */}
                  <div className="border-t pt-4 text-center text-[9px] text-gray-400 mt-8">
                    <span>Ce CV a été généré gratuitement via le créateur de CV d'Art Vision (art-visions.fr)</span>
                  </div>
                </div>
              )}

              {/* Template: Tech */}
              {template === "tech" && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header Banner (Left aligned photo, right text) */}
                    <div className="flex items-center space-x-6 pb-6 border-b-2 border-brand-navy">
                      {photoUrl && (
                        <img
                          src={photoUrl}
                          alt={name}
                          className="w-24 h-24 rounded object-cover border-2 border-brand-navy"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <h2 className="text-2xl font-sora font-extrabold text-brand-navy tracking-tight">{name}</h2>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-purple">
                          {profession}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[10px] text-gray-500 font-medium">
                          <span>📱 {phone}</span>
                          <span>✉️ {email}</span>
                          <span>📍 {address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tech details Grid */}
                    <div className="grid grid-cols-12 gap-6 pt-6">
                      <div className="col-span-4 space-y-6 pr-4 border-r border-gray-100">
                        {/* Skills */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Tech stack</h4>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill, idx) => (
                              <span key={idx} className="text-[9px] bg-brand-navy text-white px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Cursus</h4>
                          <div className="space-y-3">
                            {education.map((edu, idx) => (
                              <div key={idx} className="text-[10px]">
                                <span className="text-[9px] text-brand-purple font-semibold">{edu.duration}</span>
                                <strong className="text-gray-800 font-bold block">{edu.degree}</strong>
                                <span className="text-gray-500 block">{edu.school}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Langues</h4>
                          <div className="space-y-1 text-[10px] text-gray-600 font-medium">
                            {languages.map((lang, idx) => (
                              <div key={idx}>{lang}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Main info */}
                      <div className="col-span-8 space-y-6 pl-2">
                        {/* About */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy">À propos</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed">{about}</p>
                        </div>

                        {/* Experience */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy">Expériences</h4>
                          <div className="space-y-3">
                            {experiences.map((exp, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-baseline text-[11px]">
                                  <strong className="text-gray-800 font-bold">{exp.role}</strong>
                                  <span className="text-[9px] text-gray-400 font-medium">{exp.duration}</span>
                                </div>
                                <span className="text-[9px] text-brand-purple font-semibold block">{exp.company}</span>
                                <p className="text-[10px] text-gray-600 leading-relaxed">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects */}
                        {projects.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-navy">Projets récents</h4>
                            <div className="space-y-2">
                              {projects.map((proj, idx) => (
                                <div key={idx} className="text-[10px]">
                                  <strong className="text-gray-800 font-bold block">{proj.name}</strong>
                                  <span className="text-gray-600 leading-relaxed">{proj.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-center text-[9px] text-gray-400 mt-8">
                    <span>Créé sur art-visions.fr</span>
                  </div>
                </div>
              )}

              {/* Template: Executive */}
              {template === "executive" && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Centered header */}
                    <div className="text-center pb-6 border-b border-gray-300 space-y-2">
                      <h2 className="text-3xl font-sora font-bold text-gray-900">{name}</h2>
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">{profession}</h3>
                      <div className="flex justify-center space-x-6 text-[10px] text-gray-500 font-medium">
                        <span>📱 {phone}</span>
                        <span>✉️ {email}</span>
                        <span>📍 {address}</span>
                      </div>
                    </div>

                    {/* Executive Layout */}
                    <div className="space-y-6 pt-6">
                      {/* Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 border-b pb-1">Résumé de carrière</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{about}</p>
                      </div>

                      {/* Experience */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 border-b pb-1">Historique Professionnel</h4>
                        <div className="space-y-3">
                          {experiences.map((exp, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-baseline text-[11px]">
                                <strong className="text-gray-900 font-bold">{exp.role}</strong>
                                <span className="text-[9px] text-gray-500 font-semibold">{exp.duration}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium">{exp.company}</div>
                              <p className="text-[10px] text-gray-600 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education & Skills Double Column */}
                      <div className="grid grid-cols-2 gap-8">
                        {/* Education */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 border-b pb-1">Parcours Scolaire</h4>
                          <div className="space-y-2">
                            {education.map((edu, idx) => (
                              <div key={idx} className="text-[10px]">
                                <span className="text-[9px] text-gray-400 block">{edu.duration}</span>
                                <strong className="text-gray-800 font-bold block">{edu.degree}</strong>
                                <span className="text-gray-500 block">{edu.school}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills & Lang */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 border-b pb-1">Expertises</h4>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                              {skills.join(" • ")}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 border-b pb-1">Langues étrangères</h4>
                            <p className="text-[10px] text-gray-600">
                              {languages.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-center text-[9px] text-gray-400 mt-8">
                    <span>SAS ART VISION - Document professionnel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS to target print layout explicitly */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-print-area, #cv-print-area * {
            visibility: visible;
          }
          #cv-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            height: 100%;
            min-height: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          header, footer, nav, button, .print\\:hidden, #nprogress {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
