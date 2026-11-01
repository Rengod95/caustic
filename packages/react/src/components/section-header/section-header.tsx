'use client';
import { ChevronRight } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { sectionHeaderDescription, sectionHeaderEyebrow, sectionHeaderTitle, sectionHeaderVariants } from './section-header.variants.ts';

export interface SectionHeaderProps extends Omit<ComponentProps<'div'>, 'title'>, CommonProps {
  title: ReactNode;
  /** Heading element level, independent of size. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Kicker above the title. */
  eyebrow?: ReactNode;
  /** Eyebrow colour: muted follows the tone (text.tertiary when neutral, default); accent takes accent.text. */
  eyebrowStyle?: 'muted' | 'accent';
  /** One sentence. */
  description?: ReactNode;
  /** One action on the right: a Button, a SegmentedControl, a Badge or a SectionHeaderLink. */
  action?: ReactNode;
  /** Bottom hairline with 12px padding below. */
  divided?: boolean;
}

/** Title, one-sentence description and one action that open a page, section or grouped list. */
export function SectionHeader({ size, tone, variant, radius, shadow, title, headingLevel = 2, eyebrow, eyebrowStyle = 'muted', description, action, divided = false, className, ...props }: SectionHeaderProps) {
  const Heading = `h${headingLevel}` as 'h2';
  return (
    <div data-slot="section-header" data-size={size ?? 'md'} data-divided={divided || undefined} className={cn(sectionHeaderVariants({ divided, tone, variant, radius: radius ?? null, shadow: shadow ?? null }), className)} {...props}>
      <div data-slot="section-header-text" className="grid min-w-section-text-min flex-1 gap-0.75">
        {eyebrow != null && <span data-slot="section-header-eyebrow" className={sectionHeaderEyebrow({ tone: eyebrowStyle === 'accent' ? 'accent' : tone, eyebrowStyle })}>{eyebrow}</span>}
        <Heading data-slot="section-header-title" className={sectionHeaderTitle({ size })}>{title}</Heading>
        {description != null && <span data-slot="section-header-description" className={sectionHeaderDescription({ size })}>{description}</span>}
      </div>
      {action != null && <div data-slot="section-header-action" className="flex flex-none items-center">{action}</div>}
    </div>
  );
}

export interface SectionHeaderLinkProps extends ComponentProps<'a'> {
  /** Trailing chevron. */
  chevron?: boolean;
}

/** Text link (text.link) for the SectionHeader action. */
export function SectionHeaderLink({ chevron = true, className, children, ...props }: SectionHeaderLinkProps) {
  return (
    <a
      data-slot="section-header-link"
      className={cn('inline-flex items-center gap-0.5 whitespace-nowrap font-ui text-ui-dense font-medium text-text-link no-underline underline-offset-2 outline-none hover:underline focus-visible:shadow-focus', className)}
      {...props}
    >
      {children}
      {chevron && <ChevronRight data-slot="section-header-link-chevron" className="size-icon-sm" aria-hidden />}
    </a>
  );
}
