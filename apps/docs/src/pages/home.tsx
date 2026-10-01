import { Badge, CardBody, CardDescription, CardEyebrow, CardHeader, CardHeading, CardStat, CardSurface, CardTitle, SectionHeader } from '@caustic/react';
import { componentGroups, componentIds, foundationPages, gatedCount, policies } from '../data.ts';
import { hrefFor } from '../router.ts';
import { Page, PageHeader, Section } from '../ui.tsx';

const grid = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] gap-3.5';

export function Home() {
  return (
    <Page>
      <PageHeader
        eyebrow={<Badge tone="agent">Agent-first</Badge>}
        title="Caustic"
        lead="A design system for builders where the agent works next to you. Glass floats, light means agent, ink comes first and the accent appears once. Every component here is spec-first: a contract, a gate and a live specimen."
      />

      <div className={grid}>
        <CardStat label="Components" value={String(componentIds.length)} />
        <CardStat label="Gated" value={String(gatedCount)} unit={`of ${componentIds.length}`} />
        <CardStat label="Principles" value={String(Object.keys(policies).length)} />
        <CardStat label="Foundation pages" value={String(foundationPages.length)} />
      </div>

      <Section id="what" title="What it is" description="Three layers, each with one job.">
        <div className={grid}>
          <CardSurface>
            <CardHeader><CardHeading><CardEyebrow>Tokens</CardEyebrow><CardTitle>One source of values</CardTitle></CardHeading></CardHeader>
            <CardBody><CardDescription>Color ramps, semantic roles per theme, type, space, radius, elevation and motion are generated once and read as Tailwind utilities. Components never use literal colors.</CardDescription></CardBody>
          </CardSurface>
          <CardSurface>
            <CardHeader><CardHeading><CardEyebrow>Specs</CardEyebrow><CardTitle>Contracts as data</CardTitle></CardHeading></CardHeader>
            <CardBody><CardDescription>Each component has a zod spec: slots, variants, props, states, expected styles, keyboard map and scenarios. The docs on every page below are generated from it.</CardDescription></CardBody>
          </CardSurface>
          <CardSurface>
            <CardHeader><CardHeading><CardEyebrow>Gateway</CardEyebrow><CardTitle>A gate before approval</CardTitle></CardHeading></CardHeader>
            <CardBody><CardDescription>Rendered styles, behavior, accessibility and the approved specimens are checked in Chromium. A passing component is locked by its spec hash.</CardDescription></CardBody>
          </CardSurface>
        </div>
      </Section>

      <Section id="principles" title="Principles" description="Nine policies the gateway enforces. Components cite the ones that apply to them.">
        <div className={grid}>
          {Object.entries(policies).map(([id, p]) => (
            <CardSurface key={id} size="compact">
              <CardHeader headerAlign="center"><Badge tone="accent" shape="square">{id}</Badge><CardTitle titleSize="sm">{p.title}</CardTitle></CardHeader>
              <CardBody><CardDescription>{p.rule}</CardDescription></CardBody>
            </CardSurface>
          ))}
        </div>
      </Section>

      <Section id="browse" title="Browse" description="Components grouped like the specimen site.">
        <div className={grid}>
          <CardSurface size="compact">
            <SectionHeader size="sm" title="Foundation" description={`${foundationPages.length} pages`} />
            <CardBody>
              <ul className="m-0 grid list-none gap-0.5 p-0">
                {foundationPages.map(p => <li key={p.slug}><a href={hrefFor.foundation(p.slug)} className="font-ui text-ui text-text-secondary hover:text-text-primary">{p.title}</a></li>)}
              </ul>
            </CardBody>
          </CardSurface>
          {componentGroups.map(g => (
            <CardSurface key={g.title} size="compact">
              <SectionHeader size="sm" title={g.title} description={`${g.items.length} components`} />
              <CardBody>
                <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-0.5 p-0">
                  {g.items.slice(0, 12).map(s => <li key={s.id}><a href={hrefFor.component(s.id)} className="font-ui text-ui text-text-secondary hover:text-text-primary">{s.name}</a></li>)}
                  {g.items.length > 12 ? <li className="font-ui text-ui text-text-tertiary">+{g.items.length - 12} more</li> : null}
                </ul>
              </CardBody>
            </CardSurface>
          ))}
        </div>
      </Section>
    </Page>
  );
}
