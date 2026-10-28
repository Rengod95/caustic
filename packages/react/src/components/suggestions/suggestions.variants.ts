import { cva, type VariantProps } from 'class-variance-authority';

export const suggestionsVariants = cva('grid grid-cols-[repeat(auto-fit,minmax(var(--cs-size-suggestion-min),1fr))] gap-2');

// The five common props are set on Suggestions and reach every card (a card may override them).
// variant: glass = thin floating glass (the specimen); solid = tone.solid card with tone.on text; soft = tone.soft card;
// outline = transparent card with a tone.border hairline; ghost = no fill until hover. tone colours the icon on glass, soft
// and outline, and the whole card on solid. shadow drives the glass elevation (glass-shadow) and the plain shadow alike.
export const suggestionVariants = cva(
  [
    'grid min-w-0 cursor-pointer gap-1 rounded-toolbar px-3 py-2.5 text-left text-ui-dense text-text-primary',
    'outline-none transition-transform duration-base ease-spring hover:-translate-y-0.5 focus-visible:shadow-focus',
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  ],
  {
    variants: {
      variant: {
        glass: 'glass glass-thin',
        solid: 'bg-(--tone-solid) text-(--tone-on) hover:bg-(--tone-solid-hover) [&_[data-slot=suggestions-icon]]:text-(--tone-on) [&_[data-slot=suggestions-hint]]:text-(--tone-on)',
        soft: 'bg-(--tone-soft) [&_[data-slot=suggestions-icon]]:text-(--tone-text)',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--tone-border)] [&_[data-slot=suggestions-icon]]:text-(--tone-text)',
        ghost: 'bg-transparent hover:bg-neutral-hover',
      },
      tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-solid-hover:var(--cs-color-neutral-solid-hover)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-border:var(--cs-color-neutral-border)] [--tone-text:var(--cs-color-neutral-text)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-solid-hover:var(--cs-color-accent-solid-hover)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-border:var(--cs-color-accent-border)] [--tone-text:var(--cs-color-accent-text)]',
      success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-solid-hover:var(--cs-color-success-solid-hover)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-border:var(--cs-color-success-border)] [--tone-text:var(--cs-color-success-text)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-solid-hover:var(--cs-color-warning-solid-hover)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-border:var(--cs-color-warning-border)] [--tone-text:var(--cs-color-warning-text)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-solid-hover:var(--cs-color-danger-solid-hover)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-border:var(--cs-color-danger-border)] [--tone-text:var(--cs-color-danger-text)]',
      info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-solid-hover:var(--cs-color-info-solid-hover)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-border:var(--cs-color-info-border)] [--tone-text:var(--cs-color-info-text)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-solid-hover:var(--cs-color-agent-solid-hover)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-border:var(--cs-color-agent-border)] [--tone-text:var(--cs-color-agent-text)]',
      },
      size: {
        xs: 'gap-0.5 px-2 py-1.5 text-ui-sm',
        sm: 'px-2.5 py-2 text-ui-sm',
        md: '',
        lg: 'gap-1.5 px-4 py-3 text-ui',
      },
      // The card keeps its own toolbar corner (14px) at the default key; every other key sets that radius token.
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      // Glass reads its elevation from --cs-shadow (glass-shadow-N); the plain variants from shadow-N.
      shadow: {
        none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5',
      },
    },
    compoundVariants: [
      { variant: 'glass', tone: ['accent', 'success', 'warning', 'danger', 'info', 'agent'], className: '[&_[data-slot=suggestions-icon]]:text-(--tone-text)' },
    ],
    defaultVariants: { variant: 'glass', tone: 'neutral', size: 'md', radius: 'xl', shadow: '1' },
  },
);

export type SuggestionVariantProps = VariantProps<typeof suggestionVariants>;
