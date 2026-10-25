export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Identité visuelle" | "Logo" | "Design graphique" | "3D" | "Vidéo";
  industry: string;
  objective: string;
  challenge: string;
  solution: string;
  /** CSS colour pair used for the generated cover art until real photos are added. */
  cover: { from: string; to: string; mark: string };
  /**
   * false → page is noindex and excluded from the sitemap.
   * Flip to true only once the project, client name and outcome are confirmed real.
   */
  verified: boolean;
};

// Carried over from the art-visions.fr project database. Metrics from the original
// ("+45 % de ventes", "150 000 vues") are deliberately NOT copied: they cannot be verified.
export const PROJECTS: Project[] = [
  {
    slug: "oleapure-branding",
    title: "Identité visuelle OléaPure",
    client: "OléaPure",
    category: "Identité visuelle",
    industry: "Cosmétique bio",
    objective: "Créer un branding écologique et premium pour une marque d'huiles de beauté bio.",
    challenge: "Se démarquer sur un marché saturé tout en gardant des codes minimalistes et haut de gamme.",
    solution: "Logo monogramme fusionnant une goutte d'huile et une feuille d'olivier, palette vert olive profond et dorure à chaud pour les packagings.",
    cover: { from: "#2f3d1f", to: "#8a9a4b", mark: "#f2e6b8" },
    verified: false,
  },
  {
    slug: "tadaa-3d-packshot",
    title: "Production 3D TADAA!",
    client: "TADAA Studio",
    category: "3D",
    industry: "Boisson énergisante",
    objective: "Réaliser des packshots 3D photoréalistes et un spot CGI pour le lancement d'une canette.",
    challenge: "Simuler la condensation et l'effet glacé sur le métal d'une canette de manière réaliste.",
    solution: "Modélisation 3D complète sous Blender, rendu de particules pour le givre et animation de 15 secondes avec habillage musical.",
    cover: { from: "#0b2a4a", to: "#ba3184", mark: "#ffffff" },
    verified: false,
  },
];

export const PROJECT_CATEGORIES = ["Identité visuelle", "Logo", "Design graphique", "3D", "Vidéo"] as const;

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
