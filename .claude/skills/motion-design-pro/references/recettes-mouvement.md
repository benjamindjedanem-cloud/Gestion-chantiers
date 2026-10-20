# Recettes de mouvement (Remotion, 30 i/s)

Valeurs mesurées sur les références (image par image) puis traduites en paramètres. Durées en images à 30 i/s (15 images = 0,5 s). Ce sont des points de départ : ajuster à l'œil et au tempo de la musique, puis reporter ici les valeurs validées.

## 1. Courbes : jamais linéaire

```ts
import { Easing, interpolate, spring } from 'remotion';

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),     // arrivées : rapide puis se pose (expo out)
  in: Easing.bezier(0.7, 0, 0.84, 0),      // départs : démarre doucement puis file
  inOut: Easing.bezier(0.83, 0, 0.17, 1),  // déplacements caméra / transitions
};

// Ressorts : « pose » = arrivée avec léger dépassement ; « ferme » = sans rebond visible
export const springs = {
  pose: { damping: 14, mass: 0.9, stiffness: 140 },
  ferme: { damping: 22, mass: 1, stiffness: 160 },
};

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const t = (frame: number, [a, b]: [number, number], [from, to]: [number, number], easing = ease.out) =>
  interpolate(frame, [a, b], [from, to], { ...clamp, easing });
```

Règle : arrivées en `ease.out` ou ressort `pose`, départs en `ease.in`, mouvements qui relient deux scènes en `ease.inOut`.

## 2. Décalage (stagger)

- Éléments d'un même groupe : **3 à 5 images** d'écart (0,1–0,17 s).
- Contenu d'une carte (carte → titre → icône) : **5–6 images** entre chaque.
- Cartes successives d'une pile : **24 images** (0,8 s). *(REF-01)*

```ts
const delay = (i: number, step = 4) => i * step;
const p = spring({ frame: frame - delay(i), fps, config: springs.pose });
```

## 3. Carte qui grandit depuis un coin (REF-02, cartes photo)

| Phase | Images | Valeurs |
|---|---|---|
| Entrée | 0 → 12 | scale 0,3 → 1 (ressort `pose`), translate (+35 %, +30 %) → (0, 0), rotateZ 4° → 0 |
| Titre | 6 → 18 | mot par mot (voir § 6), mot-clé en couleur d'accent |
| Tenue | 18 → 36 | légère dérive : translateY 0 → −6 px |
| Sortie carrousel | 36 → 51 | carte courante translateX 0 → −105 % (`ease.inOut`), la suivante entre de +105 % → 0 en même temps ; le cadre rogne (`overflow: hidden`) |

## 4. Carte-icône avec sortie fantôme (REF-02, 17–20 s)

| Phase | Images | Valeurs |
|---|---|---|
| Entrée | 0 → 9 | translateY 220 → 0, scale 0,6 → 1 (ressort `pose`), flou de mouvement fort |
| Icône | 5 → 14 | scale 0 → 1 (ressort `pose`), opacité 0 → 1 |
| Tenue | 14 → 38 | immobile |
| Sortie | 38 → 46 | scale 1 → 1,08, translateY 0 → −40, blur 0 → 12 px, opacité 1 → 0 (`ease.in`) |
| Écho | 38 → 50 | copie du titre décalée de −30 px, opacité 0,35 → 0 |
| Vide | 46 → 52 | fond seul (respiration) avant la carte suivante |

```tsx
const exit = t(frame, [38, 46], [0, 1], ease.in);
<div style={{ transform: `translateY(${-40 * exit}px) scale(${1 + 0.08 * exit})`, filter: `blur(${12 * exit}px)`, opacity: 1 - exit }} />
```

## 5. Pile de cartes en volume (REF-01, 0–4 s)

- Nouvelle carte toutes les **24 images**, entre depuis bas-droite : translateX 60 % → 0, translateY 40 % → 0 (ressort `ferme`), `rotateY(-18deg) rotateZ(-6deg)` constant, conteneur `perspective: 1600px`.
- À chaque arrivée, les cartes déjà présentes montent de (hauteur + écart) avec le même ressort, démarré sur la même image.
- **Volume en CSS** :
  - corps : dégradé vertical (couleur claire en haut → couleur de base) ;
  - reflet : pseudo-couche blanche à 25 % d'opacité sur le tiers supérieur, coins arrondis ;
  - épaisseur : `box-shadow: 0 6px 0 <couleur foncée>` + ombre portée `0 30px 60px rgba(0,0,0,.25)` ;
  - badge logo : carré arrondi 3D, arrive 4 images après la carte avec `rotateZ 10° → 0`.
- Titre : écriture lettre par lettre, **1 lettre toutes les 1,5 image**, démarre 4 images après l'arrivée.

## 6. Texte cinétique

