import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts). The trigger is a PickerTrigger, which owns the look: tone, variant, radius, shadow
// and size are forwarded to it unchanged, so these axes add no class of their own (they mirror the PickerTrigger values
// and defaults: neutral, outline, xl, none, md). size also steps the gap between the trigger and the inline panel.
export const datePickerVariants = cva('grid gap-4', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'outline', radius: 'xl', shadow: 'none', size: 'md' },
});

/** The range length after the value (“· 7 days”, owner 2026-10-27 proposal C): tertiary, same type as the value. */
export const datePickerLengthVariants = cva('text-text-tertiary');
