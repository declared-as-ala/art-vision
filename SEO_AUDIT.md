# Audit SEO & Technique Initial — Art Visions (art-visions.fr)
**Date :** 15 octobre 2026  
**Auditeur :** Lead SEO Strategist & Full-Stack Engineer  
**Projet :** Art Visions (Studio créatif français — Design, Branding, Impression, Digital, Web)  
**URL de production :** https://art-visions.fr  

---

## 1. Synthèse Exécutive
Art Visions dispose d'un socle technique moderne (Next.js 16 avec Turbopack, base de données SQLite/Turso via Prisma ORM avec adaptateur LibSQL, Tailwind CSS et Vanilla CSS, rendu SSR dynamique et SSG hybride). L'infrastructure actuelle compte :
- **69 articles de blog** déjà publiés dans la base de données (couvrant une part de l'impression professionnelle, du web et du branding).
- **25 outils gratuits** hautement interactifs sous `/outils-gratuits/` (générateurs de brief, simulateurs, gabarits, calculateurs, cartes de visite, etc.).
- **Pages de services clés** : `/creation-logo-professionnel`, `/identite-visuelle`, `/design-graphique`, `/impression`, `/creation-site-internet`, `/community-management`, `/devis-sur-mesure`.
- **Pages SEO locales** (dont Le Mans, Paris, Lyon, Lille, Marseille, etc.) et une section dédiée pour la **Belgique** (`/belgique/*`).

L'objectif de cette mission est de concevoir et déployer **50 articles de blog premium, uniques, concrets et documentés** pour combler les manques identifiés sur le marché français et francophone belge, tout en connectant stratégiquement chaque article aux outils gratuits et services payants correspondants.

---

## 2. État du Répertoire & Git
- **Branche active :** `main`
- **Dernier commit :** `0d570a4` (*fix: portfolio video previews, canonical URLs, Le Mans wording, logo pricing, print SVG marks, web brief defaults*)
- **Statut Git :** Propre (`working tree clean`), synchronisé avec `origin/main`.
- **Build de référence :** Next.js 16.2.9 compile avec succès (147 routes statiques et dynamiques validées, 0 erreur TypeScript, 0 erreur lint bloquante).

---

## 3. Architecture Technique & CMS

### 3.1 Système de Blog Actuel
- **Modèle de données :** `BlogPost` et `BlogCategory` dans Prisma (`prisma/schema.prisma`).
- **Attributs clés :**
  - `slug` (unique), `title`, `content` (HTML riche assaini avec balises sémantiques), `excerpt`, `featuredImage`, `featuredImageAlt`.
  - Métadonnées SEO : `seoTitle`, `seoDescription`, `focusKeyword`, `secondaryKeywords`, `ogTitle`, `ogDescription`, `ogImage`.
  - Modules de maillage et de conversion : `faqJson` (tableau JSON de questions/réponses), `relatedServices` (slugs de services), `relatedTools` (slugs d'outils), `relatedPortfolio` (slugs de réalisations), `ctaTitle`, `ctaText`, `ctaLabel`, `ctaHref`.
  - Structure & temps de lecture : `isPillar` (booléen), `readingTime` (minutes), `publishedAt`, `status` ("PUBLISHED").
- **Rendu côté client/serveur :**
  - `/blog` : Catalogue dynamique avec tri par catégorie, article à la une, temps de lecture, badges et recherche.
  - `/blog/[slug]` : Rendu SSR dynamique (`force-dynamic` avec cache ISR 60s), génération automatique du sommaire cliquable (`Table of Contents`) via `withHeadingIds`, assainissement HTML via `sanitizeHtml`, boutons de partage, blocs outils recommandés, blocs services et formulaire de newsletter.

### 3.2 Données Structurées (Schema.org / JSON-LD)
- **BlogPosting :** Implémenté dynamiquement avec titre, image, dates ISO, auteur `Organization` (Art Vision), éditeur et section thématique.
- **BreadcrumbList :** Présent sur chaque article (`Accueil > Blog > [Titre de l'article]`).
- **FAQPage :** Généré automatiquement dès lors que le champ `faqJson` contient des questions/réponses valides.
- **Balises canoniques :** Strictement auto-référencées sur `https://art-visions.fr/blog/[slug]` (aucun résidu de domaine temporaire Vercel).

### 3.3 Indexation, Sitemap et Robots.txt
- **Sitemap dynamique :** `/sitemap.xml` (généré via `src/app/sitemap.ts`) extrait en direct tous les articles avec `status = "PUBLISHED"`, priorité 0.75 et fréquence de changement hebdomadaire.
- **Robots.txt :** Accessible sur `/robots.txt` (`src/app/robots.txt/route.ts`), autorise le crawl global, bloque `/admin/` et `/api/`, et référence explicitement `https://art-visions.fr/sitemap.xml`.

---

## 4. Inventaire des Contenus Existants (69 Articles en Base)

Une analyse détaillée des 69 articles existants montre la répartition suivante :
1. **Impression professionnelle (26 articles) :** Très bonne couverture technique générale (grammages, 300 DPI, CMJN vs RVB, finitions pelliculage/vernis/dorure, bâches, roll-ups, panneaux Dibond/Akilux).  
   *Manques identifiés :* Utilisation pas-à-pas des gabarits PDF avec traits de coupe, calcul et optimisation de budget print, formats standards et originaux de cartes de visite (PVC, carrées), conception et pliage de dépliants 3 volets, marquage textile professionnel, réglementation du Bon à Tirer (BAT).
2. **Communication digitale & Web (15 articles) :** Couverture des bases du site vitrine, CMS (WordPress vs Shopify), vitesse, responsive, RGPD, mentions légales.  
   *Manques identifiés :* Modèle de brief et cahier des charges détaillé pour PME (connecté à l'outil), arborescence et pages indispensables d'un site vitrine, comparatif agence vs freelance pour le devis web, SEO local et fiche Google Business Profile, conception de CTA à fort taux de conversion, accessibilité web (RGAA).
3. **Création de logo & Identité visuelle (20 articles) :** Couverture des prix indicatifs, de l'importance du logo, des types de logos et de la charte graphique.  
   *Manques identifiés :* Cadrage et rédaction d'un brief de création de logo (connecté à l'outil), méthodologie complète de création de logo d'entreprise, choix et psychologie de la palette de couleurs (connecté à l'outil), dépôt et protection d'un logo à l'INPI, refonte de logo réussie, création d'une mini-charte graphique pour TPE/artisan.
4. **Commerces, CHR & TPE (0 article spécialisé) :** **Zone de très forte opportunité.**  
   Bien qu'Art Visions possède des outils gratuits dédiés (menu restaurant, carte de fidélité, grille tarifaire, bon cadeau, affiche horaires, affiche QR code), **aucun article de blog ne ciblait directement ces requêtes commerciales locales.**
5. **Visuels digitaux & Réseaux sociaux (3 articles) :** Couverture très partielle (bio Instagram, motion design, vidéo publicitaire).  
   *Manques identifiés :* Guide des dimensions et redimensionnement d'images pour réseaux sociaux (Instagram, LinkedIn, Facebook 2026), création de visuels produits attractifs pour Instagram, configuration et bonnes pratiques d'une signature mail HTML professionnelle, création et utilisation de mockups de logo réalistes, élaboration d'un calendrier éditorial pour PME.

---

## 5. Points Forts & Risques SEO Identifiés

### Points Forts
- Temps de chargement excellent (Turbopack, Next.js moderne, CSS optimisé).
- Architecture de données flexible : un seul modèle `BlogPost` pilote la page, les schémas Schema.org et les liens croisés.
- Réseau d'outils gratuits sous `/outils-gratuits/` générant une forte intention transactionnelle et utilitaire.

### Risques à Maîtriser
- **Cannibalisation sémantique :** Ne pas recréer d'articles avec des intentions identiques aux 69 articles existants (par exemple : le sujet général du grammage papier ou de la différence CMJN/RVB est déjà traité ; il faut cibler des angles complémentaires spécifiques ou intégrer des liens croisés).
- **Sur-optimisation d'ancres :** Veiller à diversifier les textes de liens internes vers les outils et services afin d'adopter des formulations naturelles et contextuelles.
- **Fraîcheur & Qualité :** Privilégier une information chiffrée, réglementaire (normes françaises, arrêtés de prix, obligations RGPD/INPI) et technique concrète plutôt que des généralités génériques.
