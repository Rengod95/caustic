import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Badge, SectionHeader } from '@caustic/react';

/** Catches a failing live example so one broken specimen never blanks the page. */
export class Boundary extends Component<{ label: string; children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  override componentDidCatch(error: Error, info: ErrorInfo) { console.error(`[docs] ${this.props.label} failed to render:`, error.message, info.componentStack?.split('\n')[1] ?? ''); }
  override render() {
    if (this.state.error) {
      return (
        <div role="alert" className="rounded-lg bg-danger-soft p-3 font-mono text-mono text-danger-text">
          {this.props.label} failed to render: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function Page({ children }: { children: ReactNode }) {
  return <article className="mx-auto grid w-full min-w-0 max-w-[60rem] grid-cols-[minmax(0,1fr)] content-start gap-10 px-4 py-8 min-[900px]:px-10 min-[900px]:py-10">{children}</article>;
}

export function PageHeader({ eyebrow, title, lead, badges }: { eyebrow?: ReactNode; title: string; lead?: ReactNode; badges?: ReactNode }) {
  return (
    <header className="grid gap-3">
      {eyebrow ? <div className="flex flex-wrap items-center gap-1.5 text-ui-sm text-text-tertiary">{eyebrow}</div> : null}
      <h1 className="m-0 font-ui text-display text-text-primary text-balance max-[899px]:text-title-1">{title}</h1>
      {lead ? <p className="m-0 max-w-[66ch] font-ui text-body text-text-secondary">{lead}</p> : null}
      {badges ? <div className="flex flex-wrap items-center gap-1.5">{badges}</div> : null}
    </header>
  );
}

export function Section({ id, title, description, children }: { id?: string; title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} data-section={id} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
      <SectionHeader size="md" title={title} description={description} divided />
      {children}
    </section>
  );
}

/** A framed live specimen: title bar over a dot-grid canvas. */
export function Specimen({ title, meta, children, flush = false }: { title: string; meta?: ReactNode; children: ReactNode; flush?: boolean }) {
  return (
    <figure className="m-0 min-w-0 overflow-hidden rounded-3xl bg-surface-base shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-2)]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border-subtle bg-material-thin px-3.5 py-2">
        <span className="font-ui text-ui-strong text-text-primary">{title}</span>
        {meta ? <span className="font-mono text-mono-sm text-text-tertiary">{meta}</span> : null}
      </figcaption>
      <div className={flush ? 'relative min-w-0 overflow-x-auto' : 'canvas-grid relative grid min-w-0 content-start gap-3.5 overflow-x-auto px-4 py-6 min-[900px]:px-6'}>{children}</div>
    </figure>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="font-mono text-mono text-text-primary">{children}</code>;
}

export function Chip({ children }: { children: ReactNode }) {
  return <Badge shape="square" className="font-mono">{children}</Badge>;
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="m-0 grid list-none gap-2 p-0">
      {items.map((t, i) => (
        <li key={i} className="relative max-w-[70ch] pl-4 font-ui text-ui-md-relaxed text-text-secondary before:absolute before:left-1 before:top-2 before:size-1.25 before:rounded-full before:bg-text-tertiary">{t}</li>
      ))}
    </ul>
  );
}
