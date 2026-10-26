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
    ('01', '0 – 2 s', (30, 52), '« Trois secondes. »',
     'Fond bleu du logo. Un grand « 3 s » apparaît, entouré d\'un anneau jaune qui se vide comme un minuteur.',
     'Transition : on plonge dans le « 3 » (zoom), le fil d\'actualité apparaît.'),
    ('02', '2 – 8 s', (100, 215), "« C'est le temps qu'il faut à un client pour décider de s'arrêter sur votre publication, ou de passer à la suivante. »",
     'Téléphone, fil d\'actualité qui défile vite (publications ternes, marques fictives). Sur « s\'arrêter », le pouce stoppe le fil et un minuteur « 3 s » se vide. Sur « passer à la suivante », le pouce balaie et la publication s\'envole.',
     'Transition : balayage bleu en diagonale.'),
    ('03', '8 – 11 s', (262, 300), '« Alors, que voit-il en ces trois secondes ? »',
     'Un œil s\'ouvre, regarde à gauche puis à droite, cligne ; trois petits repères 3-2-1 apparaissent autour.',
     "Transition : l'œil se ferme, le logo naît à sa place."),
    ('04', '11 – 17 s', (345, 470), '« Chez ADN Créatif, nous fabriquons ces trois secondes de sorte à faire arrêter votre potentiel client. »',
     "Le « A » blanc se dessine, le trait jaune glisse en place, « ADN Créatif » s'écrit. Le logo monte en en-tête ; une publication se monte pièce par pièce (fond, visuel, titre, prix, bouton). Le pouce s'y pose : pastille jaune « Arrêté ».",
     "Transition : anneau blanc qui s'ouvre."),
    ('05', '17 – 23 s', (520, 690), '« Des visuels de communication, des spots publicitaires et des sites qui arrêtent le regard, et qui donnent envie d\'en savoir plus. »',
     'Un service par temps de voix : affiche, puis lecteur vidéo (lecture, barre qui avance), puis site web qui se charge. Les cartes arrivent et s\'empilent. Sur « en savoir plus », un bouton « En savoir plus » est cliqué.',
     'Transition : balayage bleu depuis la droite.'),
    ('06', '23 – 26 s', (740, 790), "« Parce qu'un client qui s'arrête est un client qui peut acheter. »",
     "Fond bleu. « S'arrête » (œil) relié par un trait jaune en pointillés à « Achète » (sac). Puis une notification « Nouvelle commande » tombe.",
     "Transition : anneau blanc qui s'ouvre."),
    ('07', '26 – 29 s', (822, 868), '« Écrivez-nous maintenant sur nos différents réseaux sociaux. »',
     'Conversation : le client écrit (points de saisie), « Bonjour ADN Créatif, je veux un spot pour ma boutique. », réponse « Avec plaisir ! On en parle ? ». Puis Facebook, Instagram, LinkedIn, WhatsApp apparaissent.',
     'Transition : balayage bleu vers le haut.'),
    ('08', '29 – 35 s', (940, 1030), '« ADN Créatif. Le catalyseur de croissance. »',
     'Le logo se forme (le A, puis le trait jaune), « ADN Créatif » s\'écrit, puis le slogan. Une courbe de croissance jaune monte en bas de l\'écran.',
     'Fin.'),
]

TW, TH = 300, 533
PAGE_W, ROW_H, TOP = 1800, 620, 150


def page(items, n, total):
    im = Image.new('RGB', (PAGE_W, TOP + ROW_H * len(items) + 40), (246, 247, 252))
    d = ImageDraw.Draw(im)
    d.text((60, 45), 'ADN Créatif · storyboard visuel', font=F(600, 46), fill=INK)
    d.text((60, 102), f'9:16 · 35 s · voix off validée « 3 secondes » · page {n}/{total}', font=F(400, 26), fill=GREY)
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
