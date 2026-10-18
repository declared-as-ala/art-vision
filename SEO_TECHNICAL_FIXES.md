# Audit & Correctifs Techniques SEO 2026 — Art Visions (art-visions.fr)

**Date d'audit & d'implémentation :** Mars 2026  
**Auditeur :** Senior Technical SEO Engineer & Full-Stack Architect  
**Plateforme :** Next.js 16 (App Router & Turbopack), Prisma ORM, Turso SQLite/LibSQL Edge Database  
**Domaine de production :** `https://art-visions.fr/`  

---

## 1. Synthèse des Correctifs & Validations Techniques

| Domaine d'Audit | Statut Précédent | Action & Correctif Appliqué | Statut Après Validation |
|---|---|---|---|
| **Consolidation Canonique** | Risque de cannibalisation entre `/impression-flyers` et `/impression/flyer` | Mappage 301 strict dans `src/proxy.ts` vers les URLs canoniques (`/impression/flyer`, `/impression/carte-de-visite`, etc.) | **100 % Conforme (301 Permanent)** |
| **Sitemap XML Dynamique** | Risque d'inclusion d'URLs redirigées ou d'anciennes pages obsolètes | `src/app/sitemap.ts` filtre rigoureusement les motifs obsolètes et génère dynamiquement les 78 landing pages, 76 articles de blog publiés, 25 outils gratuits et 10 pages d'impression | **100 % Conforme (Auto-synchronisé avec la base Turso)** |
| **Robots.txt** | Risque d'indexation de routes privées (`/admin`, `/api`) | `src/app/robots.ts` interdit `/admin/`, `/api/`, `/_next/` et autorise Googlebot sur toutes les pages publiques avec déclaration du sitemap | **100 % Conforme** |
| **Balisage Schema.org** | Balisage incomplet ou générique | Implémentation de `Service`, `Offer` avec prix en EUR, `BlogPosting` avec dates ISO, auteur et image haute définition, et `Organization` avec NAP France/Belgique | **100 % Validé Rich Results Test** |
| **Protocole HTTPS & Redirection WWW** | Risque de duplication de domaine | Redirection systématique vers `https://art-visions.fr/` sans sous-domaine `www` | **100 % Conforme** |
| **Gestion du trailing slash** | Incohérence possible `path/` vs `path` | Normalisation stricte sans trailing slash via middleware Next.js | **100 % Conforme** |
| **Core Web Vitals (LCP / INP / CLS)** | Images non compressées et décalages de layout | Utilisation du composant natif Next/Image, formats WebP/AVIF automatiques, polices avec `display: swap` et ratios CSS fixes | **Scores Verts (>90 sur Mobile)** |
| **Accessibilité & Contraste WCAG** | Ratios de contraste parfois limites sur fonds sombres | Palette de tokens validée WCAG AA (ratio minimal 4.5:1 sur textes) | **100 % Conforme WCAG AA** |

---

## 2. Détail des Implémentations

### A. Consolidation des URLs et suppression de la cannibalisation
Pour éviter que Google ne disperse la popularité d'une requête entre deux URLs concurrentes du même site (ex. `/impression-flyers` vs `/impression/flyer`), un routeur proxy préventif (`src/proxy.ts`) applique les redirections 301 suivantes :
```typescript
const staticCanonicalMap: Record<string, string> = {
  "/carte-de-visite-gratuite": "/outils-gratuits/carte-de-visite-gratuite",
  "/cv-modeles-gratuits": "/outils-gratuits/cv-gratuit",
  "/impression-publicitaire": "/impression",
  "/agence-graphique-france": "/agence-graphique",
  "/studio-graphique-france": "/agence-graphique",
  "/graphiste-freelance-france": "/design-graphique",
  "/creation-site-vitrine": "/site-vitrine",
  "/impression-cartes-de-visite": "/impression/carte-de-visite",
  "/impression-flyers": "/impression/flyer",
  "/impression-affiches": "/impression/affiche",
  "/impression-baches": "/impression/bache",
  "/impression-catalogues": "/impression/brochure",
  "/impression-panneaux-publicitaires": "/impression/panneau",
};
```

### B. Génération Dynamique du Sitemap XML (`/sitemap.xml`)
Le sitemap est recalculé à la volée en interrogeant directement la base de données Turso via Prisma :
1. **Pages Statiques Majeures :** Accueil (`priority: 1.0`), `/portfolio`, `/blog`, `/outils-gratuits`, `/contact`, `/belgique` (`priority: 0.85`).
2. **Landing Pages Commerciales (`SeoLandingPage`) :** 78 pages actives avec `priority: 0.85` et `changeFrequency: "weekly"`.
3. **Articles de Blog (`BlogPost`) :** 76 articles publiés avec `priority: 0.75` et `lastModified` fidèle.
4. **Outils Gratuits Studio :** 25 outils avec `priority: 0.85`.
5. **Grilles Tarifaires d'Impression :** 10 pages de fiches produits avec `priority: 0.9`.
6. **Exclusions automatiques :** Filtre strict pour bannir `/admin`, `/api`, les drafts et les URLs redirigées.

### C. Balisage Sémantique Schema.org Déployé
Sur chaque typologie de page, un balisage JSON-LD valide est injecté :
- **Pages d'Impression :**
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Impression Flyers Publicitaires",
    "provider": {
      "@type": "Organization",
      "name": "Art Vision",
      "url": "https://art-visions.fr"
    },
    "areaServed": ["France", "Belgique"],
    "offers": [...]
  }
  ```
- **Articles de Blog :**
  `BlogPosting` avec `headline`, `image`, `datePublished`, `author` (Équipe Art Visions), `publisher` avec logo officiel et `faqJson` pour les réponses d'experts admissibles.
- **Pages Entreprise / Contact :**
  `LocalBusiness` / `ProfessionalService` mentionnant les coordonnées téléphoniques (`+32 490 22 49 05`), l'adresse e-mail (`contact@art-visions.fr`) et la double présence France & Belgique.

---

## 3. Checklist de Validation Pré-Production
- [x] TypeScript : vérification stricte `tsc --noEmit` sans aucune erreur de type.
- [x] Prisma Client : synchronisation complète des modèles avec la base Turso de production.
- [x] Aucune balise `noindex` involontaire sur les pages canoniques de services, landing pages ou articles.
- [x] Balises `canonical` absolues pointant vers `https://art-visions.fr/[route]`.
- [x] OpenGraph Title, Description et Twitter Cards configurés sur 100 % des nouveaux contenus.
- [x] Images servies avec attributs `alt` descriptifs et dimensions explicites contre le Layout Shift (CLS).
