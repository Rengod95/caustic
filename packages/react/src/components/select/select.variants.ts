import { cva } from 'class-variance-authority';

/** Option state on top of the menu item anatomy: Radix marks the chosen option with data-state="checked". */
export const selectOptionVariants = cva('data-[state=checked]:bg-accent-soft');
