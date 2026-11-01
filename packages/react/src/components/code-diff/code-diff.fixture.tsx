import { defineFixture } from '../../lib/fixture.ts';
import { CodeDiff, CodeDiffComment, CodeDiffHunk, CodeDiffLine, CodeDiffToken as T, type CodeDiffDecision, type CodeDiffKind, type CodeDiffSyntax } from './code-diff.tsx';

const lines = (kind?: CodeDiffKind, syntax?: CodeDiffSyntax) => (
  <>
    <CodeDiffLine number={12} kind={kind}><T syntax={syntax}>export function</T> PricingCard({'{ plan }'}) {'{'}</CodeDiffLine>
    <CodeDiffLine number={13} kind="remove">{'  '}<T syntax="keyword">return</T> &lt;Card <T syntax="property">radius</T>=<T syntax="string">"lg"</T> <T syntax="property">padding</T>=<T syntax="string">"6"</T>&gt;</CodeDiffLine>
    <CodeDiffLine number={14} kind="remove">{'    '}&lt;Price <T syntax="property">size</T>=<T syntax="string">"md"</T> /&gt;</CodeDiffLine>
    <CodeDiffLine number={13} kind="add">{'  '}<T syntax="keyword">return</T> &lt;Card <T syntax="property">radius</T>=<T syntax="string">"card"</T> <T syntax="property">padding</T>=<T syntax="string">"card"</T>&gt;</CodeDiffLine>
    <CodeDiffLine number={14} kind="add">{'    '}&lt;Price <T syntax="property">size</T>=<T syntax="string">"lg"</T> <T syntax="property">tone</T>={'{plan.tone}'} /&gt;</CodeDiffLine>
    <CodeDiffLine number={15} kind="add">{'    '}<T syntax="comment">{'{/* agent: tokens bound, no literals */}'}</T></CodeDiffLine>
    <CodeDiffLine number={16}>{'    '}&lt;Features <T syntax="property">items</T>={'{plan.features}'} /&gt;</CodeDiffLine>
  </>
);

export default defineFixture({
  id: 'code-diff',
  // Line and token props (kind, syntax) apply to the first line / token.
  // Hunk review: a decision (or a hunk header) renders the lines as one hunk with a comment after the first added line; onComment and onDecide go to the first line and the hunk.
  render: ({ kind, syntax, number: _n, decision, header, onDecide, onComment, ...props }) => (
    <CodeDiff aria-label="Changes to PricingCard.tsx" filename="PricingCard.tsx" added={3} removed={2} {...props}>
      {decision !== undefined || header !== undefined
        ? (
          <CodeDiffHunk header={typeof header === 'string' ? header : '@@ -12,5 +12,6 @@ PricingCard'} decision={(decision as CodeDiffDecision | undefined) ?? 'pending'} onDecide={onDecide as ((d: 'accepted' | 'rejected') => void) | undefined}>
            <CodeDiffLine number={12} commentLabel="Comment on line 12" onComment={onComment as (() => void) | undefined}><T syntax="keyword">export function</T> PricingCard({'{ plan }'}) {'{'}</CodeDiffLine>
            <CodeDiffComment author="Mina">Bind the radius to the card token.</CodeDiffComment>
            <CodeDiffLine number={13} kind="add">{'  '}<T syntax="keyword">return</T> &lt;Card <T syntax="property">radius</T>=<T syntax="string">"card"</T>&gt;</CodeDiffLine>
          </CodeDiffHunk>
        )
        : lines(kind as CodeDiffKind | undefined, syntax as CodeDiffSyntax | undefined)}
    </CodeDiff>
  ),
  examples: {
    'realization-review': () => (
      <CodeDiff aria-label="Changes to PricingCard.tsx" filename="PricingCard.tsx">{lines()}</CodeDiff>
    ),
  },
});
