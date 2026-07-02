/**
 * Certificate template configuration.
 * ─────────────────────────────────────────────────────────────────────────────
 * The 3 PDFs in `public/certification/` are PRE-DESIGNED, flattened templates:
 * the title, trainer line, objectives, badge and signature are already part of
 * the background artwork. The ONLY genuinely blank area is the recipient name
 * band (below the big heading) — plus room for a session line.
 *
 * So by default we overlay ONLY `recipientName` and `sessionDate`. Every other
 * field is still captured in the form + DB (for history / filename / records),
 * and can be overlaid too by flipping `enabled: true` on its field below.
 *
 * ── HOW TO ADJUST TEXT POSITIONS ─────────────────────────────────────────────
 * Coordinates are in PDF points, origin BOTTOM-LEFT. Page size = 595.2 × 841.9
 * (A4 portrait). So:
 *   • x grows to the right (0 = left edge, 595 = right edge)
 *   • y grows upward   (0 = bottom edge, 842 = top edge)
 * For `align: "center"`, `x` is the CENTER of the text.
 * For `align: "left"`,   `x` is the left start; for `"right"`, the right edge.
 * `y` is the text BASELINE. Increase y to move text UP, decrease to move DOWN.
 * Change `size` for font size; long values auto-shrink down to `minSize` so they
 * never exceed `maxWidth`. Tweak numbers, save, regenerate — no other code needed.
 */

export type CertificateType = "covering" | "ppf" | "vt";

export type FontKey =
  | "helvetica"
  | "helvetica-bold"
  | "times"
  | "times-bold"
  | "arial-bold"; // embedded — condensed to match the certificate's Arial Narrow Bold headings
export type Align = "left" | "center" | "right";

export interface TextField {
  /** which Certificate field this renders */
  key:
    | "recipientName"
    | "sessionDate"
    | "trainingTitle"
    | "trainerName"
    | "duration"
    | "location"
    | "reference"
    | "signatureName";
  /** overlay this field onto the PDF? (blank-area fields are true by default) */
  enabled: boolean;
  x: number;
  y: number;
  size: number;
  /** smallest size auto-shrink may reach so long text still fits `maxWidth` */
  minSize: number;
  /** max text width in points before auto-shrink kicks in */
  maxWidth: number;
  font: FontKey;
  align: Align;
  /** RGB 0..1 */
  color: [number, number, number];
  /** UPPERCASE the value before drawing (matches the baked-in style) */
  uppercase?: boolean;
  /** horizontal scale (<1 condenses the glyphs, e.g. 0.82 ≈ Arial Narrow) */
  condense?: number;
}

export interface CertificateTemplate {
  type: CertificateType;
  label: string;
  /** file inside public/certification (do NOT use absolute paths) */
  pdfFile: string;
  /** public URL for previewing the blank template */
  previewUrl: string;
  /** reference prefix, e.g. COV-2026-0001 */
  refPrefix: string;
  /** sensible defaults pre-filled in the form (match the printed artwork) */
  defaults: {
    trainingTitle: string;
    duration: string;
    trainingCenter: string;
    trainerName: string;
    location: string;
    signatureName: string;
    objectives: string; // one per line
    description: string;
  };
  /** text overlays applied to the PDF, in draw order */
  fields: TextField[];
}

// Near-black used for text drawn on the light inner card.
const INK: [number, number, number] = [0.11, 0.11, 0.13];

/**
 * Shared overlay layout. All three templates share the same structural artwork
 * (same heading position, same "a suivi la formation professionelle" line), so
 * the coordinates start identical — but each template keeps its OWN copy so you
 * can fine-tune one without affecting the others.
 *
 * The recipient name sits centered in the blank band under the heading; the
 * session line sits just beneath it.
 */
function baseFields(): TextField[] {
  return [
    {
      // Recipient full name — prominent, centered in the blank band, using the
      // same condensed heavy Arial style as the certificate's printed headings.
      key: "recipientName",
      enabled: true,
      x: 362, // horizontal center of the inner card
      y: 600, // baseline in the empty band under the big heading
      size: 30,
      minSize: 16,
      maxWidth: 375,
      font: "arial-bold",
      align: "center",
      color: [0, 0, 0], // pure black to match the printed title
      uppercase: true,
      condense: 0.82, // narrow the glyphs to mirror Arial Narrow Bold
    },
    {
      // Session date / period, centered just below the name.
      key: "sessionDate",
      enabled: true,
      x: 362,
      y: 585,
      size: 12,
      minSize: 9,
      maxWidth: 380,
      font: "helvetica",
      align: "center",
      color: INK,
    },
    // ── OPTIONAL overlays (disabled: the artwork already prints these). ──
    // Flip `enabled: true` and adjust x/y to overlay your own editable values.
    {
      key: "trainingTitle",
      enabled: false,
      x: 362,
      y: 545,
      size: 20,
      minSize: 12,
      maxWidth: 380,
      font: "helvetica-bold",
      align: "center",
      color: INK,
      uppercase: true,
    },
    {
      key: "trainerName",
      enabled: false,
      x: 362,
      y: 505,
      size: 12,
      minSize: 9,
      maxWidth: 360,
      font: "helvetica",
      align: "center",
      color: INK,
    },
    {
      // Reference number — discreet, bottom-left margin so it won't touch art.
      key: "reference",
      enabled: false,
      x: 40,
      y: 28,
      size: 8,
      minSize: 6,
      maxWidth: 200,
      font: "helvetica",
      align: "left",
      color: [1, 1, 1], // white, for the dark border area
    },
  ];
}

