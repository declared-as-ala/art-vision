import type { StudioDesign, StudioElement, StudioSide, StudioTemplate } from "./studioTypes";

type TextOpts = Partial<StudioElement> & { fontSize: number; color: string };

const text = (id: string, x: number, y: number, w: number, h: number, value: string, o: TextOpts): StudioElement => ({
  id,
  type: "text",
  x,
  y,
  width: w,
  height: h,
  text: value,
  fontFamily: "Montserrat",
  textAlign: "left",
  ...o,
});

const rect = (id: string, x: number, y: number, w: number, h: number, fill: string, extra: Partial<StudioElement> = {}): StudioElement => ({
  id,
  type: "rect",
  x,
  y,
  width: w,
  height: h,
  fill,
  ...extra,
});

const circle = (id: string, x: number, y: number, d: number, fill: string, extra: Partial<StudioElement> = {}): StudioElement => ({
  id,
  type: "circle",
  x,
  y,
  width: d,
  height: d,
  fill,
  ...extra,
});

const line = (id: string, x: number, y: number, w: number, color: string, thickness = 0.3): StudioElement => ({
  id,
  type: "line",
  x,
  y,
  width: w,
  height: 1,
  stroke: color,
  strokeWidth: thickness,
});

const frame = (id: string, inset: number, color: string, width = 0.3): StudioElement =>
  rect(id, inset, inset, 85 - inset * 2, 55 - inset * 2, "transparent", { stroke: color, strokeWidth: width });

const side = (backgroundColor: string, elements: StudioElement[]): StudioSide => ({ backgroundColor, elements });

const design = (id: string, recto: StudioSide, verso: StudioSide): StudioDesign => ({
  id,
  productSlug: "cartes-de-visite",
  productName: "Cartes de visite professionnelles",
  formatName: "85 × 55 mm (Format Standard)",
  widthMm: 85,
  heightMm: 55,
  bleedMm: 2,
  safeMarginMm: 3,
  activeSide: "recto",
  recto,
  verso,
});

const GOLD = "#d4af37";

