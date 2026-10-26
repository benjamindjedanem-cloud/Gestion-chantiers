import React, { useEffect } from 'react';
import { X, Building2, ChevronLeft, Plus } from 'lucide-react';

/* Composants d'interface partagés par tous les écrans de l'app. */

// Logo de l'app (casque, immeubles, presse-papiers). Source unique : public/favicon.svg,
// dont sont aussi tirées les icônes PNG (public/icons/gc-logo-*.png).
export function Logo({ size = 40 }) {
  return <img src="./favicon.svg" width={size} height={size} alt="Gestion Chantiers" style={{ display: 'block' }} />;
}

/* ---------------------------------------------------------------- */
/* Design tokens                                                     */
/* ---------------------------------------------------------------- */

export const C = {
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  border: '#E6EAF0',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textMuted: '#64748B',
  brand: '#1D4ED8',
  brandDark: '#172554',
  brandTint: '#EFF6FF',
  green: '#047857',
  greenTint: '#ECFDF5',
  amber: '#B45309',
  amberTint: '#FFFBEB',
  red: '#B91C1C',
  redTint: '#FEF2F2',
};

/* ---------------------------------------------------------------- */
/* Small reusable UI bits                                            */
/* ---------------------------------------------------------------- */

export function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium mb-1" style={{ color: C.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

export const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.surface,
  fontSize: 14,
  color: C.text,
  outline: 'none',
};

export function TextInput(props) {
  // Montants : clavier numérique sur mobile et pas de valeurs négatives.
  const numberProps = props.type === 'number' ? { inputMode: 'numeric', min: 0 } : null;
  return <input {...numberProps} {...props} style={{ ...inputStyle, ...(props.style || {}) }} onFocus={(e) => { e.target.style.borderColor = C.brand; props.onFocus && props.onFocus(e); }} onBlur={(e) => { e.target.style.borderColor = C.border; props.onBlur && props.onBlur(e); }} />;
}
export function Select(props) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>;
}

export function StatusPill({ statut }) {
  const map = {
    'En cours': { bg: C.greenTint, fg: C.green },
    'Terminé': { bg: C.border, fg: C.textMuted },
    'En pause': { bg: C.amberTint, fg: C.amber },
  };
  const s = map[statut] || map['En cours'];
  return <span style={{ background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 999 }}>{statut}</span>;
}

export function PaiementPill({ statut }) {
  const map = {
    'Soldé': { bg: C.greenTint, fg: C.green },
    'Partiel': { bg: C.amberTint, fg: C.amber },
    'À régler': { bg: C.redTint, fg: C.red },
  };
  const s = map[statut];
  return <span style={{ background: s.bg, color: s.fg, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{statut}</span>;
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // empêche la page de défiler derrière la fenêtre
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(15,23,42,0.52)', backdropFilter: 'blur(5px)' }} onClick={onClose}>
      <div className="w-full sm:max-w-md overflow-y-auto gc-scroll" style={{ background: C.surface, borderRadius: '24px 24px 0 0', maxHeight: '92vh', boxShadow: '0 -20px 60px rgba(15,23,42,.18)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10" style={{ background: 'rgba(255,255,255,.96)', borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(10px)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: C.brand }}>GESTION CHANTIERS</p>
            <h3 className="gc-display text-xl mt-0.5">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: C.textMuted, background: C.surfaceSoft }}><X size={19} /></button>
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} className="shadow-sm" style={{ background: C.brand, color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 16px', borderRadius: 11, width: '100%', boxShadow: '0 8px 20px rgba(29,78,216,.18)', ...(props.style || {}) }}>
      {children}
    </button>
  );
}

export function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex p-1 gap-1 rounded-xl" style={{ background: C.surfaceSoft, border: `1px solid ${C.border}` }}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} className="flex-1 text-xs font-bold py-2.5 rounded-lg" style={{ border: 'none', background: value === o ? C.surface : 'transparent', color: value === o ? C.brand : C.textMuted, boxShadow: value === o ? '0 2px 7px rgba(15,23,42,.07)' : 'none' }}>{o}</button>
      ))}
    </div>
  );
}

export function EmptyState({ text, cta, onCta }) {
  return (
    <div className="text-center py-12 px-5 rounded-2xl" style={{ color: C.textMuted, background: C.surface, border: `1px dashed ${C.borderStrong}` }}>
      <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: C.brandTint, color: C.brand }}><Building2 size={22} /></div>
      <p className="text-sm leading-relaxed">{text}</p>
      {cta && <button onClick={onCta} className="mt-4 text-sm font-bold" style={{ color: C.brand }}>{cta}</button>}
    </div>
  );
}

export function BackBar({ title, onBack }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1.5 mb-4 -mx-1 px-1 py-1 text-sm font-bold" style={{ color: C.brand }}><ChevronLeft size={18} /> {title}</button>
  );
}

/* ---------------------------------------------------------------- */
/* Page framing                                                       */
/* ---------------------------------------------------------------- */

export function PageIntro({ eyebrow, title, subtitle, action, onAction }) {
  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="gc-section-label" style={{ color: C.brand }}>{eyebrow}</p>}
          <h1 className="gc-display text-[24px] leading-tight mt-1">{title}</h1>
          {subtitle && <p className="text-xs mt-1.5" style={{ color: C.textMuted }}>{subtitle}</p>}
        </div>
        {action && onAction && (
          <button onClick={onAction} className="shrink-0 flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl" style={{ color: C.brand, background: C.brandTint }}><Plus size={15} /> {action}</button>
        )}
      </div>
    </div>
  );
}
