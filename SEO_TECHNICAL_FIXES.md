# ART VISIONS — JOURNAL DES MODIFICATIONS TECHNIQUES & ARCHITECTURE
**Date :** 28 Octobre 2026  
**Environnement :** Next.js 16.2.9 App Router / Node.js / Prisma ORM / Turso LibSQL  

---

## 1. Fichiers du Code Source Modifiés

### A. `src/app/layout.tsx`
- **Correction** : Remplacement de `template: "%s | Art Vision"` par `template: "%s"`.
- **Raison d'ingénierie** : Élimine la concaténation involontaire qui produisait *« ... | Art Visions - Art Vision »* sur les moteurs de recherche. Chaque page définit son titre avec une longueur maîtrisée sans troncature dans les SERP mobiles.

### B. `src/app/impression/flyers/page.tsx`
- **Correction** : Remplacement du vocabulaire de scraping (*« scrapées depuis la page source »*, *« lignes de tarifs scrapées »*) par des textes professionnels d'atelier garantissant le contrôle PAO offert et la livraison express en France.
- **Raison d'ingénierie** : Amélioration de la confiance utilisateur, suppression de signaux de faible qualité pour les Quality Raters de Google.

### C. `src/app/impression/[slug]/page.tsx`
- **Correction** : Extension d'`ALIAS_MAP` pour inclure `marque-pages` et `autocollant`.
- **Raison d'ingénierie** : Fournit des en-têtes H1 personnalisés, des descriptions d'artisanat d'art et des FAQ enrichies pour les produits d'imprimerie spécifiques qui n'avaient pas de configuration dédiée.

### D. `src/lib/expanded-tool-content.ts`
- **Correction** : Réécriture intégrale de l'objet `defaultContent` et création de définitions uniques pour l'ensemble des 25 outils gratuits (dont `generateur-brief-site-web`, `gabarit-impression`, `createur-carte-fidelite`, etc.).
- **Raison d'ingénierie** : Éradication définitive du boilerplate textuel *« Créer un générateur de ... pour une nouvelle offre »*.

### E. `src/lib/tools.ts`
- **Correction** : Vérification et activation de l'ensemble des 25 outils gratuits, garantissant la liaison directe avec leurs studios interactifs dédiés.

### F. `prisma/data/articles-cluster1-logo.ts`
- **Correction** : Suppression du pourcentage non sourcé (*« repose à plus de 70 % sur le brief »*), remplacé par une analyse qualitative d'expertise professionnelle.

---

## 2. Nouveaux Fichiers Développés

1. `prisma/data/articles-50-cluster1-print.ts` : 10 articles de fond sur l'impression, les finitions et les normes PAO.
2. `prisma/data/articles-50-cluster2-logo.ts` : 10 articles de fond sur les logos, le responsive et l'architecture de marque.
3. `prisma/data/articles-50-cluster3-retail.ts` : 10 articles de fond sur la restauration, le commerce et la signalétique.
4. `prisma/data/articles-50-cluster4-web.ts` : 10 articles de fond sur la création de site web, la conversion et le CRO.
5. `prisma/data/articles-50-cluster5-motion3d.ts` : 10 articles de fond sur le motion design, la modélisation 3D et le CGI.
6. `scripts/seed-artvisions-seo-50.ts` : Script d'import idempotent avec upsert, liaison aux catégories et validation de schéma.
7. `scripts/generate-all-reports.ts` : Script de génération des inventaires et matrices CSV d'audit.

---

## 3. Données & Base de Production Turso LibSQL

- **Moteur DB** : `@prisma/adapter-libsql` pointant sur `libsql://art-vision-eu-art-vision.aws-eu-west-1.turso.io`.
- **Statut d'exécution** :
  - `seed-artvisions-seo-50.ts` exécuté avec succès.
  - **50 nouveaux articles créés** avec le statut `PUBLISHED`.
  - **Nombre total d'articles publiés en production** : **126**.
  - Zéro régression sur les tables existantes (`User`, `Project`, `Service`, `SEOSettings`).