- **Mot par mot** : chaque mot entre en translateY 30 px → 0 + opacité 0 → 1 + blur 6 → 0 px, sur 8 images, décalage 3 images. Le **mot-clé** : 1,4× plus gros, gras, couleur d'accent, entre en dernier avec le ressort `pose`.
- **Lettre par lettre** (machine à écrire) : `text.slice(0, Math.floor((frame - start) / 1.5))`.
- Temps de lecture minimum : **0,4 s par mot + 0,5 s** après la fin de l'animation.

## 7. Fusion en points lumineux → logo (REF-01, 4–6,5 s)

1. Recul (scale du groupe 1 → 0,7, 15 images, `ease.inOut`), pause 15 images.
2. Les cartes se disposent en anneau et le groupe tourne (rotateZ 0 → 180°, 20 images, `ease.in`) avec blur croissant 0 → 30 px ; le fond passe au noir.
3. Chaque carte devient un disque de sa couleur avec `box-shadow: 0 0 60px <couleur>` (lueur), les disques tournent et convergent vers le centre (12 images).
4. Flash blanc plein cadre (opacité 0 → 1 → 0 sur 6 images).
5. Logo : scale 0,4 → 1 (ressort `pose`) + rotateY 180° → 0 ; rayons colorés derrière (`conic-gradient` des couleurs des cartes) qui tournent lentement.

## 8. Transition par un objet (REF-01, ~19 s)

- L'objet (dossier, reçu, carte…) entre, traverse le texte (z-index : passe **devant**), le texte s'efface derrière lui.
- Le décor se vide (fond uni), l'objet se recentre et rétrécit (10 images), puis **s'agrandit jusqu'à remplir le cadre** (12 images, `ease.in`) : son intérieur est la scène suivante.

## 9. Fond et profondeur

- Alternance **clair** (dégradé pastel doux, ex. `linear-gradient(135deg, #DCEBFF, #FFF4EA)`) / **sombre** (bleu nuit + halo radial bleu). Changer de fond = changer d'étape du récit.
- Profondeur de champ : éléments secondaires en bord de cadre avec `filter: blur(4–8px)` et opacité 0,6.
- Pastilles flottantes : dérive sinusoïdale lente (`Math.sin(frame / 40 + i) * 8` px), parallaxe selon la taille.

## 10. Flou de mouvement

```tsx
import { CameraMotionBlur } from '@remotion/motion-blur';
<CameraMotionBlur shutterAngle={180} samples={8}>{/* scène */}</CameraMotionBlur>
```
Coûteux au rendu : l'appliquer seulement aux séquences rapides. Alternative légère : `filter: blur()` proportionnel à la vitesse.

## 11. Montrer l'interface de l'appli (règles R-ÉCRAN et R-MOUVEMENT)

Réutiliser les **vrais composants React de l'appli** (mêmes couleurs, polices, données de démo) plutôt que des captures : net à toute taille et animable élément par élément.

- **Cadrage** : rendre le composant à grande échelle (ex. carte de chantier à 900 px de large sur 1080) ; texte ≥ 32 px.
- **Entrée dans l'écran** : si on part d'un téléphone, zoomer (scale 1 → 3,5, 18 images, `ease.inOut`) jusqu'à ce que la zone utile remplisse le cadre, puis retirer le cadre du téléphone.
- **Action visible**, dans cet ordre, ~6 images entre chaque :
  1. un doigt (cercle blanc 60 px à 40 % d'opacité, ou curseur) arrive sur le bouton, pression = scale 1 → 0,94 → 1 (6 images) ;
  2. le champ se remplit (machine à écrire, § 6) ;
  3. le résultat se met à jour **en comptant** : `Math.round(interpolate(frame, [a, a + 20], [ancien, nouveau], { ...clamp, easing: ease.out }))`, formaté en FCFA, la couleur passe de rouge à vert si la dette disparaît ;
  4. confirmation (coche, badge « Soldé ») avec ressort `pose`.
- **Suivi caméra** : le cadre glisse vers l'élément qui va changer (translate 8–12 images, `ease.inOut`) avant qu'il change ; jamais de panoramique lent sur un écran entier.
- Durée d'un geste : **2 à 3 s**, puis transition (carrousel ou sortie fantôme) vers le geste suivant.

## 12. Montants négatifs en rouge lumineux (REF-02, 20–23 s)

- Pastilles rouge `#B91C1C` à fond sombre, texte blanc tabulaire, `box-shadow: 0 0 24px rgba(239,68,68,.8)`.
- Elles apparaissent en rafale (décalage 2–3 images), positions pseudo-aléatoires fixes (`random('seed-' + i)` de Remotion), légère profondeur de champ.
- Le texte central reste lisible au-dessus (fond sombre, gras).
