# `caustic check`: rules and fixes

Load this in step 5 (Check), or when a finding links here. Each rule has a section below with what it catches, why,
and how to fix it. `caustic check --list-rules` prints the live list.

## Running it

```sh
caustic check src/screens/editor.tsx src/components/*.tsx
caustic check src --json              # machine-readable findings on stdout
caustic check src --rules token-literal,prop-unknown
caustic check src --github            # ::error annotations for CI
```

Human output goes to stderr: a header per file, then one line per finding and its fix, then a summary:

```
src/screens/editor.tsx
  line 42: [token-literal] className="bg-[#0a84ff]"
    → use a semantic colour utility, for example bg-accent-solid
  line 57: [prop-invalid-value] <Button size="huge">
    → size is one of xs, sm, md, lg
2 errors, 0 warnings
```

`--json` prints `{ findings: [{ rule, severity, file, line, column, snippet, message, fix, docs }], summary }`. The
`docs` field links to the section of this file for that rule.

**Severity.** `error` fails the run. `warning` is reported and never fails. `advisory` is hidden unless you pass
`--advisory`.

**Exit codes.**

| Code | Meaning | What to do |
|---|---|---|
| 0 | No errors | Done (read any warnings) |
| 1 | Errors found | Fix the code and run again |
| 2 | The input or the catalog could not be read | An environment problem: report it; do not change the code to make it pass |

**Suppression.** Use it when a finding is wrong for this line, not to make the run pass. A reason is required:

```tsx
// caustic-disable-next-line token-literal: the brand mark colour is customer data
<span style={{ background: '#e4002b' }} />
```

Project-wide, `.caustic/config.json` takes `{ "ignoreRules": ["rule-id"], "ignoreFiles": ["glob"] }`. Prefer the
line comment; it keeps the reason next to the code.

---

<a id="token-unknown-class"></a>
## token-unknown-class
<!-- rule:token-unknown-class -->

Severity: `error`.

**Catches** a `className` utility that the Caustic theme does not produce: `bg-red-500`, `text-gray-600`,
`text-sm`, `shadow-lg`, `md:p-4` (the theme has no viewport breakpoints).

**Why.** The Caustic theme replaces Tailwind's palette and scales. An unknown utility either compiles to nothing or
bypasses the tokens, so the screen drifts from the system and breaks in the other theme.

**Fix.** Use the token utility for the same job: `bg-danger-solid`, `p-6` or `p-8`, `text-text-secondary`,
`text-ui-sm`, `shadow-3`. `caustic tokens <group>` lists what exists. If no token fits, use the nearest one rather than a
literal.

<a id="token-literal"></a>
## token-literal
<!-- rule:token-literal -->

Severity: `error` for colours and for lengths where a token exists; `warning` for other lengths.

**Catches** a literal colour or px/rem length in an arbitrary value or in `style`: `bg-[#0a84ff]`, `w-[312px]`,
`style={{ color: 'rgb(0 0 0)' }}`. Hairlines (`0.5px`, `1px`, `1.5px`, `2px`), `var(--cs-*)` and CSS custom
properties are allowed. A numeric `duration-200` or `delay-150` is a warning: use `duration-quick`, `swift`, `base`,
`gentle`, `slow` or a spring pair (`ease-spring duration-spring`).

| Literal | Severity | Examples |
|---|---|---|
| Colour (hex, `rgb()`, `hsl()`, `oklch()`, named colours) | `error` | `bg-[#0a84ff]`, `style={{ color: 'red' }}` |
| Length on type, radius or shadow | `error` | `text-[16px]`, `leading-[20px]`, `rounded-[28px]`, `shadow-[0_4px_12px_…]`, `style={{ fontSize: 13 }}` |
| Other length (layout widths, heights, grid tracks, offsets) | `warning` | `max-w-[42rem]`, `grid-cols-[1fr_340px]`, `top-[42px]` |

Layout lengths are warnings because a screen's own widths and tracks are legitimate; still prefer a size token
(`w-(--cs-size-…)`, `max-w-…`) when one fits.

**Why.** Literals do not follow the theme, the accent hue or density, and they skip the contrast guarantees the tokens
carry.

**Fix.** Replace the literal with a utility, or reference a token in the arbitrary value:
`w-(--cs-size-color-picker-w)`, `shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]`. For runtime data (a
colour the user picked), set a custom property in `style` and read it with a utility:
`style={{ '--swatch': color }}` and `bg-(--swatch)`.

<a id="token-dark-variant"></a>
## token-dark-variant
<!-- rule:token-dark-variant -->

