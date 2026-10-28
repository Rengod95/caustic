# Critique: a review pass after the build

Load this in step 6, after `caustic check` is clean. This is a short pass against Caustic's own principles, not a
general taste review. Look at the rendered screen if you can; otherwise read the JSX region by region. Fix what you
find, then run `caustic check` again.

For each question, note one line: pass, or what you changed. Do not score.

## 1. Hierarchy

- Can you name the one thing each region is for, and is it the most visible thing there?
- Type does the ranking: one title per region (`text-title-*`), body in `text-ui` or `text-body`, support text in
  `text-text-secondary`, meta in `text-text-tertiary`. Emphasis comes from weight and size, not colour.
- Headers carry their own weight. A small label above every heading, or numbered sections, is a default to drop
  unless the sequence matters.

## 2. Density

- Caustic is a 13px tool interface. Controls sit at the control scale (`md` by default; `sm` and `xs` in dense
  toolbars and inspectors), not at marketing sizes.
- Space follows the 4px scale: tight inside a group, wider between groups. Cards and panels use the regular inset;
  nested lists and inline cards the compact one.
- No container without a reason. A section with a `SectionHeader` and plain content often reads better than the same
  content wrapped in a card. Never a card inside a card.

## 3. One accent

- Count accent fills per region. More than one confirming accent action is a finding.
- Primary actions are ink (the default `Button`); secondary is `variant="outline"`, quiet is `variant="ghost"`.
- The accent is also selection, focus, links and toggles. If an accent fill is decoration, remove it.
- Status colours (success, warning, danger, info) appear only where they mean status.

## 4. Depth

- Resting things (cards, lists, inputs, sections) are solid with one 1px hairline, no shadow.
- Floating things (toolbars, popovers, menus, toasts, sheets, floating panels) are solid with one elevation shadow.
- No surface has both a hairline and a shadow. No translucency, no `backdrop-blur`, no glow.
- Corners are concentric: an inner radius is never larger than its container's.

## 5. Agent light

- The spectrum, the orb, the shimmer, `tone="agent"` and agent colours appear only where the agent is present,
  working, or left provenance. Find each one and name the agent fact it marks; remove any that marks nothing.
- The agent has a voice: its prose is in the serif (`Message`, `Thinking` handle this). Interface text and people
  stay in the sans; machine values in mono.
- On the canvas, human and agent stay distinct: the human selection is accent with square handles; agent work is
  the spectrum rim (`AgentWorkArea`) and the agent cursor.
- Approvals and questions from the agent use `agent.request` components in the flow, not a generic modal.

## 6. Focus and access

- Tab through the screen in your head: every control is reachable, in reading order, and shows focus. Components
  draw their own focus; custom focusable elements use `focus-ring` or, for a text field box, `focus-field`.
- Every icon-only control and every unnamed list, tree or slider has a label.
- Text is never below 11px; pointer targets are at least 24 × 24.
- Motion has a job: feedback is quick, movement springs, only agent signatures loop, and reduced motion stops them.

## 7. Coverage

- Every requirement of the brief is on the screen and findable.
- Each region has its empty, loading and error state where data can be missing (`EmptyState`, `Skeleton`, `Alert`).
- Where you hand-built something, run `caustic find` for it once more. If a component fits, switch.

## Report

End with three lines at most: what you changed, any stretch of a component past its role and why, and anything you
left on purpose.
