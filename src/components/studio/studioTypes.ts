export type ElementType = "text" | "rect" | "circle" | "line" | "image";

export interface StudioElement {
  id: string;
  type: ElementType;
  x: number; // in mm or percentage/canvas units
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees
  opacity?: number; // 0-1
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "300" | "600" | "800";
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  // Shape specific
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  // Image specific
  src?: string;
  alt?: string;
  aspectRatio?: number;
  naturalWidth?: number;
  naturalHeight?: number;
}

export interface StudioSide {
  backgroundColor: string;
  elements: StudioElement[];
}

export interface StudioDesign {
  id: string;
  productSlug: string; // "cartes-de-visite" | "flyers" | "bons-cadeaux"
  productName: string;
  formatName: string;
  widthMm: number; // e.g. 85
  heightMm: number; // e.g. 55
  bleedMm: number; // e.g. 2
  safeMarginMm: number; // e.g. 3
  recto: StudioSide;
  verso: StudioSide;
  activeSide: "recto" | "verso";
  lastSavedAt?: string;
}

export interface StudioTemplate {
  id: string;
  name: string;
  category: "artisan" | "restaurant" | "commerce" | "beaute" | "freelance";
  categoryLabel: string;
  productSlug: string;
  thumbnailUrl: string;
  design: StudioDesign;
}

export interface PrintOptionItem {
  id: string;
  title: string;
  description?: string;
  quantities: string[];
  prices: Record<string, string>; // e.g. { "250 ex": "70 €", "500 ex": "75 €" }
}

export interface StudioOrderSubmission {
  designId?: string;
  productSlug: string;
  productName: string;
  format: string;
  sides: "recto" | "recto-verso";
  paperId: string;
  paperTitle: string;
  quantity: string;
  priceHtCents: number;
  priceTtcCents: number;
  vatRate: number; // 0.20
  deliveryCents: number;
  previewRecto: string; // Data URL or storage URL
  previewVerso?: string; // Data URL or storage URL
  designData: StudioDesign;
  client: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    shippingAddress: {
      street: string;
      zipCode: string;
      city: string;
      country: string;
    };
    notes?: string;
  };
}

