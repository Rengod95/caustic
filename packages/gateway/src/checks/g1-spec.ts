// G1 · Spec validity: schema, token references, approval lock, fixture and specimen links.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ComponentSpec, rawSpecs, type SpecInput } from '@caustic/spec';
import { readLocks, specHash } from '../../../spec/src/approve.ts';
import { Collector } from '../report.ts';
import { specimenRoot } from '../paths.ts';
import { dimPx, tokenIndex } from '../tokens.ts';
import type { Fixture } from '../../../react/src/lib/fixture.ts';

export async function g1(c: Collector, input: SpecInput, fixture: Fixture | undefined): Promise<ComponentSpec | null> {
  const parsed = ComponentSpec.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) c.fail({ gate: 'G1', check: 'schema', message: issue.message, where: issue.path.join('.') });
    return null;
  }
  const spec = parsed.data;
  // Approval lock: the spec must be exactly what was approved.
  const lock = readLocks()[spec.id];
  const hash = specHash(rawSpecs[spec.id]);
  if (!lock) c.fail({ gate: 'G1', check: 'approval', message: 'Spec has never been approved.', fix: 'A person reviews the spec and runs `pnpm spec:approve ' + spec.id + '`. Implementers must not.' });
  else if (lock !== hash) c.fail({ gate: 'G1', check: 'approval', message: 'Spec changed since approval. Specs cannot be edited to make an implementation pass.', expected: lock, actual: hash, fix: 'Revert the spec, or get the change approved separately.' });

  const t = await tokenIndex();
  const slots = new Set(spec.slots.map(s => s.name));
  if (!slots.has('root')) c.fail({ gate: 'G1', check: 'anatomy', message: 'Spec has no "root" slot.' });
  for (const s of spec.slots) if (s.parent && !slots.has(s.parent)) c.fail({ gate: 'G1', check: 'anatomy', message: `Slot "${s.name}" has unknown parent "${s.parent}".` });
  for (const [axis, v] of Object.entries(spec.variants)) if (!v.values.includes(v.default)) c.fail({ gate: 'G1', check: 'variants', message: `Variant ${axis} default "${v.default}" is not one of its values.` });
  if (spec.sizes && !spec.sizes.values.includes(spec.sizes.default)) c.fail({ gate: 'G1', check: 'sizes', message: `Default size "${spec.sizes.default}" is not a size.` });

  const axes = new Set([...Object.keys(spec.variants), 'size', 'state', ...Object.keys(spec.props)]);
  spec.styles.forEach((rule, i) => {
    const where = `styles[${i}] slot=${rule.slot}`;
    if (!slots.has(rule.slot)) c.fail({ gate: 'G1', check: 'styles', where, message: `Unknown slot "${rule.slot}".` });
    for (const [k, v] of Object.entries(rule.when ?? {})) {
      if (!axes.has(k)) c.fail({ gate: 'G1', check: 'styles', where, message: `when.${k} is not a variant axis, size, state or prop.` });
      if (k === 'state' && v !== 'rest' && !(v as string in spec.states)) c.fail({ gate: 'G1', check: 'styles', where, message: `State "${v}" is used but not defined in states.` });
      if (k === 'size' && spec.sizes && !spec.sizes.values.includes(String(v))) c.fail({ gate: 'G1', check: 'styles', where, message: `Unknown size "${v}".` });
      if (spec.variants[k] && !spec.variants[k]!.values.includes(String(v))) c.fail({ gate: 'G1', check: 'styles', where, message: `Unknown ${k} value "${v}".` });
    }
    const e = rule.expect;
    for (const key of ['bg', 'fg', 'border', 'edge'] as const) {
      const v = e[key]; if (v && v !== 'transparent' && !t.colors.has(v)) c.fail({ gate: 'G1', check: 'token-ref', where, message: `${key}: "${v}" is not a semantic color token.` });
    }
    if (e.radius && !(e.radius in t.radius)) c.fail({ gate: 'G1', check: 'token-ref', where, message: `radius: "${e.radius}" is not a radius token.` });
    for (const key of ['height', 'minHeight', 'width'] as const) { const v = e[key]; if (v && dimPx(t, v) === null) c.fail({ gate: 'G1', check: 'token-ref', where, message: `${key}: "${v}" is not a size token or number.` }); }
    for (const key of ['padX', 'padY'] as const) { const v = e[key]; if (typeof v === 'string' && dimPx(t, v) === null) c.fail({ gate: 'G1', check: 'token-ref', where, message: `${key}: "${v}" is not an inset token.` }); }
    for (const key of ['padX', 'padY', 'gap'] as const) { const v = e[key]; if (typeof v === 'number' && !t.allow.spacingSteps.map(s => s * 4).includes(v)) c.warn({ gate: 'G1', check: 'token-ref', where, message: `${key} ${v}px is off the space scale.` }); }
    // Forced focus lands on the state's target (root by default); a ring measured on another slot can never appear.
    const state = typeof rule.when?.state === 'string' ? spec.states[rule.when.state] : undefined;
    if (state?.pseudo?.some(p => p.startsWith('focus')) && e.ring && e.ring !== 'none' && rule.slot !== (state.target ?? 'root'))
      c.fail({ gate: 'G1', check: 'state-target', where, message: `State "${rule.when!.state}" forces focus on "${state.target ?? 'root'}" but the ring is measured on "${rule.slot}".`, fix: `Give the state target: '${rule.slot}' (or a separate state for it).` });
    if (e.text && !(e.text in t.type)) c.fail({ gate: 'G1', check: 'token-ref', where, message: `text: "${e.text}" is not a type role.` });
    if (e.shadow && !t.elevation.includes(e.shadow)) c.fail({ gate: 'G1', check: 'token-ref', where, message: `shadow: "${e.shadow}" is not an elevation level.` });
  });

  // Fixture and examples
  if (!fixture) c.fail({ gate: 'G1', check: 'fixture', message: `No fixture registered for "${spec.id}".`, fix: `Add components/${spec.id}/${spec.id}.fixture.tsx and register it in src/fixtures.ts.` });
  for (const ex of spec.examples) {
    if (fixture && !fixture.examples[ex.id]) c.fail({ gate: 'G1', check: 'fixture', message: `Fixture has no example "${ex.id}".`, fix: `Implement examples.${ex.id} reproducing ${ex.doc}.` });
    const [page, heading] = ex.doc.split('#');
    const file = join(specimenRoot, 'docs', `${page}.html`);
    if (!existsSync(file)) c.fail({ gate: 'G1', check: 'specimen', message: `Specimen page docs/${page}.html not found.` });
    else if (heading && !readFileSync(file, 'utf8').includes(`id="${heading}"`)) c.fail({ gate: 'G1', check: 'specimen', message: `Specimen heading #${heading} not found in docs/${page}.html.` });
  }
  return spec;
}
