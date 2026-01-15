# TODO: Ajout du zoom pour agrégation et configuration du texte dans FichesDynamiquesElement

## Objectif
Ajouter la notion de zoom pour agréger les données et la configuration du texte dans les fiches dynamiques, comme c'est déjà implémenté dans FicheDeDonneeElement.

## Tâches à réaliser

### 1. Modifier `useFicheDynamiquesStore.ts`
- [x] Ajouter l'interface pour `markerTextFont` (police, taille, poids, couleur, couleur de fond)
- [x] Ajouter `markerTextFont` au store Zustand
- [x] Ajouter les setters correspondants

### 2. Modifier `FichesDynamiquesElement/index.tsx`
- [x] Importer `useMapStore` pour récupérer `zoomLevel`
- [x] Importer `aggregerParRegion` et `aggregerParDepartement`
- [x] Importer `green` de `@mui/material/colors`
- [x] Ajouter la logique d'agrégation par niveau de zoom:
  - `zoomLevel < 9`: Agrégation par région
  - `9 <= zoomLevel < 12`: Agrégation par département  
  - `zoomLevel >= 12`: Données individuelles
- [x] Ajouter la configuration du texte (`markerText`) pour les niveaux agrégés
- [x] Passer les props `markerText` à `ElementContainer`
- [x] Utiliser les données agrégées avec les coordonnées centroïdes

### 3. Tester l'implémentation
- [x] Vérifier que l'agrégation fonctionne correctement aux différents niveaux de zoom
- [x] Vérifier que la configuration du texte est appliquée correctement
- [x] Vérifier que les données individuelles s'affichent au zoom le plus élevé

## Notes
- Les seuils de zoom sont identiques à ceux utilisés dans `FicheDeDonneeElement`
- La configuration du texte doit être récupérée depuis le store `useFicheDynamiquesStore`
- Les fonctions d'agrégation existantes (`aggregerParRegion`, `aggregerParDepartement`) peuvent être réutilisées

