// Typed view of packages/tokens/dist/tokens.mjs (the build output has no declarations).
declare module '@caustic/tokens/tokens' {
  type Rgba = { hex: string; alpha: number };
  type Role = [family: 'ui' | 'voice' | 'mono', size: number, lineHeight: number, weight: number, tracking: number, transform?: string];
  interface Tokens {
    meta: { name: string; version: string; prefix: string };
    hueSteps: number[];
    hues: Record<string, { name: string; hue: number; live?: boolean; role: string }>;
    neutral: { name: string; hue: number };
    themes: { light: Record<string, string>; dark: Record<string, string> };
    resolved: { light: Record<string, Rgba>; dark: Record<string, Rgba> };
    primitiveHex: Record<string, Record<string, string>>;
    space: Record<string, number>;
    inset: Record<string, [number, number]>;
    radius: Record<string, number>;
    size: Record<string, Record<string, number>>;
    type: Record<string, Role>;
    font: Record<'ui' | 'voice' | 'mono', string>;
    elevation: { light: Record<string, string>; dark: Record<string, string> };
    blur: Record<string, number>;
    motion: { duration: Record<string, number>; easing: Record<string, string>; spring: Record<string, { stiffness: number; damping: number }>; scale: Record<string, number>; shift: Record<string, number>; stagger: { step: number; max: number } };
    studio: Record<string, number>;
    z: Record<string, number>;
    breakpoint: Record<string, number>;
    contrastRules: [fg: string, bg: string, min: number, note: string][];
  }
  const tokens: Tokens;
  export default tokens;
}

declare module '@caustic/tokens/contrast' {
  interface ContrastResult { theme: 'light' | 'dark'; fg: string; bg: string; min: number; ratio: number; pass: boolean; note: string; sweep: boolean; worstHue: number | null }
  const contrast: { version: string; hueSweep: number[]; results: ContrastResult[] };
  export default contrast;
}
