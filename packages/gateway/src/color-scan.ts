// Static scan of the colour language rules over every component, without a browser or the gate.
// Prints the hit count per rule and the components with the most hits.
// Usage: tsx packages/gateway/src/color-scan.ts [--json] [--rule=CL3] [--verbose]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkComponent, componentSources, isBlocking, loadColorConfig, RULES, slotContrast, type RuleHit, type RuleId } from './checks/color-language.ts';
import { componentsDir, tokensDist } from './paths.ts';

const args = process.argv.slice(2);
const only = args.find(a => a.startsWith('--rule='))?.split('=')[1]?.toUpperCase().split(',') ?? null;
const cfg = loadColorConfig();
const ids = readdirSync(componentsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort();
const per: Record<string, RuleHit[]> = {};
for (const id of ids) per[id] = checkComponent(id, componentSources(id), cfg).filter(h => !only || only.includes(h.rule));
const cl7 = slotContrast(readFileSync(join(tokensDist, 'caustic.css'), 'utf8'));

const rules = Object.keys(RULES) as RuleId[];
const summary = rules.map(r => {
  const comps = ids.filter(id => per[id]!.some(h => h.rule === r));
  const hits = r === 'CL7' ? cl7.hits.length : ids.reduce((n, id) => n + per[id]!.filter(h => h.rule === r).length, 0);
  const blocking = r === 'CL7' ? cl7.hits.filter(h => h.expected !== undefined && cfg.contrastBlocking).length : ids.reduce((n, id) => n + per[id]!.filter(h => h.rule === r && isBlocking(cfg, r, id)).length, 0);
  return { rule: RULES[r], hits, blocking, components: r === 'CL7' ? null : comps.length };
});

if (args.includes('--json')) console.log(JSON.stringify({ summary, cl7Checked: cl7.checked, perComponent: Object.fromEntries(ids.map(id => [id, per[id]!.length])) }, null, 2));
else {
  for (const s of summary) console.log(`${s.rule.padEnd(26)} hits ${String(s.hits).padStart(4)}  blocking ${String(s.blocking).padStart(3)}${s.components === null ? `  (pairs checked ${cl7.checked})` : `  components ${s.components}`}`);
  const top = ids.map(id => [id, per[id]!.length] as const).filter(([, n]) => n).sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log('\ntop: ' + top.map(([id, n]) => `${id} ${n}`).join(', '));
  if (args.includes('--verbose')) for (const id of ids) for (const h of per[id]!) console.log(`${h.rule} ${h.where}  ${h.message}${h.actual ? `  [${h.actual}]` : ''}`);
  if (args.includes('--verbose')) for (const h of cl7.hits) console.log(`CL7 ${h.where}  ${h.message}`);
}
