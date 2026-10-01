import { cva } from 'class-variance-authority';

/**
 * The agent counterpart of CanvasSelection: a spectrum rim 3px outside the object (agent-rim, widened to 2px and moved out)
 * and, while scanning, a soft agent.glow band that slides down the object. The band slides with animate-scan.
 */
export const agentWorkAreaVariants = cva('agent-rim pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-10 h-(--rect-h) w-(--rect-w) rounded-2xl after:-inset-0.75 after:rounded-(--rim-r) after:p-0.5');

/** The scan band (::before). Added while scanning. */
export const agentWorkAreaScanClass = 'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,transparent,var(--cs-color-agent-glow)_50%,transparent)] before:bg-size-[100%_200%] before:animate-scan before:opacity-muted';
