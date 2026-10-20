# Ajouter une vidéo de référence

Quand Benjamin partage une vidéo qui lui plaît.

## 1. Comprendre ce qu'il aime précisément

Noter mot pour mot ce qu'il dit (passages, moments, éléments). S'il ne précise rien, analyser toute la vidéo puis lui demander **une seule** question : quels passages ou quels aspects il aime le plus.

## 2. Analyser image par image

```bash
S=<scratchpad>/refNN && mkdir -p $S
F=<chemin de la vidéo>
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$F"
# Vue d'ensemble (1 image/s)
ffmpeg -v error -i "$F" -vf "fps=1,scale=240:-1,tile=8x8" -frames:v 1 $S/overview.jpg
# Passage cité, dense (6 à 10 images/s) ; recadrer si la vidéo est filmée sur un écran
ffmpeg -v error -ss <début> -t <durée> -i "$F" -vf "fps=8,scale=300:-1,tile=6x4" -frames:v 1 $S/passage.jpg
```

Si Benjamin parle du son (ou si la vidéo a une bande-son marquante), l'analyser aussi :

```bash
ffmpeg -v error -i "$F" -ac 1 -ar 22050 $S/audio.wav
python3 <skill>/scripts/analyse_son.py $S/audio.wav     # tempo, attaques, niveau par seconde
ffmpeg -v error -i $S/audio.wav -lavfi "showspectrumpic=s=1800x500:legend=1:scale=log:fscale=log" $S/spectro.png
ffmpeg -i "$F" -vf "select='gt(scene\,0.1)',showinfo" -f null - 2>&1 | grep -oE "pts_time:[0-9.]+"   # changements de plan
```
Comparer les changements de plan avec les attaques : la synchronisation est souvent la clé de ce qui plaît.

Regarder chaque planche et relever, pour chaque élément qui bouge :
- d'où il vient, où il va, en combien d'images (compter les cases : à 8 i/s une case = 0,125 s) ;
- sa courbe (arrive vite et se pose ? dépasse puis revient ?) ;
- ce qui arrive avant / après lui (décalages) ;
- sa matière (volume, reflets, ombres, flou) ;
- comment il **sort** (souvent oublié, souvent ce qui fait la qualité) ;
- comment la scène s'enchaîne avec la suivante.

## 3. Mettre à jour le skill

1. **`assets/refs/`** : enregistrer les planches des passages cités, compressées (`-q:v 6`, largeur ≤ 1400 px), nommées `REF-NN_<début>-<fin>s_<sujet>.jpg`.
2. **`bibliotheque.md`** : nouvelle fiche `REF-NN` (même structure que les existantes : source, ce que Benjamin a dit, planches, description chiffrée des passages, ce qui n'est pas retenu).
3. **`gouts.md`** : ajouter ou renforcer les règles, avec la source. Si une règle est confirmée par plusieurs références, le noter : c'est un goût fort. Si contradiction avec une règle existante → demander à Benjamin.
4. **`recettes-mouvement.md`** : traduire tout nouveau mouvement en paramètres (images, valeurs, courbe) et en code Remotion.
5. Commit + push. Si le skill est aussi installé sur claude.ai, régénérer le zip (voir `README` à la racine du skill) et prévenir Benjamin qu'il peut le remplacer.

## 4. Résumer à Benjamin

En quelques lignes : ce qui a été retenu, ce que ça change dans les prochaines vidéos, et s'il y a une contradiction à trancher.