export const CERTIFICATE_TEMPLATES: Record<CertificateType, CertificateTemplate> = {
  covering: {
    type: "covering",
    label: "Formation Covering",
    pdfFile: "Formation covering.pdf",
    previewUrl: "/certification/Formation%20covering.pdf",
    refPrefix: "COV",
    defaults: {
      trainingTitle: "COVERING EXPERT",
      duration: "3 jours",
      trainingCenter: "Melaudy Wrapping Training Center",
      trainerName: "",
      location: "Rue Saint-Roch 13/c, 7712 Mouscron",
      signatureName: "",
      objectives:
        "COMPRENDRE LA POSE DU FILM.\nCOMPRENDRE LE MECANISME DU FILM.\nSAVOIR DECOUPE ET POSITIONNER LE FILM.\nIDENTIFIER LES BONS OUTILS.\nMAITRISER LA TECHNIQUE DE POSE DE FILM ADHESIF.",
      description: "Certifiée par covering.fr",
    },
    fields: baseFields(),
  },
  ppf: {
    type: "ppf",
    label: "Formation PPF",
    pdfFile: "Formation PPF.pdf",
    previewUrl: "/certification/Formation%20PPF.pdf",
    refPrefix: "PPF",
    defaults: {
      trainingTitle: "PPF TRANSPARENT",
      duration: "3 jours",
      trainingCenter: "Autoskin",
      trainerName: "",
      location: "Rue Saint-Roch 13/c, 7712 Mouscron",
      signatureName: "",
      objectives:
        "COMPRENDRE LES SPÉCIFICITES DU FILM PPF\nPRÉPARER ET DÉCONTAMINER LES SURFACES\nMAITRISER LES MÉLANGES DE POSE\nACQUÉRIR LES NOTIONS DE PRÉCUT\nRÉALISER LES DÉCOUPES DE FILM\nSAVOIR EFFECTUER UNE POSE EN BULK\nSOIGNER LES AJUSTEMENTS ET FINITIONS",
      description: "Certifiée par covering.fr — en partenariat avec TeckWrap",
    },
    fields: baseFields(),
  },
  vt: {
    type: "vt",
    label: "Formation Vitres Teintées Automobile",
    pdfFile: "Formation vt.pdf",
    previewUrl: "/certification/Formation%20vt.pdf",
    refPrefix: "VT",
    defaults: {
      trainingTitle: "FILM SOLAIRE AUTOMOBILE",
      duration: "2 jours",
      trainingCenter: "",
      trainerName: "Cover Max",
      location: "Rue Saint-Roch 13/c, 7712 Mouscron",
      signatureName: "Cover Max",
      objectives:
        "COMPRENDRE LES SPÉCIFICITÉS DES FILMS SOLAIRES\nPRÉPARER ET NETTOYER LES VITRAGES\nMAITRISER LES MÉTHODES DE DÉCOUPE\nRÉALISER LE THERMOFORMAGE DU FILM\nAPPLIQUER LE FILM SUR LES VITRES LATÉRALES\nPOSER LE FILM SUR LA LUNETTE ARRIÈRE\nGÉRER LES BULLES, PLIS ET DEFAUTS DE POSE\nSOIGNER LES FINITIONS ET LE CONTROLE QUALITÉ",
      description: "Certificat délivré par covering.fr",
    },
    fields: baseFields(),
  },
};

export const CERTIFICATE_TYPES = Object.values(CERTIFICATE_TEMPLATES).map((t) => ({
  type: t.type,
  label: t.label,
  previewUrl: t.previewUrl,
  refPrefix: t.refPrefix,
}));

export function getTemplate(type: string): CertificateTemplate | null {
  return (CERTIFICATE_TEMPLATES as Record<string, CertificateTemplate>)[type] || null;
}

export function isCertificateType(v: string): v is CertificateType {
  return v === "covering" || v === "ppf" || v === "vt";
}
