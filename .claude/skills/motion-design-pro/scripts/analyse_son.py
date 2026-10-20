# Analyse d'une bande-son : tempo (BPM), attaques les plus fortes (temps, force, bande dominante), niveau par seconde.
# Usage : python3 analyse_son.py audio.wav   (wav mono 16 bits, ex. ffmpeg -i video.mp4 -ac 1 -ar 22050 audio.wav)
import sys, wave, numpy as np
w = wave.open(sys.argv[1]); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop, n = 256, 1024
frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
mag = np.abs(np.fft.rfft(frames, axis=1))
freqs = np.fft.rfftfreq(n, 1 / sr)
t = np.arange(len(mag)) * hop / sr
def band(lo, hi): return mag[:, (freqs >= lo) & (freqs < hi)].sum(1)
flux = np.maximum(np.diff(np.log1p(mag), axis=0), 0).sum(1); flux = np.r_[0, flux]
rms = np.sqrt((frames ** 2).mean(1))
# tempo via autocorrelation of onset envelope
env = flux - np.convolve(flux, np.ones(43) / 43, 'same'); env[env < 0] = 0
ac = np.correlate(env, env, 'full')[len(env) - 1:]
lags = np.arange(len(ac)) * hop / sr
m = (lags > 60 / 180) & (lags < 60 / 70)
best = lags[m][np.argmax(ac[m])]
print(f"tempo ~ {60 / best:.1f} BPM (beat {best:.3f}s)")
# strongest onsets
thr = np.percentile(env, 97)
peaks = [i for i in range(1, len(env) - 1) if env[i] > thr and env[i] >= env[i - 1] and env[i] >= env[i + 1]]
sel = []
for i in sorted(peaks, key=lambda i: -env[i]):
    if all(abs(t[i] - t[j]) > 0.15 for j in sel): sel.append(i)
sel.sort()
low, mid, high = band(20, 150), band(150, 2000), band(4000, 11000)
print("onsets (s, force, dominante):")
for i in sel:
    b = max([('grave', low[i] / low.mean()), ('médium', mid[i] / mid.mean()), ('aigu', high[i] / high.mean())], key=lambda k: k[1])[0]
    print(f"  {t[i]:6.2f}  {env[i] / env.max():.2f}  {b}")
# loudness per second
print("niveau RMS par seconde:", ' '.join(f"{20*np.log10(rms[(t>=s)&(t<s+1)].mean()+1e-9):.0f}" for s in range(int(t[-1]))))
