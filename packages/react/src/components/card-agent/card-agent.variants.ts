import { cva } from 'class-variance-authority';

/** Unapplied agent output: opaque surface, a 1.5px spectrum rim (agent-rim) and a soft agent glow below. */
export const cardAgentVariants = cva('agent-rim bg-surface-base shadow-agent');

/** 14px spectrum orb that stands in for a tile in the header. */
export const cardAgentOrbVariants = cva('orb');
