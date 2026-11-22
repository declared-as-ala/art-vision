export type LayoutVariant =
  | "editorial-panoramic"
  | "gallery-grid"
  | "dynamic-split"
  | "corporate-asymmetric"
  | "refined-atelier"
  | "b2b-comparison";

export type AccentColor = "orange" | "magenta" | "purple";

export interface CityPhotoMeta {
  path: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface CitySectorUseCase {
  sector: string;
  title: string;
  description: string;
  recommendedSupports: string[];
  paperTip: string;
}

export interface CityProductRecommendation {
  slug: string;
  customTag: string;
  localPitch: string;
  recommendedSpec: string;
}

export interface CityFaqItem {
  question: string;
  answer: string;
}

export interface LocalCityData {
  slug: string;
  city: string;
  preposition: string; // e.g. "à Paris", "au Mans"
  region: string;
  department: string;
  isHeadquarters?: boolean;
  layoutVariant: LayoutVariant;
  accent: AccentColor;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  heroBadge: string;
  h1: string;
  heroSubtitle: string;
  intro: string;
  editorialAngle: string;
  printSectionTitle: string;
  printSectionIntro: string;
  featuredProducts: CityProductRecommendation[];
  sectorsTitle: string;
  sectorsIntro: string;
  localSectors: CitySectorUseCase[];
  designSectionTitle: string;
  designSectionBody: string;
  highlightedServices: {
    label: string;
    href: string;
    pitch: string;
  }[];
  workflowNote: string;
  faqs: CityFaqItem[];
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  photo: CityPhotoMeta;
}
