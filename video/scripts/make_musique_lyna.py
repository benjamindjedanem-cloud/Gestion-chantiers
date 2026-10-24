# Musique de fond du spot Lyna-Transfert, entièrement synthétisée (aucun fichier sous licence).
# Afro-pop léger à 115 BPM : kalimba, shaker, rim en tresillo, basse « log drum », pad chaud.
# Le tempo et la grille sont calés sur la voix off (voix posée à 0,69 s) : les changements de plan
# tombent sur les temps 10, 14, 22, 31, 39 et 42 ; mesures sur les temps 2 + 4k.
# Usage : python3 scripts/make_musique_lyna.py  → public/lyna/musique.wav
import os
import wave

import numpy as np
from scipy.signal import butter, lfilter, fftconvolve

SR = 44100
BPM = 115
BEAT = 60 / BPM
S16 = BEAT / 4
TOTAL = 26.4
N = int(SR * TOTAL)
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'lyna', 'musique.wav')

L = np.zeros(N)
R = np.zeros(N)


def tt(d):
    return np.arange(int(SR * d)) / SR


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def filt(x, f, kind='low', order=2):
    w = np.clip(np.asarray(f, dtype=float) / (SR / 2), 1e-4, 0.999)
    b, a = butter(order, w if w.ndim else float(w), btype=kind)
    return lfilter(b, a, x)


def put(x, at, gain=1.0, pan=0.0, bus=None):
    i = int(at * SR)
    if i >= N:
        return
    x = x[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    (bus or (L, R))[0][i : i + len(x)] += x * l * 1.414
    (bus or (L, R))[1][i : i + len(x)] += x * r * 1.414


# ---------- instruments ----------
def kick():
    t = tt(0.45)
    f = 46 + 95 * np.exp(-t * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    click = filt(rng.standard_normal(len(t)), 3000, 'high') * np.exp(-t * 300) * 0.25
    return np.tanh(1.6 * body) + click


def clap():
    t = tt(0.35)
    n = filt(rng.standard_normal(len(t)), [900, 2600], 'band')
    env = np.zeros_like(t)
    for k, d in enumerate([0, 0.011, 0.022]):
        env += (t >= d) * np.exp(-(t - d).clip(0) * (180 if k < 2 else 22))
    return n * env * 0.8


def shaker(accent):
    t = tt(0.07)
    n = filt(rng.standard_normal(len(t)), 6500, 'high')
    env = (t / 0.008).clip(0, 1) * np.exp(-t * 55)
    return n * env * (0.55 if accent else 0.3)


def rim():
    t = tt(0.09)
    return (np.sin(2 * np.pi * 1650 * t) * 0.6 + np.sin(2 * np.pi * 820 * t)) * np.exp(-t * 70) * 0.5


def logdrum(midi, d=0.32):
    t = tt(d)
    f0 = hz(midi)
    f = f0 * (1 + 1.2 * np.exp(-t * 60))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    x += 0.35 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR) * np.exp(-t * 18)
    return np.tanh(2.2 * x) * 0.8


def kalimba(midi, d=1.1):
    t = tt(d)
    f = hz(midi)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 4.5)
    x += 0.32 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 22)  # partiel métallique
    x += 0.15 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 9)
    x *= (t / 0.002).clip(0, 1)
    return x * 0.5


def pad(midis, d):
    t = tt(d)
    x = np.zeros_like(t)
    for m in midis:
        for det in (-0.12, 0.0, 0.11):
            ph = rng.uniform(0, 1)
            x += ((2 * ((t * hz(m + det) + ph) % 1) - 1)) * 0.12
    x = filt(x, 1500, 'low', 2)
    env = np.minimum((t / 0.25).clip(0, 1), ((d - t) / 0.35).clip(0, 1))
    return x * env


def noise_riser(d):
    t = tt(d)
    n = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    seg = int(SR * 0.05)
    for i in range(0, len(t), seg):  # filtre qui s'ouvre par paliers de 50 ms
        fc = 400 + 7000 * (i / len(t)) ** 2
        out[i : i + seg] = filt(n[i : i + seg], fc, 'low', 2)
    out = filt(out, 300, 'high')
    return out * (t / d) ** 2.2 * 0.5


def boom():
    t = tt(2.2)
    f = 34 + 60 * np.exp(-t * 7)
    return np.tanh(1.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2))


def crash():
    t = tt(2.4)
    n = filt(rng.standard_normal(len(t)), 5000, 'high')
    return n * np.exp(-t * 2.4) * 0.35


# ---------- arrangement ----------
CHORDS = {  # accords (MIDI) par mesure : Rém – Sib – Do – Fa
    'Dm': [62, 65, 69], 'Bb': [58, 62, 65], 'C': [60, 64, 67], 'F': [65, 69, 72],
}
ROOT = {'Dm': 38, 'Bb': 34, 'C': 36, 'F': 41}
PROG = ['F', 'Dm', 'Bb', 'C']


def beat_t(b):
    return b * BEAT


def chord_of_bar(k):
    return PROG[(k + 1) % 4]


rev_bus = (np.zeros(N), np.zeros(N))  # envoi réverbe
kick_env = np.zeros(N)  # pour le « pompage » (side-chain)

NB = 11  # mesures 0..10 (temps 2 à 45), puis accord final au temps 46

# levée : petite montée de kalimba sur les temps 0–1
for i, m in enumerate([62, 65, 69, 72]):
    put(kalimba(m), beat_t(0.5 + i * 0.4), 0.5, 0.2, None)

