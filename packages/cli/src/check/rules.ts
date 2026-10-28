// The `caustic check` rule set. Ids, severities and one-line meanings; skills/caustic/reference/check.md has a section
// per rule (marked <!-- rule:<id> -->) that `docs` points to.
export type Severity = 'error' | 'warning' | 'advisory';

export type RuleId =
  | 'token-unknown-class' | 'token-literal' | 'token-dark-variant'
  | 'component-unknown' | 'prop-unknown' | 'prop-invalid-value' | 'prop-deprecated' | 'prop-missing-label'
  | 'compose-outside-parent' | 'compose-reinvented';

export type Rule = { id: RuleId; severity: Severity; description: string };

export const rules: Rule[] = [
  { id: 'token-unknown-class', severity: 'error', description: 'A className utility that the Caustic theme does not produce.' },
  { id: 'token-literal', severity: 'error', description: 'A literal colour (error) or px/rem length in an arbitrary value or a style object; lengths are warnings except on type, radius and shadow (hairlines and custom properties allowed).' },
  { id: 'token-dark-variant', severity: 'error', description: 'The dark: variant; theming is automatic through the semantic tokens.' },
  { id: 'component-unknown', severity: 'error', description: 'A named import from @caustic/react that the catalog does not export.' },
  { id: 'prop-unknown', severity: 'error', description: 'A prop the Caustic component does not accept.' },
  { id: 'prop-invalid-value', severity: 'error', description: "A string literal outside the prop's values (variant, size, tone …)." },
  { id: 'prop-deprecated', severity: 'advisory', description: 'A prop or value the catalog marks deprecated; it still works, the current name is preferred.' },
  { id: 'prop-missing-label', severity: 'warning', description: 'A component that needs an accessible name has no aria-label, aria-labelledby, label, title or text.' },
  { id: 'compose-outside-parent', severity: 'error', description: 'A compound part rendered outside its parent component.' },
  { id: 'compose-reinvented', severity: 'warning', description: 'Raw HTML that a Caustic component covers, in a file that already uses Caustic.' },
];

export const ruleIds = rules.map(r => r.id);
export const ruleById = new Map(rules.map(r => [r.id, r]));
export const docsFor = (id: string) => `skills/caustic/reference/check.md#${id}`;
