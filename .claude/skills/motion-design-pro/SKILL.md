---
name: motion-design-pro
description: Direction artistique et méthode de motion design de Benjamin pour produire des vidéos promo professionnelles (applis, produits, services) avec Remotion. À charger AVANT toute demande de vidéo, animation, motion design, pub vidéo, vidéo promo, teaser, reel, TikTok, LinkedIn ou Facebook vidéo, intro animée, transition. À charger aussi dès que Benjamin partage une vidéo de référence (« j'aime cette vidéo », « regarde ces transitions ») pour l'analyser et l'ajouter à la bibliothèque.
---

# Motion design pro — goûts et méthode de Benjamin

Ce skill contient ce que Benjamin aime (et n'aime pas) en motion design, tiré de vidéos de référence qu'il a choisies et analysées image par image. **Le but : livrer un résultat pro sans lui redemander des références à chaque vidéo.** Ses goûts sont déjà ici ; on les applique.

## Deux usages

### A. Benjamin demande une vidéo → produire

1. **Lire `references/gouts.md`** en entier : la liste ✅ À REPRODUIRE, la liste ❌ À ÉVITER (avec quoi faire à la place) et la structure par défaut. Toujours. Chaque scène du storyboard doit pouvoir citer le numéro de règle qu'elle applique, et ne violer aucune règle E1–E9.
2. **Lire `references/recettes-mouvement.md`** (paramètres concrets : durées, courbes, échelles, et code Remotion).
3. Parcourir `references/bibliotheque.md` et ouvrir les planches `assets/refs/*.jpg` des passages pertinents pour avoir l'image en tête.
4. Suivre la méthode ci-dessous. Ne demander à Benjamin **que** ce que lui seul peut fournir : objectif, cible, message, musique, données réelles, logo. Pas de références : elles sont ici (il peut en ajouter s'il veut, jamais obligatoire).

### B. Benjamin partage une vidéo de référence → enrichir

Suivre `references/ajouter-reference.md` : analyser image par image, ne retenir **que** les passages qu'il cite, en déduire des règles et paramètres, mettre à jour `bibliotheque.md`, `gouts.md` et `recettes-mouvement.md`, ajouter les planches dans `assets/refs/`, puis lui résumer ce qui a été appris. Si une nouvelle référence contredit une règle existante, le signaler et lui demander laquelle garder.

## Méthode de production (ne pas sauter d'étape)

Chaque étape a une validation par Benjamin avant la suivante.

1. **Brief** : objectif (ex. faire installer l'appli), plateformes, durée, cible, message, appel à l'action. Plateformes → format (voir `gouts.md` § Formats).
2. **Note d'intention** : le concept en 5 lignes, l'idée de transition signature, le ton. Dire quelles références de la bibliothèque on mobilise et pour quoi.
3. **Storyboard** : tableau scène par scène — temps, texte exact à l'écran (mot-clé mis en valeur), ce qui bouge, transition vers la scène suivante.
4. **Images clés (style frames)** : rendre une image fixe soignée par scène (`npx remotion still`) et les montrer **avant** d'animer. On fige le look ici.
5. **Système de mouvement** : fixer courbes, durées, décalages, à partir de `recettes-mouvement.md`, dans un fichier `motion.ts` partagé par toutes les scènes.
6. **Animation** + calage sur la musique (repérer les temps forts du morceau et poser les transitions dessus).
7. **Relecture image par image par Claude d'abord** (voir Contrôle qualité), puis rendu à Benjamin, puis corrections.
8. **Mise à jour du skill** : ce qui a été validé ou rejeté pendant le projet devient une règle dans `gouts.md`.

## Contrôle qualité avant de montrer quoi que ce soit

Rendre une planche des images clés (`ffmpeg -vf "fps=6,scale=300:-1,tile=6x4"`) et vérifier :

- [ ] Compréhensible **sans le son** (texte à l'écran porte tout le message).
- [ ] Première image forte même à l'arrêt (c'est la vignette dans le fil).
- [ ] Aucune coupe sèche : chaque scène naît de la précédente.
- [ ] Rien n'apparaît en fondu simple ou à vitesse constante (voir recettes).
- [ ] **Interface de l'appli grande et proche** : ≥ 60 % de la largeur, texte ≥ 32 px, lisible sur téléphone (R-ÉCRAN).
- [ ] **Jamais statique** : à chaque instant quelque chose entre, sort ou change ; aucun plan > 3 s sans événement (R-MOUVEMENT).
- [ ] Les éléments d'un même groupe arrivent décalés, jamais ensemble.
- [ ] Flou de mouvement sur tout ce qui se déplace vite.
- [ ] Texte lisible : chaque phrase reste à l'écran au moins le temps de la lire deux fois.
- [ ] Zones sûres de la plateforme respectées.
- [ ] Couleurs et polices = celles de la marque, pas de dégradé violet par défaut.
- [ ] Comparer côte à côte avec la planche de référence correspondante : est-ce au même niveau ? Sinon, corriger avant de montrer.

## Outils

- **Remotion** (vidéo en React). Fixer une version publiée depuis au moins deux semaines.
- Polices embarquées via `@fontsource/*` (le navigateur de rendu cloud ne charge pas Google Fonts).
- Rendu cloud : `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` avec `Config.setBrowserExecutable(process.env.REMOTION_BROWSER)` dans `remotion.config.ts`.
- Profondeur : fausse 3D CSS (`perspective`, `rotateX/Y`, reflets, ombres) par défaut ; `@remotion/three` seulement si la scène l'exige vraiment.
- Flou de mouvement : `@remotion/motion-blur` (`<CameraMotionBlur>`).
- Voix off possible via ElevenLabs si connecté.