for k in range(NB):
    b0 = 2 + 4 * k
    t0 = beat_t(b0)
    ch = chord_of_bar(k)
    full = 3 <= k <= 8 or k == 10
    breakdown = k == 9

    # pad (toujours), plus feutré dans l'intro
    p = pad(CHORDS[ch], BEAT * 4 + 0.3)
    put(p, t0, 0.55 if k < 3 else 0.42, 0)
    put(p, t0, 0.25, 0, rev_bus)

    # kalimba : arpège syncopé sur les notes de l'accord
    notes = CHORDS[ch] + [CHORDS[ch][0] + 12, CHORDS[ch][1] + 12]
    pattern = [0, 3, 6, 8, 10, 12, 14] if k >= 1 else [0, 4, 8, 12]
    order = [0, 2, 3, 1, 4, 2, 3]
    if full and k % 2 == 1:  # réponse mélodique une mesure sur deux
        pattern = [0, 2, 4, 7, 10, 12, 15]
        order = [4, 3, 2, 3, 1, 2, 0]
    for j, s in enumerate(pattern):
        m = notes[order[j % len(order)]]
        g = 0.55 if s % 4 == 0 else 0.4
        if breakdown:
            g *= 0.7
        x = kalimba(m)
        put(x, t0 + s * S16, g, -0.25 if j % 2 else 0.25)
        put(x, t0 + s * S16, 0.35 * g, 0, rev_bus)
        put(x, t0 + s * S16 + 3 * S16, 0.18 * g, 0.7 if j % 2 else -0.7)  # écho 3/16

    # percussions
    for s in range(16):
        swing = 0.012 if s % 2 else 0
        at = t0 + s * S16 + swing
        if k >= 0 and not breakdown:
            put(shaker(s % 4 == 2), at, 0.5 if k < 2 else 0.7, 0.35)
        if k >= 1 and s in (0, 3, 6, 8, 11, 14) and not breakdown:
            put(rim(), at, 0.35 if k < 3 else 0.45, -0.35)
    kicks = [0] if k == 0 else [0, 8] if k < 3 else [0, 7, 8] if not breakdown else [0]
    if k == 10:
        kicks = [0, 7, 8]
    for s in kicks:
        put(kick(), t0 + s * S16, 0.9)
        i = int((t0 + s * S16) * SR)
        e = np.exp(-tt(0.3) * 12)
        kick_env[i : i + len(e)] = np.maximum(kick_env[i : i + len(e)], e[: max(0, N - i)])
    if full or k == 2:
        for s in ([4, 12] if full else [12]):
            put(clap(), t0 + s * S16, 0.55, 0.05)
            put(clap(), t0 + s * S16, 0.3, 0, rev_bus)

    # basse « log drum »
    if k >= 2 and not breakdown:
        r = ROOT[ch]
        for s, off in [(0, 0), (3, 0), (6, 12), (10, 0), (11, 7), (14, 12)]:
            put(logdrum(r + off), t0 + s * S16, 0.5)
    if breakdown:
        put(logdrum(ROOT[ch], 0.8), t0 + 4 * S16, 0.6)

# montées et impacts calés sur les plans
put(noise_riser(beat_t(2.0)), beat_t(12), 0.55)       # vers la révélation du logo (temps 14)
put(crash(), beat_t(14), 0.6, 0.1)
put(boom(), beat_t(14), 0.45)
put(noise_riser(beat_t(1.0)), beat_t(38), 0.45)      # vers le logo final (temps 39)
put(boom(), beat_t(39), 0.55)
put(crash(), beat_t(39), 0.45, -0.1)
put(crash(), beat_t(42), 0.35, 0.1)

# accord final (temps 46) qui résonne jusqu'au bout
tf = beat_t(46)
put(kick(), tf, 1.0)
put(boom(), tf, 0.5)
put(crash(), tf, 0.5)
for i, m in enumerate([65, 69, 72, 77]):
    put(kalimba(m, 2.4), tf + i * 0.03, 0.55, (-0.3, 0.3)[i % 2])
    put(kalimba(m, 2.4), tf + i * 0.03, 0.4, 0, rev_bus)
fp = pad([53, 65, 69, 72], 2.4)
put(fp, tf, 0.5)
put(fp, tf, 0.4, 0, rev_bus)

# réverbe (réponse impulsionnelle synthétique, 1,6 s)
ir_t = tt(1.6)
for bus_i, ch_out in enumerate((L, R)):
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.6)
    ir = filt(ir, 5000, 'low')
    wet = fftconvolve(rev_bus[bus_i], ir)[:N]
    ch_out += wet / np.max(np.abs(ir)) * 0.02

# léger pompage sur tout le mix (kick épargné : il est déjà dans le bus, effet discret)
duck = 1 - 0.18 * kick_env
L *= duck
R *= duck

# fondu de sortie et mastering simple
fade = np.clip((TOTAL - np.arange(N) / SR) / 1.2, 0, 1)
fade_in = np.clip(np.arange(N) / SR / 0.02, 0, 1)
L *= fade * fade_in
R *= fade * fade_in
L = filt(L, 30, 'high')
R = filt(R, 30, 'high')
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L, R = np.tanh(1.3 * L / peak) / np.tanh(1.3) * 0.89, np.tanh(1.3 * R / peak) / np.tanh(1.3) * 0.89

st = np.stack([L, R], axis=1)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('ok', OUT, f'{TOTAL:.1f} s')