export const PREMIUM_TEMPLATES: StudioTemplate[] = [
  // 1. Luxe noir & or
  {
    id: "template-luxe-noir-or",
    name: "Maison Noir & Or",
    category: "commerce",
    categoryLabel: "Commerces & Boutiques",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-luxe-noir-or",
      side("#0a0a0c", [
        frame("f1", 4, GOLD, 0.25),
        frame("f2", 5.5, "rgba(212,175,55,0.35)", 0.15),
        text("brand", 8, 19, 69, 9, "MAISON LAURENT", { fontFamily: "Playfair Display", fontSize: 17, fontWeight: "bold", color: GOLD, textAlign: "center", letterSpacing: 3 }),
        line("l", 32, 30, 21, GOLD, 0.25),
        text("tag", 8, 33, 69, 5, "JOAILLIER · CRÉATEUR DEPUIS 1987", { fontSize: 5.5, color: "#e9e2cc", textAlign: "center", letterSpacing: 2.5 }),
      ]),
      side("#111114", [
        frame("f1", 4, GOLD, 0.25),
        text("name", 10, 12, 65, 7, "Laurent Moreau", { fontFamily: "Playfair Display", fontSize: 12, fontWeight: "bold", color: "#ffffff" }),
        text("role", 10, 20, 65, 5, "Directeur & Maître joaillier", { fontSize: 6.5, color: GOLD, letterSpacing: 1 }),
        line("l", 10, 28.5, 18, GOLD, 0.25),
        text("c1", 10, 33, 65, 5, "+33 6 12 34 56 78", { fontSize: 7, color: "#e7e5df" }),
        text("c2", 10, 38.5, 65, 5, "contact@maison-laurent.fr", { fontSize: 7, color: "#e7e5df" }),
        text("c3", 10, 44, 65, 5, "12 rue de la Paix, 75002 Paris", { fontSize: 7, color: "#9a968a" }),
      ])
    ),
  },

  // 2. Architecte minimal
  {
    id: "template-architecte-minimal",
    name: "Atelier Architecte Minimal",
    category: "freelance",
    categoryLabel: "Indépendants & Studios",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-architecte-minimal",
      side("#f6f4ef", [
        rect("sq", 8, 8, 6, 6, "#111111"),
        text("name", 8, 38, 69, 6, "CLAIRE BENOIT", { fontFamily: "Cinzel", fontSize: 12, fontWeight: "bold", color: "#111111", letterSpacing: 2 }),
        text("role", 8, 45, 69, 4, "Architecte DPLG — Urbanisme", { fontSize: 6, color: "#6b6b66", letterSpacing: 1 }),
      ]),
      side("#111111", [
        line("l1", 8, 15, 69, "#f6f4ef", 0.15),
        text("c1", 8, 19, 69, 5, "+33 6 98 76 54 32", { fontSize: 7.5, color: "#f6f4ef" }),
        text("c2", 8, 25.5, 69, 5, "claire@atelier-benoit.fr", { fontSize: 7.5, color: "#f6f4ef" }),
        text("c3", 8, 32, 69, 5, "atelier-benoit.fr", { fontSize: 7.5, color: "#f6f4ef" }),
        line("l2", 8, 41, 69, "#f6f4ef", 0.15),
        text("addr", 8, 44, 69, 5, "8 quai des Chartrons, 33000 Bordeaux", { fontSize: 5.5, color: "#9a9a94", letterSpacing: 0.5 }),
      ])
    ),
  },

  // 3. Barber / artisan impact
  {
    id: "template-barber-club",
    name: "Barber Club Impact",
    category: "artisan",
    categoryLabel: "Artisans & BTP",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-barber-club",
      side("#18181b", [
        rect("band", 0, 0, 24, 55, "#FF6A00"),
        text("num", 2, 6, 20, 14, "01", { fontFamily: "Oswald", fontSize: 24, fontWeight: "bold", color: "#18181b", textAlign: "center" }),
        text("brand", 29, 17, 52, 12, "THE BARBER CLUB", { fontFamily: "Oswald", fontSize: 18, fontWeight: "bold", color: "#ffffff", letterSpacing: 1.5 }),
        text("tag", 29, 31, 52, 6, "COUPE · BARBE · RASAGE", { fontFamily: "Oswald", fontSize: 7, color: "#FF6A00", letterSpacing: 3 }),
      ]),
      side("#FF6A00", [
        text("name", 8, 10, 69, 8, "KARIM HADDAD", { fontFamily: "Oswald", fontSize: 15, fontWeight: "bold", color: "#18181b", letterSpacing: 1.5 }),
        line("l", 8, 21, 25, "#18181b", 0.6),
        text("c1", 8, 26, 69, 5, "Sur rendez-vous : 06 11 22 33 44", { fontFamily: "Oswald", fontSize: 8, color: "#18181b" }),
        text("c2", 8, 32.5, 69, 5, "@thebarberclub", { fontFamily: "Oswald", fontSize: 8, color: "#18181b" }),
        text("c3", 8, 41, 69, 5, "21 avenue Jean Jaurès, 69007 Lyon", { fontFamily: "Oswald", fontSize: 7, color: "#3a1d00" }),
      ])
    ),
  },

  // 4. Kraft éco
  {
    id: "template-kraft-eco",
    name: "Atelier Kraft Éco-responsable",
    category: "artisan",
    categoryLabel: "Artisans & BTP",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-kraft-eco",
      side("#c8a26b", [
        circle("c", 29, 8, 27, "transparent", { stroke: "#3b2a14", strokeWidth: 0.5 }),
        text("mono", 29, 16, 27, 12, "AB", { fontFamily: "Playfair Display", fontSize: 22, fontWeight: "bold", color: "#3b2a14", textAlign: "center" }),
        text("brand", 8, 40, 69, 6, "ATELIER DU BOIS", { fontFamily: "Montserrat", fontSize: 11, fontWeight: "bold", color: "#3b2a14", textAlign: "center", letterSpacing: 3 }),
      ]),
      side("#f4ead8", [
        text("name", 10, 11, 65, 7, "Antoine Berger", { fontFamily: "Playfair Display", fontSize: 12, fontWeight: "bold", color: "#3b2a14" }),
        text("role", 10, 19, 65, 5, "Menuisier-ébéniste · Bois local & recyclé", { fontSize: 6, color: "#7a5a2c" }),
        line("l", 10, 27, 15, "#7a5a2c", 0.4),
        text("c1", 10, 31.5, 65, 5, "06 45 67 89 01", { fontSize: 7.5, color: "#3b2a14" }),
        text("c2", 10, 37.5, 65, 5, "atelierdubois.fr", { fontSize: 7.5, color: "#3b2a14" }),
        text("c3", 10, 43.5, 65, 5, "Zone artisanale Les Chênes, 44000 Nantes", { fontSize: 5.5, color: "#7a5a2c" }),
      ])
    ),
  },

  // 5. Torréfacteur / café
  {
    id: "template-cafe-torrefacteur",
    name: "Torréfacteur Café Signature",
    category: "restaurant",
    categoryLabel: "Restaurants & Métiers de bouche",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-cafe-torrefacteur",
      side("#2b1a12", [
        circle("o1", 56, -12, 50, "#3a2418"),
        circle("o2", 62, 4, 30, "#5a3a26"),
        text("brand", 8, 20, 50, 9, "Café Fauve", { fontFamily: "Playfair Display", fontSize: 18, fontWeight: "bold", color: "#f4e6d0" }),
        text("tag", 8, 31, 50, 5, "TORRÉFACTEUR ARTISANAL", { fontSize: 5.5, color: "#d9a066", letterSpacing: 2.5 }),
      ]),
      side("#f4e6d0", [
        text("name", 8, 11, 69, 7, "Sophie Lemaire", { fontFamily: "Playfair Display", fontSize: 12, fontWeight: "bold", color: "#2b1a12" }),
        text("role", 8, 19, 69, 5, "Maître torréfacteur", { fontSize: 6.5, color: "#a0693a", letterSpacing: 1 }),
        line("l", 8, 27, 14, "#a0693a", 0.4),
        text("c1", 8, 31.5, 69, 5, "Boutique & dégustation : 04 78 00 11 22", { fontSize: 6.5, color: "#2b1a12" }),
        text("c2", 8, 37.5, 69, 5, "cafe-fauve.fr", { fontSize: 6.5, color: "#2b1a12" }),
        text("c3", 8, 43.5, 69, 5, "5 place des Terreaux, 69001 Lyon", { fontSize: 5.5, color: "#7a5a3c" }),
      ])
    ),
  },

  // 6. Beauté rosé
  {
    id: "template-beaute-rose",
    name: "Studio Beauté Rosé",
    category: "beaute",
    categoryLabel: "Beauté, Spa & Bien-être",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-beaute-rose",
      side("#f7e4e1", [
        circle("c1", 52, 6, 34, "#efc9c4"),
        circle("c2", 64, 22, 20, "#e3a9a3"),
        text("brand", 8, 19, 50, 9, "Éclat", { fontFamily: "Playfair Display", fontSize: 24, fontWeight: "bold", fontStyle: "italic", color: "#6b2e35" }),
        text("tag", 8, 33, 50, 5, "INSTITUT DE BEAUTÉ & SPA", { fontSize: 5.5, color: "#8d4a52", letterSpacing: 2.5 }),
      ]),
      side("#6b2e35", [
        text("name", 8, 11, 69, 7, "Léa Fontaine", { fontFamily: "Playfair Display", fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "#f7e4e1" }),
        text("role", 8, 19, 69, 5, "Esthéticienne diplômée", { fontSize: 6.5, color: "#efc9c4", letterSpacing: 1 }),
        line("l", 8, 27, 14, "#efc9c4", 0.3),
        text("c1", 8, 31.5, 69, 5, "Réservation : 06 55 44 33 22", { fontSize: 7, color: "#f7e4e1" }),
        text("c2", 8, 37.5, 69, 5, "institut-eclat.fr", { fontSize: 7, color: "#f7e4e1" }),
        text("c3", 8, 43.5, 69, 5, "3 rue des Lilas, 31000 Toulouse", { fontSize: 5.5, color: "#d9a9a3" }),
      ])
    ),
  },

  // 7. Néon créatif
  {
    id: "template-neon-creatif",
    name: "Néon Créatif Art Vision",
    category: "freelance",
    categoryLabel: "Indépendants & Studios",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-neon-creatif",
      side("#08051F", [
        circle("g1", -8, 30, 45, "#6C2BD9", { opacity: 0.55 }),
        circle("g2", 52, -14, 40, "#D72888", { opacity: 0.5 }),
        rect("bar", 8, 20, 3, 15, "#FF6A00"),
        text("name", 15, 19, 65, 8, "NOUR BELHADJ", { fontSize: 15, fontWeight: "800", color: "#ffffff", letterSpacing: 1.5 }),
        text("role", 15, 28.5, 65, 5, "MOTION DESIGNER & DIRECTRICE ARTISTIQUE", { fontSize: 5, fontWeight: "600", color: "#FF6A00", letterSpacing: 2 }),
      ]),
      side("#ffffff", [
        rect("stripe", 0, 0, 85, 3, "#6C2BD9"),
        rect("stripe2", 0, 3, 85, 1.2, "#D72888"),
        rect("stripe3", 0, 4.2, 85, 0.8, "#FF6A00"),
        text("c1", 10, 17, 65, 5, "+33 6 70 80 90 10", { fontSize: 8, fontWeight: "600", color: "#08051F" }),
        text("c2", 10, 24, 65, 5, "hello@nourbelhadj.studio", { fontSize: 8, fontWeight: "600", color: "#08051F" }),
        text("c3", 10, 31, 65, 5, "nourbelhadj.studio", { fontSize: 8, fontWeight: "600", color: "#D72888" }),
        text("addr", 10, 43, 65, 5, "Paris · Remote · Worldwide", { fontSize: 5.5, color: "#6b6880", letterSpacing: 1.5 }),
      ])
    ),
  },

  // 8. Fleuriste botanique
  {
    id: "template-fleuriste-botanique",
    name: "Fleuriste Botanique",
    category: "commerce",
    categoryLabel: "Commerces & Boutiques",
    productSlug: "cartes-de-visite",
    thumbnailUrl: "",
    design: design(
      "tpl-fleuriste-botanique",
      side("#e7eddf", [
        circle("p1", 58, 4, 22, "#9db38a"),
        circle("p2", 66, 14, 14, "#6f8f5b"),
        circle("p3", 52, 18, 10, "#c98c8c"),
        text("brand", 8, 20, 48, 9, "Flora & Cie", { fontFamily: "Playfair Display", fontSize: 18, fontWeight: "bold", color: "#2f4a2a" }),
        text("tag", 8, 31, 48, 5, "FLEURISTE · ATELIER FLORAL", { fontSize: 5.5, color: "#5b7a4b", letterSpacing: 2.5 }),
      ]),
      side("#2f4a2a", [
        text("name", 8, 11, 69, 7, "Camille Roche", { fontFamily: "Playfair Display", fontSize: 12, fontWeight: "bold", color: "#e7eddf" }),
        text("role", 8, 19, 69, 5, "Artisan fleuriste", { fontSize: 6.5, color: "#b7cba5", letterSpacing: 1 }),
        line("l", 8, 27, 14, "#b7cba5", 0.3),
        text("c1", 8, 31.5, 69, 5, "Commandes : 06 21 43 65 87", { fontSize: 7, color: "#e7eddf" }),
        text("c2", 8, 37.5, 69, 5, "flora-et-cie.fr", { fontSize: 7, color: "#e7eddf" }),
        text("c3", 8, 43.5, 69, 5, "17 rue du Marché, 35000 Rennes", { fontSize: 5.5, color: "#9db38a" }),
      ])
    ),
  },
];
