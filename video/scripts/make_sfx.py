# Génère les effets sonores de la vidéo (synthèse, aucun fichier sous licence) dans public/sfx/.
# Usage : python3 scripts/make_sfx.py
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')
rng = np.random.default_rng(7)


def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    st = np.stack([x, x], axis=1)
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def lowpass(x, alpha):
    # filtre passe-bas à un pôle ; alpha peut varier dans le temps (tableau)
    y = np.zeros_like(x)
    a = np.broadcast_to(alpha, x.shape)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def whoosh(d=0.45, rise=0.6):
    tt = t(d)
    n = rng.standard_normal(len(tt))
    # balayage : le filtre s'ouvre puis se referme
    sweep = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 1.5
    x = lowpass(n, 0.02 + 0.35 * sweep)
    x = x - lowpass(x, 0.01)  # retire le grave sourd
    env = np.clip(tt / (d * rise), 0, 1) ** 2 * np.clip((d - tt) / (d * (1 - rise)), 0, 1)
    return x * env


def tick():
    tt = t(0.06)
    return np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 90) + 0.4 * np.sin(2 * np.pi * 4100 * tt) * np.exp(-tt * 140)


def pop():
    tt = t(0.12)
    f = 900 * np.exp(-tt * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35)


def impact(d=1.6):
    tt = t(d)
    f = 38 + 70 * np.exp(-tt * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    click = rng.standard_normal(len(tt)) * np.exp(-tt * 60) * 0.5
    return body + lowpass(click, 0.3)


def riser(d=1.7):
    tt = t(d)
    n = rng.standard_normal(len(tt))
    x = lowpass(n, 0.01 + 0.4 * (tt / d) ** 2)
    x = x - lowpass(x, 0.02)
    tone = 0.25 * np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / d) ** 2) / SR)
    return (x + tone) * (tt / d) ** 2


def ding():
    tt = t(0.9)
    return (np.sin(2 * np.pi * 1318 * tt) + 0.5 * np.sin(2 * np.pi * 1975 * tt)) * np.exp(-tt * 5)


def counter(d=0.7):
    tt = t(d)
    x = np.zeros_like(tt)
    for k in np.arange(0, d, 0.035):
        i = int(k * SR)
        seg = tick()[: len(x) - i] * 0.6
        x[i : i + len(seg)] += seg
    return x


if __name__ == '__main__':
    save('whoosh', whoosh())
    save('whoosh-long', whoosh(0.8, 0.7))
    save('tick', tick())
    save('pop', pop())
    save('impact', impact())
    save('riser', riser())
    save('ding', ding())
    save('counter', counter())
    save('swoosh', whoosh(0.35, 0.4))
    print('ok')
