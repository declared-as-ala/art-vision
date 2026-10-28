# ART VISIONS — RAPPORT DE DÉDUPLICATION & RISQUES DE CANNIBALISATION
**Périmètre :** Bibliothèque des 126 articles de blog & pages commerciales  
**Date :** 28 Octobre 2026  

---

## 1. Méthodologie d'Analyse Préalable

Avant de publier le moindre article nouveau, l'ensemble des 76 articles existants dans la base de données a été extrait et analysé selon 4 critères :
1. **Collisions de slugs** : Comparaison unitaire de chaque candidate URL.
2. **Superposition d'intentions de recherche (Search Intent)** : Vérification qu'aucune nouvelle page ne venait diluer le classement d'une page existante.
3. **Mots-clés principaux ciblés** : Détection des doublons sur les requêtes génériques.
4. **Hiérarchie d'autorité** : Distinction stricte entre les guides informationnels (blog) et les pages transactionnelles de vente (services).

---

## 2. Thématiques Volontairement Évitées (Non dupliquées)

Pour respecter les consignes strictes du projet, les thèmes génériques déjà couverts ont été écartés ou fortement différenciés :

| Thème Déjà Présent | Risque Évité | Angle Nouveau Adopté |
| :--- | :--- | :--- |
| **Guide général création de logo** | Cannibalisation de `/creation-logo-professionnel` | Traitement technique des **déclinaisons obligatoires** (horizontal, vertical, favicon) |
| **Charte graphique générale** | Cannibalisation de `/identite-visuelle` | Focus sur l'**architecture de sous-marques multi-filiales** |
| **DPI et résolution d'impression** | Répétition de notions de base | Focus pointu sur la **norme PDF/X-4 vs PDF/X-1a** et le **noir riche vs 100% K** |
| **Prix des flyers et cartes** | Redondance avec les calculateurs | Traitement du **choix des reliures (PUR vs agrafes)** et des **finitions pelliculées** |
| **Réseaux sociaux généralistes** | Contenu trop superficiel | Focus sur les **ratios vidéo 9:16 vs 16:9** et le **storyboard publicitaire** |

---

## 3. Matrice de Différenciation des 50 Nouveaux Articles

Chaque nouvel article occupe une case sémantique inédite sur le site :

- **Pelliculage mat vs brillant** : Première page du site détaillant les micromètres du film BOPP et la résistance aux traces.
- **Vernis sélectif 3D** : Première explication technique de la préparation du calque ton direct 100% noir vectoriel.
- **Dorure à chaud vs dorure numérique** : Première analyse du seuil de rentabilité du cliché laiton.
- **Types de reliures brochure** : Première clarification de la règle du multiple de 4 en piqûre métal.
- **Carte des vins & Menu de brunch** : Premiers contenus dédiés aux restaurateurs avec applications directes de Menu Engineering.
- **Vitrophanie & Enseignes de magasin** : Première incursion sur la signalétique physique extérieure avec normes d'urbanisme.
- **Formulaire de devis CRO** : Première page traitant de l'optimisation des taux de conversion pour PME.
- **Packshots 3D & CGI publicitaire** : Positionnement avant-gardiste sur le FOOH et les formats d'ingénierie CAO (.STEP).

---

## 4. Vérification d'Unicité en Base de Données

Le script d'inspection automatisé `scripts/check-collisions.ts` a confirmé avant l'import :
- **Nombre de slugs candidats** : 50
- **Nombre de collisions détectées** : **0**
- **Collision rate** : **0.00 %**

L'architecture sémantique d'Art Visions est désormais un modèle de siloing étanche et complémentaire.
