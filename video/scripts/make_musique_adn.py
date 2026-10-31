# Musique de fond du spot ADN Créatif, synthétisée (aucun fichier sous licence), différente de celle de Lyna :
# électro minimale et tendue à 107 BPM, en la mineur — synthé « pluck » filtré, sous-basse, charleston en
# tic-tac d'horloge (le thème des 3 secondes), suspension sur la question, groove à l'apparition du logo.
# Tempo choisi pour que les changements de plan (images 245, 332, 500, 704, 800, 884) tombent sur des temps.
# Usage : python3 scripts/make_musique_adn.py → public/adn/musique.wav
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, lfilter

SR = 44100
BPM = 107
BEAT = 60 / BPM
OFF = 0.39  # premier temps
S16 = BEAT / 4
TOTAL = 35.2
N = int(SR * TOTAL)
rng = np.random.default_rng(23)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'adn', 'musique.wav')
L, R = np.zeros(N), np.zeros(N)
REV = (np.zeros(N), np.zeros(N))


def tt(d):
    return np.arange(int(SR * d)) / SR


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def filt(x, f, kind='low', order=2):
    w = np.clip(np.asarray(f, dtype=float) / (SR / 2), 1e-4, 0.999)
    b, a = butter(order, w if w.ndim else float(w), btype=kind)
    return lfilter(b, a, x)


def put(x, at, gain=1.0, pan=0.0, bus=None):
    i = int(at * SR)
    if i >= N or i < 0:
        return
    x = x[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    b = bus or (L, R)
    b[0][i : i + len(x)] += x * l * 1.414
    b[1][i : i + len(x)] += x * r * 1.414


def bt(n):
    return OFF + n * BEAT


# ---------- instruments ----------
def kick():
    t = tt(0.4)
    f = 42 + 110 * np.exp(-t * 32)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)) + filt(rng.standard_normal(len(t)), 4000, 'high') * np.exp(-t * 400) * 0.2


def clap():
    t = tt(0.3)
    n = filt(rng.standard_normal(len(t)), [1100, 3200], 'band')
    env = sum((t >= d) * np.exp(-(t - d).clip(0) * (200 if k < 2 else 26)) for k, d in enumerate([0, 0.009, 0.019]))
    return n * env * 0.7


def tick(accent=False):
    # tic-tac d'horloge, net et sec
    t = tt(0.05)
    return (np.sin(2 * np.pi * (3200 if accent else 2600) * t) * np.exp(-t * 180) + filt(rng.standard_normal(len(t)), 7000, 'high') * np.exp(-t * 260) * 0.4) * (0.6 if accent else 0.4)


def hat():
    t = tt(0.06)
    return filt(rng.standard_normal(len(t)), 8000, 'high') * np.exp(-t * 90) * 0.35


def pluck(m, d=0.5, bright=1.0):
    t = tt(d)
    f = hz(m)
    saw = 2 * ((t * f) % 1) - 1 + 0.5 * (2 * ((t * f * 1.005) % 1) - 1)
    env = np.exp(-t * 7)
    out = np.zeros_like(t)
    seg = int(SR * 0.01)
    for i in range(0, len(t), seg):  # filtre qui se referme vite : attaque « pluck »
        fc = 400 + 5200 * bright * np.exp(-(i / SR) * 14)
        out[i : i + seg] = filt(saw[i : i + seg], fc, 'low', 2)
    return out * env * 0.35


def sub(m, d):
    t = tt(d)
    x = np.sin(2 * np.pi * hz(m) * t) + 0.25 * np.sin(4 * np.pi * hz(m) * t)
    return np.tanh(1.5 * x) * np.minimum((t / 0.01).clip(0, 1), ((d - t) / 0.08).clip(0, 1)) * 0.5


def pad(ms, d):
    t = tt(d)
    x = sum(np.sin(2 * np.pi * hz(m + det) * t + rng.uniform(0, 6)) for m in ms for det in (-0.08, 0, 0.07)) * 0.08
    x += sum(((2 * ((t * hz(m) + 0.3) % 1) - 1)) for m in ms) * 0.03
    x = filt(x, 1800, 'low')
    return x * np.minimum((t / 0.4).clip(0, 1), ((d - t) / 0.5).clip(0, 1))


