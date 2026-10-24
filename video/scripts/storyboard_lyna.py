# Planches du storyboard visuel Lyna-Transfert (à valider par Benjamin avant le rendu vidéo).
# Usage : python3 scripts/storyboard_lyna.py <dossier des images clés> [16x9] → style-frames/lyna/storyboard[-16x9]-p*.jpg
import os
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1]
WIDE = len(sys.argv) > 2 and sys.argv[2] == '16x9'
OUT = os.path.join(os.path.dirname(__file__), '..', 'style-frames', 'lyna')
FD = os.path.join(os.path.dirname(__file__), '..', 'node_modules', '@fontsource', 'montserrat', 'files')
F = lambda w, s: ImageFont.truetype(os.path.join(FD, f'montserrat-latin-{w}-normal.woff'), s)
GREEN, ORANGE, INK, GREY = (15, 158, 66), (247, 154, 0), (19, 48, 31), (90, 110, 98)

SCENES = [
    ('01', '0 – 5 s', (40, 135), "« Pour vos transferts d'argent, choisissez une solution qui vous accompagne au quotidien. »",
     "Plan 1a : deux téléphones ; on appuie sur « Envoyer », un jeton FCFA file sur un trajet en pointillés et l'autre affiche « Transfert reçu ». Plan 1b : le téléphone qui reçoit glisse au centre, l'heure défile 08:15, puis 12:40, puis 18:30, et les notifications s'empilent.",
     'Transition : balayage vert en diagonale, le téléphone s\'envole vers le haut.'),
    ('02', '5 – 7 s', (166, 202), "« Au Tchad comme à l'international, »",
     "Fond vert. Gros plan sur le Tchad en blanc ; épingle orange sur N'Djamena, pointillés vers Moundou, Sarh, Abéché. Sur « international », la caméra recule sur l'Afrique et les trajets filent vers les capitales desservies et Dubaï.",
     "Transition : un anneau blanc s'ouvre depuis le centre."),
    ('03', '7 – 11 s', (252, 330), "« LYNA-TRANSFERT vous propose des services… adaptés à vos besoins. »",
     "La carte devient l'icône du logo : frontières qui s'effacent, bande orange, flèches qui se dessinent en tournant (sur le temps fort). Le nom s'écrit. Puis le logo monte en en-tête et 4 services arrivent un par un, coche orange sur chacun.",
     'Transition : balayage vert depuis la droite.'),
    ('04', '11 – 16 s', (400, 470), "« Grâce à une grille tarifaire avantageuse, bénéficiez de frais réduits sur vos transferts. »",
     "Fond vert. La grille nationale arrive ligne par ligne. Sur « frais réduits », la ligne en surbrillance descend et la pastille orange passe de 2 % à 0,5 %. Puis la carte « International dès 4 % » monte.",
     "Transition : anneau blanc qui s'ouvre."),
    ('05', '16 – 20 s', (560, 594), "« Retrouvez LYNA-TRANSFERT dans ses agences à travers N'Djamena et sur ses réseaux sociaux. »",
     "Plan stylisé de N'Djamena (le Chari). Les 6 agences tombent en épingles : Farcha, Marché à Mil, Rue de 40 m, Grand Marché, Dembé, SNER. Puis Facebook, Instagram, LinkedIn apparaissent.",
     "Transition : tout rétrécit, les flèches du logo arrivent en tournant."),
    ('06', '20 – 26 s', (640, 760), "« LYNA-TRANSFERT… Votre argent vous suit partout. »",
     "Fond blanc. Le logo se forme sur l'impact de la musique, flèches qui tournent lentement. Le slogan s'écrit mot à mot, puis le bandeau vert des contacts monte (téléphones, WhatsApp, page Facebook).",
     'Fin : accord final de la musique.'),
]

TW, TH = (560, 315) if WIDE else (330, 587)  # vignettes 16:9 ou 9:16
PAGE_W, ROW_H, TOP = (2100, 600, 150) if WIDE else (1800, 690, 150)
WRAP = 1


def page(items, n):
    im = Image.new('RGB', (PAGE_W, TOP + ROW_H * len(items) + 40), (247, 249, 244))
    d = ImageDraw.Draw(im)
    d.text((60, 45), 'Lyna-Transfert · storyboard visuel', font=F(600, 46), fill=INK)
    d.text((60, 102), f"{'16:9' if WIDE else '9:16'} · 26 s · voix off validée · page {n}/2", font=F(400, 26), fill=GREY)
    for i, (num, tm, frames, voice, what, trans) in enumerate(items):
        y = TOP + i * ROW_H
        d.rounded_rectangle((40, y, PAGE_W - 40, y + ROW_H - 30), 30, fill=(255, 255, 255))
        for j, fr in enumerate(frames):
            th = Image.open(os.path.join(SRC, f'{fr}.png')).convert('RGB').resize((TW, TH), Image.LANCZOS)
            x = 70 + j * (TW + 24)
            im.paste(th, (x, y + 30))
            d.rounded_rectangle((x, y + 30, x + TW, y + 30 + TH), 6, outline=(220, 228, 222), width=2)
            d.text((x + 10, y + 36), 'début' if j == 0 else 'fin', font=F(600, 20), fill=(255, 255, 255), stroke_width=3, stroke_fill=INK)
        tx = 70 + 2 * (TW + 24) + 30
        d.ellipse((tx, y + 34, tx + 70, y + 104), fill=GREEN)
        d.text((tx + 35, y + 69), num, font=F(600, 28), fill=(255, 255, 255), anchor='mm')
        d.text((tx + 90, y + 50), tm, font=F(600, 30), fill=INK)
        ty = y + 130
        for ln in textwrap.wrap(voice, int(52 * WRAP)):
            d.text((tx, ty), ln, font=F(600, 27), fill=GREEN)
            ty += 38
        ty += 18
        for ln in textwrap.wrap(what, int(62 * WRAP)):
            d.text((tx, ty), ln, font=F(400, 25), fill=INK)
            ty += 36
        ty += 18
        for ln in textwrap.wrap(trans, int(62 * WRAP)):
            d.text((tx, ty), ln, font=F(400, 24), fill=ORANGE)
            ty += 34
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, f"storyboard{'-16x9' if WIDE else ''}-p{n}.jpg"), quality=90)


page(SCENES[:3], 1)
page(SCENES[3:], 2)
print('ok')
