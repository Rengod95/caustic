// Foundation policies as machine-checkable descriptions. The gateway implements each check;
// this table is the shared vocabulary for specs, reports and docs.
export const policies = {
  P1: { title: 'Glass only for what floats', rule: 'glass*, glass-* utilities and material backdrop blur appear only in components with flags.floating. The light control frost (frost utility) is allowed everywhere.' },
  P2: { title: 'Light means agent', rule: 'agent-rim, agent-glow, orb*, shimmer, spectrum-* appear only in components (or variant values) listed in flags.agent.' },
  P3: { title: 'Ink first, accent once', rule: 'Buttons are flat: no gradient fills, no inset highlights. An example renders at most one tone="accent" button.' },
  P4: { title: 'Two voices', rule: 'font-voice only on agent prose slots; text-voice*/text-thought require font-voice; text-mono* require font-mono.' },
  P5: { title: 'Concentric corners', rule: 'A slot radius never exceeds its parent radius minus the parent padding (2px tolerance).' },
  P6: { title: 'Contrast is a build gate', rule: 'Foundation contrast rules pass; component sources contain no literal colors; rendered text meets its threshold.' },
  P7: { title: 'Human vs agent on canvas', rule: 'Canvas selection slots use canvas.selection; agent work areas use agent-rim.' },
  P8: { title: 'Motion has a job', rule: 'Durations and easings come from tokens; infinite animations only with flags.motionLoop or flags.agent; reduced motion stops all animation.' },
  P9: { title: 'A field owns its focus', rule: 'Field components show exactly one focus edge (focus-field on the container); inner inputs draw no outline or ring.' },
} as const;
export type PolicyId = keyof typeof policies;
