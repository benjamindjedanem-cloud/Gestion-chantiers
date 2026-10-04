# Icônes Gestion Chantiers — v12

## Principe

La v12 utilise une seule source graphique cohérente : le logo que nous avions validé, posé sur un **support blanc propre aux coins fortement arrondis**, avec une ombre légère. Les différentes tailles sont des exports du même visuel pour éviter les variations entre appareils.

## Quelle déclinaison utiliser ?

| Fichier | Utilisation |
|---|---|
| `icons/gc-icon-v12-master-1024.png` | Source maître 1024×1024. À conserver comme référence; pas nécessaire de la modifier. |
| `icons/gc-icon-v12-512.png` | Icône principale PWA / Android standard. |
| `icons/gc-icon-v12-384.png` | Alternative haute résolution pour PWA. |
| `icons/gc-icon-v12-192.png` | Taille PWA Android/web standard. |
| `icons/gc-icon-v12-maskable-512.png` | Icône Android/PWA avec `purpose: maskable`; davantage d'espace autour du symbole pour éviter les découpes. |
| `icons/gc-icon-v12-256.png` | Affichages desktop / Windows lorsque cette taille est demandée. |
| `icons/gc-icon-v12-180.png` | Apple Touch Icon pour iPhone/iPad. |
| `public/gc-icon-v12.ico` | Fichier ICO multi-tailles pour Windows et certains navigateurs. |
| `public/favicon.ico` | Favicon multi-tailles du site. |
| `icons/gc-icon-v12-32.png` | Favicon PNG 32×32. |
| `icons/gc-icon-v12-16.png` | Favicon PNG 16×16. |
| `icons/gc-logo-v12-header.png` | Source haute résolution pour l'en-tête de l'application; affichée à **44×44 px** dans l'interface. |

Les tailles `24`, `48`, `64`, `96`, `128`, `144`, `256`, `384` et `1024` sont également générées pour les environnements qui les demandent et pour conserver une bonne netteté sur différents écrans.

## Important

Le nombre dans le nom du fichier correspond à la **résolution du fichier**, pas à la taille d'affichage. Par exemple, `gc-logo-v12-header.png` est une source 512×512 mais elle est affichée à 44×44 px dans l'en-tête.
