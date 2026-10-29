import { cva } from 'class-variance-authority';

/** The scan band (::before). Always mounted; scanning only sets its opacity, so it fades on and off. */
export const agentWorkAreaScanClass = 'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,transparent,var(--cs-color-agent-glow)_50%,transparent)] before:bg-size-[100%_200%] before:animate-scan before:transition-opacity before:duration-base before:ease-out';

/**
 * The agent counterpart of CanvasSelection: a spectrum rim 3px outside the object (agent-rim, widened to 2px and moved out)
 * and, while scanning, a soft agent.glow band that slides down the object. The band slides with animate-scan and fades on and off.
 *
 * Five common props (lib/common-props.ts); each axis' default is the own look and adds no class:
 *   variant  the rim: outline = 2px (own), solid = 3px, soft = 1px, ghost = no rim (the scan alone)
 *   tone     the scan band colour: agent = agent.glow (own); another tone uses its tint. The rim stays the spectrum (P7).
 *   radius   the object radius by token; the rim follows concentric at radius + 3px
 *   shadow   elevation of the marked box
 *   size     the scan band: xs thin … lg wide (md = the own 200% sweep)
 */
export const agentWorkAreaVariants = cva(
  // The rect glides like agent-cursor (the same spring); the size moves with it so the box never changes size ahead of its place.
  ['agent-rim pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-10 h-(--rect-h) w-(--rect-w) rounded-2xl transition-[top,right,bottom,left,width,height] duration-spring ease-spring after:-inset-0.75 after:rounded-(--rim-r) after:p-0.5', agentWorkAreaScanClass],
  {
    variants: {
      // The scan band (::before) is always mounted and fades: muted while scanning, transparent when idle. It sits before tone so a tone replaces its colour.
      scanning: {
        true: 'before:opacity-(--cs-opacity-muted)',
        false: 'before:opacity-0',
      },
      variant: { solid: 'after:p-0.75', soft: 'after:p-px', outline: '', ghost: 'after:hidden' },
      tone: {
        neutral: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-neutral-tint)_50%,transparent)]',
        accent: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-accent-tint)_50%,transparent)]',
        success: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-success-tint)_50%,transparent)]',
        warning: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-warning-tint)_50%,transparent)]',
        danger: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-danger-tint)_50%,transparent)]',
        info: 'before:bg-[linear-gradient(180deg,transparent,var(--cs-color-info-tint)_50%,transparent)]',
        agent: '',
      },
      radius: {
        none: 'rounded-none after:rounded-[calc(var(--cs-radius-none)+var(--cs-space-0_75))]',
        '2xs': 'rounded-2xs after:rounded-[calc(var(--cs-radius-2xs)+var(--cs-space-0_75))]',
        xs: 'rounded-xs after:rounded-[calc(var(--cs-radius-xs)+var(--cs-space-0_75))]',
        sm: 'rounded-sm after:rounded-[calc(var(--cs-radius-sm)+var(--cs-space-0_75))]',
        md: 'rounded-md after:rounded-[calc(var(--cs-radius-md)+var(--cs-space-0_75))]',
        lg: 'rounded-lg after:rounded-[calc(var(--cs-radius-lg)+var(--cs-space-0_75))]',
        xl: 'rounded-xl after:rounded-[calc(var(--cs-radius-xl)+var(--cs-space-0_75))]',
        '2xl': '',
        '3xl': 'rounded-3xl after:rounded-[calc(var(--cs-radius-3xl)+var(--cs-space-0_75))]',
        '4xl': 'rounded-4xl after:rounded-[calc(var(--cs-radius-4xl)+var(--cs-space-0_75))]',
        full: 'rounded-full after:rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'before:bg-size-[100%_400%]', sm: 'before:bg-size-[100%_300%]', md: '', lg: 'before:bg-size-[100%_150%]' },
    },
    defaultVariants: { scanning: true, variant: 'outline', tone: 'agent', radius: '2xl', shadow: 'none', size: 'md' },
  },
);