Severity: `error`.

**Catches** any `dark:` variant.

**Why.** Every Caustic colour token has a light and a dark value. A `dark:` override fights the tokens and usually
breaks contrast in one theme.

**Fix.** Delete the `dark:` class and use the semantic token that already adapts (`bg-surface-base`,
`text-text-secondary`). To force a theme, set `data-theme` on `<html>`.

<a id="component-unknown"></a>
## component-unknown
<!-- rule:component-unknown -->

Severity: `error`.

**Catches** an import from `@caustic/react` that the package does not export: a misspelled name, a part that does
not exist (`CardSubtitle`), a component from another library.

**Why.** It fails at build time, or it hides a guess about the API.

**Fix.** Find the real name: `caustic find "<need>"` or `caustic show <id> --depth api` (its `exports` list has every
part). If nothing exists, build it from tokens rather than inventing an export.

<a id="prop-unknown"></a>
## prop-unknown
<!-- rule:prop-unknown -->

Severity: `error`.

**Catches** a prop the component or part does not accept, for example `<Button kind="primary">` or a part prop set on
the root.

**Why.** Unknown props are dropped or end up on the DOM; the intended effect does not happen.

**Fix.** Check `caustic show <id> --depth api`. Emphasis usually maps to the common props `tone`, `variant`, `size`,
`radius`, `shadow`. Part props belong on the part (`<CardTitle titleSize="sm">`).

<a id="prop-invalid-value"></a>
## prop-invalid-value
<!-- rule:prop-invalid-value -->

Severity: `error`.

**Catches** a literal value outside the prop's allowed set: `size="huge"`, `tone="primary"`, `variant="filled"`.

**Why.** The component has no style for it and falls back silently.

**Fix.** Use one of the values the finding lists. Common mappings: primary → the default (`tone="neutral"`, solid);
secondary → `variant="outline"`; subtle → `variant="ghost"`; destructive → `tone="danger"`.

<a id="prop-deprecated"></a>
## prop-deprecated
<!-- rule:prop-deprecated -->

Severity: `advisory` (shown with `--advisory`).

**Catches** a prop or a value the catalog marks deprecated, for example a legacy tone such as `<Button tone="secondary">`
or a renamed prop.

**Why.** It still works, but it is kept only for older code; the current name says the same thing in the current
vocabulary and will outlive it.

**Fix.** Use the current name the finding gives (for legacy tones, the `tone` + `variant` pair, such as
`tone="neutral" variant="outline"` for secondary). `caustic show <id> --depth api` lists the current props and values.

<a id="prop-missing-label"></a>
## prop-missing-label
<!-- rule:prop-missing-label -->

Severity: `warning`.

**Catches** a component that needs an accessible name and has none: an icon-only button, a slider, a list or tree
without `aria-label`, `aria-labelledby`, `label`, `title` or visible text.

**Why.** Screen readers announce it as an unnamed control; keyboard users cannot tell controls apart.

**Fix.** Add the name the component asks for (`show --depth api` → `a11y`): `<IconButton label="Undo">`,
`<Slider aria-label="Opacity">`, or `aria-labelledby` pointing at a visible heading.

<a id="compose-outside-parent"></a>
## compose-outside-parent
<!-- rule:compose-outside-parent -->

Severity: `error`.

**Catches** a compound part rendered outside its parent: `TabsTrigger` without `TabsList`, `DialogFooter` outside
`Dialog`, `InspectorSectionHeader` outside `InspectorSection`.

**Why.** Parts read their parent's context; outside it they lose state, keyboard handling or layout.

**Fix.** Move the part inside its parent (the finding names it; `show --depth api` lists every part's `parent`). If
you only wanted the look, use a component meant to stand alone, such as `SectionHeader` instead of a `CardHeader`
without a `Card`.

<a id="compose-reinvented"></a>
## compose-reinvented
<!-- rule:compose-reinvented -->

Severity: `warning`.

**Catches** raw HTML that a Caustic component already covers: `<button>`, `<input>`, `<select>`, `<textarea>`,
`<dialog>`, `role="tab"` and similar, in a file that already uses Caustic. The finding names the component to use.

**Why.** The hand-built version misses the tokens, states, focus treatment and keyboard behaviour the component
has, and drifts from the rest of the screen.

**Fix.** Use the named component: `Button` or `IconButton`, `Input`, `Checkbox`, `Switch`, `Select`, `Textarea`,
`Dialog`, `Tabs`. When the raw element is right (a native file input wrapped by your own logic, a form `<button>` in
a non-Caustic area), suppress the line with a reason.
