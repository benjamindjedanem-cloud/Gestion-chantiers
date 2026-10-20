import { CSSProperties } from 'react';
import { V, fonts } from '../theme';

// Une phrase dont un ou plusieurs mots-clés sont mis en valeur (plus gros, gras, bleu lumineux).
// Syntaxe : les mots-clés sont entourés d'astérisques, ex. "Qui vous doit *encore* ?".
export type Token = { text: string; key: boolean; suffix?: string };

// Les mots-clés (entre astérisques) restent groupés et ne se coupent pas en fin de ligne ;
// la ponctuation finale (. , … ;) se colle au mot qui la précède, dans le style normal.
export const tokenize = (s: string): Token[] => {
  const out: Token[] = [];
  for (const part of s.split(/(\*[^*]+\*)/).filter(Boolean)) {
    if (part.startsWith('*')) {
      out.push({ text: part.slice(1, -1), key: true });
      continue;
    }
    for (const w of part.split(/\s+/).filter(Boolean)) {
      const m = /^([.,…;]+)(.*)$/.exec(w);
      if (m && out.length) {
        const prev = out[out.length - 1];
        prev.suffix = (prev.suffix || '') + m[1];
        if (m[2]) out.push({ text: m[2], key: false });
      } else out.push({ text: w, key: false });
    }
  }
  return out;
};

export const keyStyle = (color = V.glowSoft): CSSProperties => ({
  color,
  fontWeight: 700,
  textShadow: `0 0 28px ${color}, 0 0 60px rgba(96,165,250,0.45)`,
});

export const Phrase = ({
  text,
  size = 64,
  keyScale = 1.25,
  color = '#fff',
  keyColor = V.glowSoft,
  style,
  align = 'center',
  weight = 600,
}: {
  text: string;
  size?: number;
  keyScale?: number;
  color?: string;
  keyColor?: string;
  style?: CSSProperties;
  align?: 'center' | 'left';
  weight?: number;
}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: '-0.02em',
      lineHeight: 1.12,
      textAlign: align,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      alignItems: 'baseline',
      columnGap: size * 0.28,
      ...style,
    }}
  >
    {tokenize(text).map((t, i) => (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        <span style={t.key ? { ...keyStyle(keyColor), fontSize: size * keyScale } : undefined}>{t.text}</span>
        {t.suffix}
      </span>
    ))}
  </div>
);
