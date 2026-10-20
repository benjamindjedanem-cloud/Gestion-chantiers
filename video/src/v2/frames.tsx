// Images tests de la direction artistique v2 « Le plan de chantier ».
import { AbsoluteFill } from 'remotion';
import { AppPanel, EntreeDetail } from '../app/AppUI';
import { NotebookPage, Receipt, MessageBubble } from './artefacts';
import { Blueprint, CropMarks, F, Marker, Meta, P, Ruler, STROKES, Title } from './kit';

const M = 88; // marge de la grille

// S1 · Accroche : titre massif aligné à gauche, mot-clé souligné au feutre, règle laser.
export const V2S1 = () => (
  <AbsoluteFill>
    <Blueprint />
    <CropMarks />
    <Meta style={{ position: 'absolute', left: M, top: 70 }}>Gestion Chantiers</Meta>
    <div style={{ position: 'absolute', left: M, top: 440 }}>
      <Title size={140} style={{ whiteSpace: 'nowrap' }}>Vous gérez</Title>
      <Title size={140} style={{ marginTop: 16, whiteSpace: 'nowrap' }}>
        des{' '}
        <span style={{ position: 'relative', color: P.orange }}>
          chantiers
          <Marker d={STROKES.underline} w={620} h={60} width={11} style={{ position: 'absolute', left: -10, top: 124, width: '105%' }} />
        </span>
        &nbsp;?
      </Title>
    </div>
    <Ruler y={1010} from={M} to={1080 - M} />
  </AbsoluteFill>
);

// S2 · Le chaos : vrais objets qui s'empilent en désordre.
export const V2S2 = () => (
  <AbsoluteFill>
    <Blueprint light={0.7} />
    <CropMarks />
    <div style={{ position: 'absolute', left: M, top: 92 }}>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 52, letterSpacing: '-0.03em', color: 'rgba(243,239,230,0.72)' }}>
        Avances, paiements, dépenses…
      </div>
      <Title size={120} style={{ marginTop: 10 }}>
        tout se <span style={{ color: P.orange }}>mélange</span>.
      </Title>
      <Marker d={STROKES.scribble} w={470} h={70} width={7} style={{ position: 'absolute', left: 420, top: 170 }} />
    </div>
    <NotebookPage style={{ left: 70, top: 430, transform: 'rotate(-7deg)' }} />
    <Receipt style={{ left: 640, top: 520, transform: 'rotate(9deg)' }} />
    <MessageBubble
      from="Maçon Jean"
      text="Patron, il me reste combien à recevoir ?"
      time="18:42"
      style={{ left: 430, top: 1035, width: 560, transform: 'rotate(-2.5deg)' }}
    />
  </AbsoluteFill>
);

// S6 · Geste 1 : l'interface en grand, annotée au feutre comme sur un plan.
export const V2S6 = () => (
  <AbsoluteFill>
    <Blueprint />
    <CropMarks />
    <div style={{ position: 'absolute', left: M, top: 92 }}>
      <Meta style={{ color: P.orange }}>01 — Entrées</Meta>
      <Title size={92} style={{ marginTop: 22 }}>
        Chaque paiement
        <br />
        reçu, <span style={{ color: P.orange }}>noté</span>.
      </Title>
    </div>
    <AppPanel
      scale={2.45}
      glow={false}
      style={{ top: 430, left: M, borderRadius: 40, boxShadow: '0 2px 4px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.45), 0 80px 120px rgba(0,0,0,0.35)' }}
    >
      <EntreeDetail
        chantier="VILLA FARCHA"
        total={8_500_000}
        entrees={[
          { versePar: 'M. Mahamat Saleh', description: 'Deuxième tranche', date: '20/10/2026', mode: 'Espèces', montant: 2_500_000 },
          { versePar: 'M. Mahamat Saleh', description: 'Avance de démarrage', date: '02/09/2026', mode: 'Virement bancaire', montant: 6_000_000 },
        ]}
      />
    </AppPanel>
    {/* annotation au feutre : cercle autour de la nouvelle entrée */}
    <Marker d={STROKES.circle} viewBox="0 0 400 100" w={1000} h={250} width={5} style={{ position: 'absolute', left: 48, top: 748 }} />
    {/* annotation : flèche vers le total mis à jour */}
    <Marker d="M130 10 C 90 14, 50 30, 14 52 M 34 34 L 12 54 L 40 62" viewBox="0 0 140 70" w={150} h={75} width={5} style={{ position: 'absolute', left: 640, top: 668 }} />
    <div style={{ position: 'absolute', left: 800, top: 640, fontFamily: F.hand, fontWeight: 700, fontSize: 50, color: P.orange, transform: 'rotate(-5deg)' }}>à jour !</div>
  </AbsoluteFill>
);

export const V2_FRAMES = { V2S1, V2S2, V2S6 };
