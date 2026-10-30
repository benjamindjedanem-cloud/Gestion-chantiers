# Planches du storyboard visuel ADN Créatif (à valider par Benjamin avant le rendu vidéo).
# Usage : python3 scripts/storyboard_adn.py <dossier des images clés> → style-frames/adn/storyboard-p*.jpg
import os
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'style-frames', 'adn')
FD = os.path.join(os.path.dirname(__file__), '..', 'node_modules', '@fontsource', 'montserrat', 'files')
F = lambda w, s: ImageFont.truetype(os.path.join(FD, f'montserrat-latin-{w}-normal.woff'), s)
BLUE, YEL, INK, GREY = (10, 16, 200), (190, 150, 0), (11, 14, 58), (90, 95, 134)

SCENES = [
    ('01', '0 – 2 s', (20, 50), '« Trois secondes. »',
     'Typographie seule sur le bleu du logo : un « 3 » géant monte, le trait jaune du logo passe dessous, « SECONDES » s\'écrit en capitales espacées.',
     'Transition : traînées de couleur bleu et jaune (REF-09).'),
    ('02', '2 – 8 s', (100, 215), "« C'est le temps qu'il faut à un client pour décider de s'arrêter sur votre publication, ou de passer à la suivante. »",
     'Téléphone, fil d\'actualité fait de vraies photos floutées (contenu indistinct). Sur « s\'arrêter », le fil se pose et un minuteur 3 s se vide ; sur « passer », le pouce balaie et le fil repart.',
     'Transition : traînées de couleur.'),
    ('03', '8 – 11 s', (275, 322), '« Alors, que voit-il en ces trois secondes ? »',
     'Barre de recherche (REF-10) : un point devient loupe, la barre s\'étire, « Que voit-il en 3 secondes ? » se tape. Puis la barre se referme en sphère.',
     'Transition : la sphère devient le logo (REF-10).'),
    ('04', '11 – 17 s', (360, 470), '« Chez ADN Créatif, nous fabriquons ces trois secondes de sorte à faire arrêter votre potentiel client. »',
     'Logo en couches (REF-09) : le A apparaît, le trait jaune glisse, étincelle et reflet ; « ADN Créatif » se tape. « On fabrique ces 3 secondes » en typographie géante. Puis le fil revient avec un vrai spot ADN (Gestion Chantiers) : le pouce s\'arrête, pastille « Arrêté ».',
     'Transition : cercle qui grandit depuis le centre (REF-10).'),
    ('05', '17 – 23 s', (540, 690), "« Des visuels de communication, des spots publicitaires et des sites qui arrêtent le regard, et qui donnent envie d'en savoir plus. »",
     'Accordéon de services (REF-10) avec vos vraies réalisations : affiches Gestion Chantiers, spot Lyna-Transfert qui joue, site Tchad Immobilier, puis un second site (parties sans le nom du client) qui défilent ; le volet actif s\'ouvre, son nom se tape. Puis tous les volets s\'égalisent et « En savoir plus » est cliqué.',
     'Transition : traînées de couleur.'),
    ('06', '23 – 26 s', (740, 790), "« Parce qu'un client qui s'arrête est un client qui peut acheter. »",
     'Typographie seule : « Un client qui » puis le mot géant « s\'arrête », qui roule et devient « achète » (roue de mots, REF-03/09/10), souligné du trait jaune.',
     'Transition : cercle qui grandit.'),
    ('07', '26 – 29 s', (835, 880), '« Écrivez-nous maintenant sur nos différents réseaux sociaux. »',
     '« Écrivez-nous maintenant. » Une pastille change de forme à chaque réseau (REF-10) : Facebook, Instagram, WhatsApp, LinkedIn. « sur nos réseaux sociaux » se tape.',
     'Transition : traînées de couleur.'),
    ('08', '29 – 35 s', (930, 1030), '« ADN Créatif. Le catalyseur de croissance. »',
     'Logo en couches avec reflet, « ADN Créatif » tapé, « LE CATALYSEUR DE CROISSANCE » en capitales espacées, trait jaune.',
     'Fin.'),
]

TW, TH = 300, 533
PAGE_W, ROW_H, TOP = 1800, 620, 150


def page(items, n, total):
    im = Image.new('RGB', (PAGE_W, TOP + ROW_H * len(items) + 40), (246, 247, 252))
    d = ImageDraw.Draw(im)
    d.text((60, 45), 'ADN Créatif · storyboard visuel', font=F(600, 46), fill=INK)
    d.text((60, 102), f'9:16 · 35 s · v2 · vraies réalisations + typographie · page {n}/{total}', font=F(400, 26), fill=GREY)
    for i, (num, tm, frames, voice, what, trans) in enumerate(items):
        y = TOP + i * ROW_H
        d.rounded_rectangle((40, y, PAGE_W - 40, y + ROW_H - 30), 30, fill=(255, 255, 255))
        for j, fr in enumerate(frames):
            th = Image.open(os.path.join(SRC, f'{fr}.png')).convert('RGB').resize((TW, TH), Image.LANCZOS)
            x = 70 + j * (TW + 24)
            im.paste(th, (x, y + 28))
            d.rounded_rectangle((x, y + 28, x + TW, y + 28 + TH), 6, outline=(222, 225, 240), width=2)
            d.text((x + 10, y + 34), 'début' if j == 0 else 'fin', font=F(600, 20), fill=(255, 255, 255), stroke_width=3, stroke_fill=INK)
        tx = 70 + 2 * (TW + 24) + 30
        d.ellipse((tx, y + 30, tx + 70, y + 100), fill=BLUE)
        d.text((tx + 35, y + 65), num, font=F(600, 28), fill=(255, 255, 255), anchor='mm')
        d.text((tx + 90, y + 46), tm, font=F(600, 30), fill=INK)
        ty = y + 125
        for ln in textwrap.wrap(voice, 58):
            d.text((tx, ty), ln, font=F(600, 27), fill=BLUE)
            ty += 38
        ty += 16
        for ln in textwrap.wrap(what, 68):
            d.text((tx, ty), ln, font=F(400, 25), fill=INK)
            ty += 36
        ty += 16
        for ln in textwrap.wrap(trans, 68):
            d.text((tx, ty), ln, font=F(400, 24), fill=YEL)
            ty += 34
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, f'storyboard-p{n}.jpg'), quality=90)


page(SCENES[:3], 1, 3)
page(SCENES[3:6], 2, 3)
page(SCENES[6:], 3, 3)
print('ok')
