// Emphasis × tone matrix of the proposed colour language, drawn straight from the --lang-* slot variables
// (components do not have the new slots yet). Each recipe below is the table in PROPOSAL-color-language.md.
import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';
import type { Theme } from '../palettes.ts';
import { LANG_TONES, type LangTone } from './language.ts';

export type Emphasis = 'solid' | 'soft' | 'outline' | 'subtle' | 'text';
export type State = 'rest' | 'hover' | 'pressed' | 'selected' | 'focus' | 'disabled';
const EMPHASES: Emphasis[] = ['solid', 'soft', 'outline', 'subtle', 'text'];
const STATES: State[] = ['rest', 'hover', 'pressed', 'selected', 'focus', 'disabled'];

/** Steps per emphasis and state. bg/border are ramp steps of the tone; 'on' is the label colour on a solid. */
interface Look { bg?: number; fg: number | 'on'; border?: number; borderW?: number }
export const RECIPES: Record<Emphasis, { note: string; rest: Look; hover: Look; pressed: Look; selected: Look }> = {
  solid: {
    note: 'bg 9 → 10 · label on · pressed adds edge 11 · selected 10 + mark',
    rest: { bg: 9, fg: 'on' }, hover: { bg: 10, fg: 'on' }, pressed: { bg: 10, fg: 'on', border: 11 }, selected: { bg: 10, fg: 'on' },
  },
  soft: {
    note: 'bg 3 → 4 → 5 · text 11 · selected 5 + edge 7 + mark',
    rest: { bg: 3, fg: 11 }, hover: { bg: 4, fg: 11 }, pressed: { bg: 5, fg: 11 }, selected: { bg: 5, fg: 11, border: 7 },
  },
  outline: {
    note: 'edge 6 → 7 · bg none → 2 → 3 · text 11 · selected edge 8 (1.5px) + mark',
    rest: { fg: 11, border: 6 }, hover: { bg: 2, fg: 11, border: 7 }, pressed: { bg: 3, fg: 11, border: 7 }, selected: { bg: 3, fg: 11, border: 8, borderW: 1.5 },
  },
  subtle: {
    note: 'bg 2 → 3 → 4 · edge 6 → 7 · text 11 (alerts, banners, invalid fields)',
    rest: { bg: 2, fg: 11, border: 6 }, hover: { bg: 3, fg: 11, border: 6 }, pressed: { bg: 4, fg: 11, border: 7 }, selected: { bg: 4, fg: 11, border: 7 },
  },
  text: {
    note: 'text 11 · bg none → 2 → 3 · selected 3 + mark (links, inline status, ghost)',
    rest: { fg: 11 }, hover: { bg: 2, fg: 11 }, pressed: { bg: 3, fg: 11 }, selected: { bg: 3, fg: 11 },
  },
};

const v = (k: LangTone, n: number | 'on') => `var(--lang-${k}-${n})`;

function styleFor(k: LangTone, e: Emphasis, s: State, theme: Theme): CSSProperties {
  if (s === 'disabled') {
    // disabled is a colour, not opacity: neutral fill and neutral step 6 text, the tone drops out
    const fill = theme === 'light' ? 3 : 4;
    const filled = e === 'solid' || e === 'soft' || e === 'subtle';
    return {
      background: filled ? v('neutral', fill) : 'transparent',
      color: v('neutral', 6),
      boxShadow: e === 'outline' || e === 'subtle' ? `inset 0 0 0 1px ${v('neutral', theme === 'light' ? 4 : 5)}` : undefined,
    };
  }
  const look = RECIPES[e][s === 'focus' ? 'rest' : s];
  const shadows: string[] = [];
  if (look.border) shadows.push(`inset 0 0 0 ${look.borderW ?? 1}px ${v(k, look.border)}`);
  if (s === 'focus') shadows.push('0 0 0 2px var(--cs-color-surface-base)', '0 0 0 4px var(--cs-color-focus-ring)');
  let background = look.bg ? v(k, look.bg) : 'transparent';
  // decision 2: neutral interaction stays alpha, layered over the rest fill, so it reads on any background
  if (k === 'neutral' && e !== 'solid' && NEUTRAL_FILL[s]) {
    const rest = RECIPES[e].rest.bg;
    background = `linear-gradient(${NEUTRAL_FILL[s]}, ${NEUTRAL_FILL[s]}), ${rest ? v(k, rest) : 'transparent'}`;
  }
  return { background, color: v(k, look.fg), boxShadow: shadows.length ? shadows.join(', ') : undefined };
}