def riser(d):
    t = tt(d)
    n = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    seg = int(SR * 0.04)
    for i in range(0, len(t), seg):
        out[i : i + seg] = filt(n[i : i + seg], 300 + 6000 * (i / len(t)) ** 2, 'low')
    return filt(out, 250, 'high') * (t / d) ** 2 * 0.45


def boom():
    t = tt(2.4)
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(32 + 55 * np.exp(-t * 6)) / SR) * np.exp(-t * 2))


# ---------- arrangement (temps) ----------
# Am – F – C – G, une mesure (4 temps) par accord
PROG = [([57, 60, 64], 45), ([53, 57, 60], 41), ([48, 52, 55], 36), ([55, 59, 62], 43)]
ARP = [0, 2, 1, 2, 0, 2, 1, 3]  # motif d'arpège (indices dans l'accord + octave)


def chord(n):
    return PROG[(int(n) // 4) % 4]


TOTAL_BEATS = 62
for n in range(TOTAL_BEATS):
    t0 = bt(n)
    ch, root = chord(n)
    intro = n < 14
    suspense = 14 <= n < 19
    groove = (19 <= n < 41) or (47 <= n < 52)
    half = 41 <= n < 47
    ending = n >= 52

    if n % 4 == 0 and not ending:
        p = pad(ch, BEAT * 4 + 0.3)
        put(p, t0, 0.5 if suspense else 0.35)
        put(p, t0, 0.3, 0, REV)

    # tic-tac : le temps qui passe (fort pendant l'intro et la question)
    if not ending:
        put(tick(n % 4 == 0), t0, 0.9 if (intro or suspense) else 0.45, 0.3)

    if suspense or ending:
        continue

    notes = ch + [ch[0] + 12]
    for k in range(2):  # croches d'arpège
        m = notes[ARP[(n * 2 + k) % len(ARP)]] + (12 if groove else 0)
        x = pluck(m, 0.45, 0.6 if intro else 1.0)
        put(x, t0 + k * BEAT / 2, 0.55 if intro else 0.7, -0.3 if k else 0.3)
        put(x, t0 + k * BEAT / 2, 0.3, 0, REV)
        put(x, t0 + k * BEAT / 2 + 3 * S16, 0.15, 0.6 if k else -0.6)

    put(sub(root, BEAT * 0.9), t0, 0.55 if groove else 0.35)
    if groove:
        put(kick(), t0, 0.85)
        if n % 2 == 1:
            put(clap(), t0, 0.5)
            put(clap(), t0, 0.25, 0, REV)
        for k in (1, 3):
            put(hat(), t0 + k * S16, 0.8, -0.4)
    if half and n % 2 == 0:
        put(kick(), t0, 0.8)
    if half and n % 4 == 2:
        put(clap(), t0, 0.5)

# montées et impacts sur les plans
put(riser(bt(14) - bt(12)), bt(12), 0.5)          # vers la question (temps 14)
put(boom(), bt(14), 0.35)
put(riser(bt(19) - bt(16)), bt(16), 0.6)          # vers le logo (temps 19)
put(boom(), bt(19), 0.5)
put(boom(), bt(29), 0.3)                          # services
put(riser(bt(41) - bt(39)), bt(39), 0.4)          # « s'arrête »
put(boom(), bt(52), 0.6)                          # logo final
fin = pad([57, 60, 64, 69], 3.6)
put(fin, bt(52), 0.7)
put(fin, bt(52), 0.5, 0, REV)
for i, m in enumerate([69, 72, 76, 81]):
    put(pluck(m, 1.6), bt(52) + i * 0.07, 0.6, (-0.4, 0.4)[i % 2])
    put(pluck(m, 1.6), bt(52) + i * 0.07, 0.4, 0, REV)

ir_t = tt(1.8)
for b, ch_out in zip(REV, (L, R)):
    ir = filt(rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2), 4500, 'low')
    ch_out += fftconvolve(b, ir)[:N] / np.max(np.abs(ir)) * 0.02

fade = np.clip((TOTAL - np.arange(N) / SR) / 1.4, 0, 1)
L, R = filt(L * fade, 30, 'high'), filt(R * fade, 30, 'high')
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = np.tanh(1.3 * L / peak) / np.tanh(1.3) * 0.89, np.tanh(1.3 * R / peak) / np.tanh(1.3) * 0.89
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print('ok', OUT)
