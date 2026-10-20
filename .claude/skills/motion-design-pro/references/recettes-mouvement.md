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

## 13. Whip (balayage ultra rapide) (REF-03, 9,9 s et 18,1 s)

- Durée **4 à 6 images**. Scène sortante : translateX 0 → −120 % ; scène entrante : +120 % → 0, avec `ease.inOut` très marqué (`Easing.bezier(0.9, 0, 0.1, 1)`).
- Flou de mouvement **massif** pendant le balayage : `filter: blur()` horizontal simulé par `CameraMotionBlur` (samples 12) ou par 6–8 copies décalées à opacité décroissante.
- La scène entrante arrive **inclinée** (rotateY 25° → 8°) puis se redresse sur 10 images (ressort `ferme`).
- La **dernière image du balayage tombe sur un temps fort** de la musique ; whoosh qui démarre 4–6 images avant.

## 14. Morph interface → surlignage d'un mot (REF-03, 16,6 s)

1. L'interface (composant réel) recule : scale 1 → 0,12, blur 0 → 10 px, 12 images, `ease.in` ; son `border-radius` augmente pour devenir celui d'une pastille.
2. Sur la même image où elle atteint la taille du mot, elle **est remplacée** par le rectangle de surlignage (même couleur, même taille, même position) : l'œil voit une seule forme.
3. Le mot apparaît dans le surlignage (interlettrage, § 15).
Règle générale du morph : **faire coïncider taille, position, couleur et coins** des deux éléments sur l'image de bascule.

## 15. Interlettrage (lettres qui se resserrent) (REF-03)

- Par mot : `letterSpacing` 0,6 em → 0, blur 8 → 0 px, opacité 0 → 1, sur 10 images, `ease.out` ; mots décalés de 5 images.
- Mot mis en avant : dans une pastille (fond couleur de marque, coins 0,25 em) qui grandit en largeur pendant que les lettres se resserrent.

## 16. Logos / icônes qui tournent comme des pièces (REF-03, 0–4 s)

- Chaque icône : rotateY 540° → 0 (ressort `pose`, ≈ 18 images), scale 0,5 → 1, blur 6 → 0 ; décalage 6–8 images entre icônes ; ensuite flottement sinusoïdal lent.
- Face arrière (rotateY entre 90° et 270°) : afficher le disque vide ou légèrement plus sombre (`backface-visibility`).

## 17. Point → bulle → pastille dépliée → coche → pièce 3D (REF-03, 19,7–24 s)

1. Point 8 px → bulle 220 px (ressort `pose`), « … » qui pulsent (opacité décalée), 2–3 ondes concentriques (scale 1 → 2,5, opacité 0,4 → 0, 20 images, en boucle décalée).
2. Pastille derrière la bulle : largeur 0 → 100 % depuis le centre de la bulle (14 images `ease.out`), éléments (avatars, icônes) qui entrent un par un (décalage 4 images, scale 0 → 1).
3. Repli inverse, éléments qui sortent un par un.
4. Bulle scale 1 → 0,6, les « … » se resserrent et se transforment en coche (tracé SVG `strokeDashoffset` 100 % → 0, 8 images).
5. Pop : scale 0,6 → 1,6 (ressort `pose`) + rotateY 0 → 25° + épaisseur (`box-shadow` couches) → pièce 3D.
Application type : « dette soldée ✓ », « chantier enregistré ✓ ».

## 18. Ligne de lumière (REF-03, 4,5–9,9 s)

- Ligne fine blanche (2–3 px) avec halo (`box-shadow: 0 0 40px 10px <couleur claire>`), courbée en creux sous l'élément central (SVG `path` avec `filter: drop-shadow`).
- Pivot de toute la scène (ligne + élément) : rotateZ 0 → 90°, 18 images, `ease.inOut`. L'élément central change de contenu pendant le pivot (fondu croisé de 4 images au milieu).
- Roue d'étiquettes autour : positions sur un arc, rotation par crans (chaque cran = 1 temps musical, ressort `ferme`) ; étiquette face caméra nette, les autres blur 4–6 px et inclinées.

## 19. Son : musique et effets sonores (REF-03 — essentiel pour Benjamin)

### Musique
- **Benjamin fournit le morceau** (Uppbeat, Artlist, Epidemic Sound…). Viser : électronique percussive, 120–150 BPM, avec une **coupure + montée + drop** placée vers 40 % de la durée.
- Analyser le morceau **avant** de faire le storyboard :
  ```bash
  ffmpeg -i musique.mp3 -ac 1 -ar 22050 audio.wav
  python3 scripts/analyse_son.py audio.wav          # tempo, attaques, niveau par seconde
  ffmpeg -i audio.wav -lavfi "showspectrumpic=s=1800x500:legend=1:scale=log:fscale=log" spectro.png
  ```
  Sur le spectrogramme : colonnes jaunes en bas = basses/kicks ; disparition des colonnes = coupure ; lignes qui montent = montée ; tout qui s'épaissit d'un coup = drop ; colonne blanche isolée = impact.
- Construire une **grille de temps** en images et caler dessus : `const beat = Math.round(fps * 60 / bpm)` ; placer chaque transition sur un multiple de `beat` à partir du premier temps mesuré ; la révélation principale **sur le drop**, le logo **sur l'impact final**.
- Si le morceau est plus long que la vidéo, couper sur une fin de mesure et finir sur la queue d'un impact (ne jamais couper net).

### Effets sonores
- Bibliothèque minimale dans `public/sfx/` : `whoosh` (2–3 variantes, court/long), `tick`/`clic` doux, `pop`, `impact` grave, `riser` (1–3 s), `swipe` léger, `ding`/validation, `compteur` (tic-tic rapide pour les chiffres qui défilent).
- Sources : banques de sons des mêmes sites que la musique, ou génération par ElevenLabs si le connecteur le permet.
- Correspondance mouvement → son :
  | Mouvement | Son | Placement |
  |---|---|---|
  | Whip / balayage | whoosh | démarre 4–6 images avant la fin du balayage |
  | Apparition mot / icône / carte | tick ou pop doux | sur l'image d'arrivée |
  | Chiffres qui comptent | compteur | pendant le comptage |
  | Coche / validation | ding court | sur le pop |
  | Révélation | riser → impact | riser pendant la montée, impact sur le drop |
  | Logo final | impact grave + queue | sur l'impact de la musique |
- Mixage : musique à 0,7–0,8, effets à 0,3–0,6 (les effets **accompagnent**, ils ne couvrent pas la musique) ; baisser la musique de 20 % sous une voix off.

```tsx
import { Audio, Sequence, staticFile } from 'remotion';
<Audio src={staticFile('musique.mp3')} volume={0.75} />
<Sequence from={whipFrame - 5}><Audio src={staticFile('sfx/whoosh-court.mp3')} volume={0.5} /></Sequence>
```
- Vérifier la synchro sur le rendu final : extraire une planche des images autour de chaque attaque mesurée (`ffmpeg -ss <t-0.2> -t 0.4 ... fps=30`) et confirmer que l'image change bien sur l'attaque.