/** Decision 2 (2026-10-25): neutral hover, pressed and selected are the alpha fills, not ramp steps. */
const NEUTRAL_FILL: Partial<Record<State, string>> = {
  hover: 'var(--cs-color-fill-hover)', pressed: 'var(--cs-color-fill-pressed)', selected: 'var(--cs-color-fill-selected)',
};

const NAME: Record<LangTone, string> = { accent: 'Accent', neutral: 'Neutral', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info', agent: 'Agent' };

function Cell({ k, e, s, theme }: { k: LangTone; e: Emphasis; s: State; theme: Theme }) {
  return (
    <span
      className="inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-md px-2.5 font-ui text-ui-sm"
      style={styleFor(k, e, s, theme)}
      aria-label={`${NAME[k]} ${e} ${s}`}
    >
      {s === 'selected' && <Check aria-hidden className="size-icon-sm" />}
      {NAME[k]}
    </span>
  );
}

/** Every tone × emphasis in rest, hover, pressed, selected, focus and disabled. */
export function EmphasisMatrix({ theme }: { theme: Theme }) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5">
        <span className="font-ui text-ui-strong text-text-primary">Ramps per tone ({theme}) · step 9 is the picked solid</span>
        <div className="grid gap-1">
          {LANG_TONES.map(k => (
            <div key={k} className="grid grid-cols-[5rem_1fr] items-center gap-2">
              <span className="text-ui-sm text-text-secondary">{NAME[k]}</span>
              <div className="grid grid-cols-11 overflow-hidden rounded-sm shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]">
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i} className="grid h-6 place-items-center font-mono text-mono-micro" style={{ background: v(k, i + 1), color: i < 6 ? v(k, 11) : v(k, 'on') }}>{i + 1}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {EMPHASES.map(e => (
        <div key={e} className="grid gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-ui text-ui-strong capitalize text-text-primary">{e}</span>
            <span className="font-mono text-mono-sm text-text-tertiary">{RECIPES[e].note}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-x-2 border-spacing-y-1.5">
              <thead>
                <tr>{['', ...STATES].map(s => <th key={s} scope="col" className="text-left text-footnote font-normal text-text-tertiary">{s}</th>)}</tr>
              </thead>
              <tbody>
                {LANG_TONES.map(k => (
                  <tr key={k}>
                    <th scope="row" className="pr-2 text-left text-ui-sm font-normal text-text-secondary">{NAME[k]}</th>
                    {STATES.map(s => <td key={s}><Cell k={k} e={e} s={s} theme={theme} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <ListSelection />
      <p className="m-0 text-footnote text-text-tertiary">
        Neutral hover, pressed and selected stay alpha fills over whatever sits below (decision 2); hued soft is opaque.
        Hover and pressed stay inside their emphasis: a soft control never turns solid on hover. Selected adds a mark and an edge, never the focus ring;
        focus is the same outer ring on every cell. Disabled is a neutral colour (fill 3/4, text 6), not opacity, so a disabled tone reads as off, not faded.
      </p>
    </div>
  );
}

/** Decision 3 (2026-10-25): list and menu selection is neutral: fill-selected, a check mark and a neutral edge 7. */
function ListSelection() {
  const rows: { name: string; state: 'rest' | 'hover' | 'selected' | 'selected-hover' }[] = [
    { name: 'Frame / Header', state: 'rest' }, { name: 'Frame / Hero', state: 'hover' },
    { name: 'Button / Primary', state: 'selected' }, { name: 'Button / Ghost', state: 'selected-hover' },
  ];
  const bgOf = (st: string) => {
    if (st === 'hover') return 'var(--cs-color-fill-hover)';
    if (st === 'selected') return 'var(--cs-color-fill-selected)';
    if (st === 'selected-hover') return 'linear-gradient(var(--cs-color-fill-hover), var(--cs-color-fill-hover)), var(--cs-color-fill-selected)';
    return 'transparent';
  };
  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-ui text-ui-strong text-text-primary">List and menu selection</span>
        <span className="font-mono text-mono-sm text-text-tertiary">fill-selected · mark · edge neutral 7 · selected + hover adds fill-hover</span>
      </div>
      <div className="grid max-w-[24rem] gap-0.5 rounded-lg bg-surface-raised p-1 shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]">
        {rows.map(r => {
          const sel = r.state.startsWith('selected');
          return (
            <span key={r.name} className="flex h-7 items-center gap-2 rounded-md px-2 font-ui text-ui-sm text-text-primary"
              style={{ background: bgOf(r.state), boxShadow: sel ? `inset 0 0 0 1px ${v('neutral', 7)}` : undefined }}>
              <span className="grid size-icon-sm place-items-center">{sel && <Check aria-hidden className="size-icon-sm" />}</span>
              {r.name}
              <span className="ml-auto font-mono text-mono-micro text-text-tertiary">{r.state}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
