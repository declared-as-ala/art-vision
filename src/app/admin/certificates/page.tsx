"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  RefreshCw,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { CERTIFICATE_TEMPLATES, CERTIFICATE_TYPES, CertificateType } from "@/lib/certificates/templates";

interface Certificate {
  id: string;
  reference: string;
  certificateType: CertificateType;
  recipientName: string;
  trainingTitle: string;
  duration: string;
  sessionDate: string;
  trainingCenter?: string | null;
  trainerName?: string | null;
  location?: string | null;
  description?: string | null;
  objectives?: string | null;
  signatureName?: string | null;
  issueDate: string;
  createdBy?: string | null;
  createdAt: string;
}

const emptyForm = (type: CertificateType) => {
  const d = CERTIFICATE_TEMPLATES[type].defaults;
  return {
    certificateType: type,
    recipientName: "",
    trainingTitle: d.trainingTitle,
    duration: d.duration,
    sessionDate: "",
    trainingCenter: d.trainingCenter,
    trainerName: d.trainerName,
    location: d.location,
    description: d.description,
    objectives: d.objectives,
    signatureName: d.signatureName,
    issueDate: new Date().toISOString().slice(0, 10),
  };
};

const TYPE_LABEL: Record<string, string> = {
  covering: "Covering",
  ppf: "PPF",
  vt: "Vitres Teintées",
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [form, setForm] = useState(emptyForm("covering"));
  const [editingId, setEditingId] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const blobRef = useRef<string>("");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.success) setCertificates(data.certificates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  // Pick a type → load its defaults + show the blank template preview.
  const chooseType = (type: CertificateType) => {
    setSelectedType(type);
    setEditingId(null);
    setForm(emptyForm(type));
    setError("");
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = "";
    setPreviewUrl(CERTIFICATE_TEMPLATES[type].previewUrl); // static blank template
  };

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  // Render an overlaid live preview from the current (unsaved) form.
  const refreshPreview = async () => {
    setPreviewing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/certificates/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Erreur d'aperçu.");
      }
      const blob = await res.blob();
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      blobRef.current = URL.createObjectURL(blob);
      setPreviewUrl(blobRef.current);
    } catch (e: any) {
      setError(e.message || "Erreur d'aperçu.");
    } finally {
      setPreviewing(false);
    }
  };

  const validate = (): string | null => {
    if (!form.recipientName.trim()) return "Le nom du bénéficiaire est requis.";
    if (!form.trainingTitle.trim()) return "Le titre de la formation est requis.";
    if (!form.sessionDate.trim()) return "La date / session est requise.";
    if (!form.duration.trim()) return "La durée est requise.";
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const isEdit = !!editingId;
      const res = await fetch("/api/admin/certificates", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(isEdit ? { id: editingId } : {}) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erreur d'enregistrement.");
      showToast(isEdit ? "Certificat mis à jour." : `Certificat généré — ${data.certificate.reference}`);
      await fetchCertificates();
      // Show the saved PDF.
      const pdfRes = await fetch(`/api/admin/certificates/${data.certificate.id}/pdf`);
      const blob = await pdfRes.blob();
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      blobRef.current = URL.createObjectURL(blob);
      setPreviewUrl(blobRef.current);
      setEditingId(data.certificate.id);
    } catch (e: any) {
      setError(e.message || "Erreur.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: Certificate) => {
    setSelectedType(c.certificateType);
    setEditingId(c.id);
    setForm({
      certificateType: c.certificateType,
      recipientName: c.recipientName,
      trainingTitle: c.trainingTitle,
      duration: c.duration,
      sessionDate: c.sessionDate,
      trainingCenter: c.trainingCenter || "",
      trainerName: c.trainerName || "",
      location: c.location || "",
      description: c.description || "",
      objectives: c.objectives || "",
      signatureName: c.signatureName || "",
      issueDate: (c.issueDate || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    });
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = "";
    setPreviewUrl(`/api/admin/certificates/${c.id}/pdf`);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (c: Certificate) => {
    if (!confirm(`Supprimer le certificat ${c.reference} (${c.recipientName}) ?`)) return;
    try {
      const res = await fetch(`/api/admin/certificates?id=${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Certificat supprimé.");
        if (editingId === c.id) resetForm();
        fetchCertificates();
      } else {
        setError(data.error || "Erreur de suppression.");
      }
    } catch (e) {
      setError("Erreur réseau.");
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setEditingId(null);
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = "";
    setPreviewUrl("");
    setError("");
  };

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white flex items-center gap-2">
            <Award size={26} className="text-brand-orange" />
            Certificats de Formation
          </h1>
          <p className="text-xs text-white/50">Générez et gérez les certificats professionnels (Covering, PPF, Vitres Teintées).</p>
        </div>
        {selectedType && (
          <button
            onClick={resetForm}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer"
          >
            <X size={14} /> Fermer l'éditeur
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[70] bg-green-500/15 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* STEP 1 — choose a certificate type */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-wider font-bold text-white/50">1. Type de certificat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CERTIFICATE_TYPES.map((t) => {
            const active = selectedType === t.type;
            return (
              <button
                key={t.type}
                onClick={() => chooseType(t.type as CertificateType)}
                className={`text-left rounded-2xl p-5 border transition cursor-pointer group ${
                  active
                    ? "bg-gradient-to-br from-brand-magenta/25 to-brand-purple/15 border-brand-magenta shadow-lg shadow-brand-magenta/10"
                    : "glassmorphism border-brand-purple/15 hover:border-brand-magenta/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-lg ${active ? "bg-brand-magenta/30 text-white" : "bg-brand-purple/15 text-brand-magenta"}`}>
                    <FileText size={18} />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                    {t.refPrefix}-{new Date().getFullYear()}
                  </span>
                </div>
                <h3 className="font-sora font-bold text-white text-sm mt-3">{t.label}</h3>
                <p className="text-[11px] text-white/50 mt-1">
                  {t.type === "covering" && "Formation pose de film covering."}
                  {t.type === "ppf" && "Film de protection de peinture (PPF)."}
                  {t.type === "vt" && "Films solaires & vitres teintées automobile."}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2 — form + live preview */}
      {selectedType && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Form */}
          <div className="glassmorphism rounded-2xl border border-brand-purple/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-purple/15 pb-3">
              <h2 className="font-sora font-bold text-white text-sm">
                {editingId ? "2. Modifier le certificat" : "2. Informations du certificat"}
              </h2>
              <span className="text-[10px] font-mono text-white/50 bg-brand-navy px-2 py-1 rounded border border-brand-purple/20">
                Réf : {editingId ? certificates.find((c) => c.id === editingId)?.reference : "auto"}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <Field label="Nom complet du bénéficiaire *">
              <input
                value={form.recipientName}
                onChange={(e) => update({ recipientName: e.target.value })}
                placeholder="AMELIE SIZAIRE"
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Titre de la formation *">
                <input value={form.trainingTitle} onChange={(e) => update({ trainingTitle: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Durée *">
                <input value={form.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="2 jours" className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date / Session *">
                <input value={form.sessionDate} onChange={(e) => update({ sessionDate: e.target.value })} placeholder="Session de juin 2026" className={inputCls} />
              </Field>
              <Field label="Date d'émission">
                <input type="date" value={form.issueDate} onChange={(e) => update({ issueDate: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Centre / Société de formation">
                <input value={form.trainingCenter} onChange={(e) => update({ trainingCenter: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Formateur / Responsable">
                <input value={form.trainerName} onChange={(e) => update({ trainerName: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Lieu de formation">
                <input value={form.location} onChange={(e) => update({ location: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Nom pour la signature">
                <input value={form.signatureName} onChange={(e) => update({ signatureName: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <Field label="Description (optionnel)">
              <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
            </Field>

            <Field label="Objectifs / Compétences (une par ligne, optionnel)">
              <textarea value={form.objectives} onChange={(e) => update({ objectives: e.target.value })} rows={4} className={`${inputCls} resize-none`} />
            </Field>

            <p className="text-[10px] text-white/40 leading-relaxed border-t border-brand-purple/10 pt-3">
              Le modèle imprime déjà le titre, les objectifs et la signature. Par défaut seuls le <strong className="text-white/70">nom</strong> et la <strong className="text-white/70">session</strong> sont ajoutés sur le PDF. Les autres champs sont enregistrés dans l'historique.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-brand-purple/15">
              <button
                onClick={refreshPreview}
                disabled={previewing}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={previewing ? "animate-spin" : ""} /> Actualiser l'aperçu
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 min-w-[160px] bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Save size={14} /> {saving ? "Enregistrement…" : editingId ? "Enregistrer les modifications" : "Générer le certificat"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="glassmorphism rounded-2xl border border-brand-purple/15 p-4 space-y-3 xl:sticky xl:top-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sora font-bold text-white text-sm">Aperçu du certificat</h2>
              {editingId && (
                <a
                  href={`/api/admin/certificates/${editingId}/pdf?download=1`}
                  className="text-[10px] font-bold text-brand-orange hover:text-brand-magenta flex items-center gap-1"
                >
                  <Download size={12} /> Télécharger
                </a>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-brand-purple/20 bg-[#050314] aspect-[595/842]">
              {previewUrl ? (
                <iframe key={previewUrl} src={previewUrl} title="Aperçu certificat" className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                  Sélectionnez un type puis « Actualiser l'aperçu »
                </div>
              )}
            </div>
            <p className="text-[10px] text-white/40">
              {previewing ? "Génération de l'aperçu…" : "L'aperçu se met à jour via le bouton « Actualiser l'aperçu »."}
            </p>
          </div>
        </div>
      )}

      {/* HISTORY */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-wider font-bold text-white/50">Historique des certificats</h2>
        <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
          {loading ? (
            <div className="text-center py-14 text-white/45 text-sm">Chargement…</div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-14 text-white/45 text-sm">Aucun certificat généré pour le moment.</div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                    <th className="p-4">Référence</th>
                    <th className="p-4">Bénéficiaire</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Session</th>
                    <th className="p-4">Créé le</th>
                    <th className="p-4">Par</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-purple/10">
                  {certificates.map((c) => (
                    <tr key={c.id} className="hover:bg-brand-purple/5 transition">
                      <td className="p-4 font-mono text-brand-orange font-bold">{c.reference}</td>
                      <td className="p-4 text-white font-semibold">{c.recipientName}</td>
                      <td className="p-4">
                        <span className="text-[10px] bg-brand-purple/20 border border-brand-purple/30 text-white px-2 py-0.5 rounded-full font-bold">
                          {TYPE_LABEL[c.certificateType] || c.certificateType}
                        </span>
                      </td>
                      <td className="p-4 text-white/70">{c.sessionDate}</td>
                      <td className="p-4 text-white/50">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="p-4 text-white/50">{c.createdBy || "—"}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <a href={`/api/admin/certificates/${c.id}/pdf`} target="_blank" rel="noreferrer" title="Prévisualiser" className="text-white/45 hover:text-brand-magenta p-1.5 rounded hover:bg-white/5 transition inline-block">
                            <Eye size={14} />
                          </a>
                          <a href={`/api/admin/certificates/${c.id}/pdf?download=1`} title="Télécharger" className="text-white/45 hover:text-brand-orange p-1.5 rounded hover:bg-white/5 transition inline-block">
                            <Download size={14} />
                          </a>
                          <button onClick={() => handleEdit(c)} title="Modifier / Régénérer" className="text-white/45 hover:text-brand-orange p-1.5 rounded hover:bg-white/5 transition cursor-pointer">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(c)} title="Supprimer" className="text-white/45 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/70">{label}</label>
      {children}
    </div>
  );
}
