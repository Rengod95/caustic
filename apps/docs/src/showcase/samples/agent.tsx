import { useEffect, useRef, useState } from 'react';
import { Contrast, Ellipsis, FileCode, FlaskConical, Frame, GitBranch, Image, Pencil, Plus, Search, ShieldCheck } from 'lucide-react';
import {
  ActivityTree, AgentWorkArea, Button, ChangeDetail, ChangeDetailItem, Chip, CheckpointTimeline, CheckpointTimelineItem, Clarification,
  ClarificationOption, CodeDiff, CodeDiffLine, CodeDiffToken as T, Composer, ContextAnalytics, type ActivityNode, type ContextAnalyticsRoundData,
  type ContextAnalyticsSegmentData, IconButton, Message, MessageCode, ModelMenu, ModelMenuConnect, ModelMenuGroup, ModelMenuItem, PermissionRequest,
  type PermissionDecision, Plan, type PlanStep, PolicyFindings, PolicyFindingsItem, Proposal, RevisionHistory, RevisionHistoryItem, ScrollArea,
  SessionList, SessionListItem, SidePanel, Suggestions, SuggestionsItem, Thinking, ToolCall,
} from '@caustic/react';

const noop = () => {};

const PLAN: PlanStep[] = [
  { id: 'shipping', label: 'Extract shipping step', status: 'done', detail: 'routes/shipping.tsx' },
  { id: 'cart', label: 'Move cart state to provider', status: 'done', detail: 'cart-provider.tsx' },
  { id: 'payment', label: 'Rebuild payment step', status: 'now', detail: 'PaymentStep.tsx' },
  { id: 'saved', label: 'Saved cards, limit of three', status: 'todo', detail: 'SavedCardList' },
  { id: 'tests', label: 'Update checkout tests', status: 'todo', detail: 'payment.spec.ts' },
  { id: 'a11y', label: 'Check contrast and tap targets', status: 'todo' },
];

const PLAN_STATUS = { done: 'Done', now: 'In progress', todo: 'To do' };

const FILES = [
  { name: 'PaymentStep.tsx', add: 7, del: 2 },
  { name: 'CheckoutFlow.tsx', add: 12, del: 30 },
  { name: 'cart-provider.tsx', add: 64, del: 0 },
  { name: 'shipping.tsx', add: 88, del: 0 },
  { name: 'payment.spec.ts', add: 9, del: 6 },
];

const TREE: ActivityNode[] = [
  { id: 's1', kind: 'step', status: 'done', label: 'Extract shipping step', meta: '1.8s' },
  { id: 's2', kind: 'step', status: 'done', label: 'Move cart state to provider', meta: '2.6s' },
  { id: 'c1', kind: 'call', label: 'search · PaymentForm', meta: '14 matches' },
  { id: 's3', kind: 'step', status: 'active', label: 'Rebuild payment step', meta: 'step 3' },
  { id: 'c2', kind: 'call', running: true, label: 'edit_file · PaymentStep.tsx', meta: 'running' },
  { id: 'c3', kind: 'call', label: 'run_tests · checkout', meta: '2 failed' },
  { id: 'c4', kind: 'call', unassigned: true, label: 'screenshot_frame · Checkout', meta: 'Unassigned' },
];

const ROUNDS: ContextAnalyticsRoundData[] = [
  { total: 8, out: 1 }, { total: 13, out: 2 }, { total: 17, out: 2 }, { total: 21, out: 3 },
  { total: 26, out: 3 }, { total: 31, out: 4 }, { total: 42, out: 3 }, { total: 0, out: 0 },
  { total: 0, out: 0 }, { total: 0, out: 0 }, { total: 0, out: 0 }, { total: 0, out: 0 },
];

const SEGMENTS: ContextAnalyticsSegmentData[] = [
  { label: 'Scene', value: 5, tone: 'scene' },
  { label: 'Files', value: 12, tone: 'tokens' },
  { label: 'Transcript', value: 16, tone: 'transcript' },
  { label: 'Tools', value: 9, tone: 'tools' },
];

function SectionTitle({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 px-1 pb-1.5">
      <h3 className="font-ui text-ui-sm font-semibold text-text-primary">{title}</h3>
      {meta != null && <span className="text-ui-xs text-text-tertiary">{meta}</span>}
    </div>
  );
}

function Caret() {
  return <span aria-hidden className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 bg-text-secondary align-baseline" />;
}

function PreviewArtboard() {
  return (
    <div className="relative h-42 overflow-hidden rounded-xl border border-border-subtle bg-bg-canvas">
      <div className="absolute inset-x-4 top-3 h-6 rounded-md bg-surface-base shadow-1" />
      <div className="absolute left-4 top-[42px] h-2.5 w-28 rounded-full bg-fill-pressed" />
      <div className="absolute left-4 top-[58px] h-[78px] w-[264px] rounded-lg bg-surface-base shadow-1">
        <div className="absolute left-3 top-3 h-2 w-20 rounded-full bg-fill-pressed" />
        <div className="absolute left-3 top-7 h-2 w-36 rounded-full bg-fill-pressed" />
        <div className="absolute inset-x-3 bottom-3 h-6 rounded-md bg-ink-solid" />
      </div>
      <AgentWorkArea radius={14} rect={{ left: 12, top: 54, width: 272, height: 86 }} />
    </div>
  );
}

export default function Sample() {
  const [approval, setApproval] = useState<PermissionDecision | null>(null);
  const transcript = useRef<HTMLDivElement>(null);

  // Open the transcript at the latest turn, where the agent is working.
  useEffect(() => {
    const el = transcript.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="@container flex h-[calc(100vh-6.5rem)] min-h-[46rem] min-w-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-app font-ui text-text-primary">
      <div className="hidden min-h-0 @min-[860px]:flex">
        <SidePanel
          label="Sessions" title="Fieldnote Agent" size="inspector" defaultWidth={248}
          actions={<IconButton size="xs" label="New session"><Plus /></IconButton>}
          footer={(
            <span className="flex min-w-0 items-center gap-1.5 text-ui-xs text-text-tertiary">
              <GitBranch aria-hidden className="size-icon-sm shrink-0" />
              <span className="truncate">fieldnote-web · checkout-refactor</span>
            </span>
          )}
        >
          <div className="grid gap-4 p-2">
            <div>
              <p className="px-2 pb-1 pt-1 text-ui-xs text-text-tertiary">Today</p>
              <SessionList aria-label="Today's sessions">
                <SessionListItem status="running" current title="Checkout refactor" meta="now" />
                <SessionListItem status="review" title="Saved cards list" meta="Review" />
                <SessionListItem status="failed" title="Apple Pay sheet crash" meta="Failed" />
              </SessionList>
            </div>
            <div>
              <p className="px-2 pb-1 pt-1 text-ui-xs text-text-tertiary">Earlier</p>
              <SessionList aria-label="Earlier sessions">
                <SessionListItem status="done" title="Address autocomplete" meta="2h" />
                <SessionListItem status="done" title="Order summary totals" meta="Mon" />
              </SessionList>
            </div>
            <div>
              <p className="px-2 pb-1 pt-1 text-ui-xs text-text-tertiary">Checkpoints</p>
              <CheckpointTimeline aria-label="Project history">
                <CheckpointTimelineItem author="agent" selected title="Before payment edit" detail="checkpoint 3 · 4 files" restoreLabel="Restore" onRestore={noop} />
                <CheckpointTimelineItem title="Last green build" detail="checkout · 38 tests" time="13:58" dateTime="2026-10-24T13:58" />
                <CheckpointTimelineItem title="Baseline before refactor" detail="main @ 9f3c2a1" time="12:10" dateTime="2026-10-24T12:10" />
                <CheckpointTimelineItem author="agent" title="Preview deployed" detail="fieldnote-web-preview" time="Mon" />
              </CheckpointTimeline>
            </div>
            <div>
              <p className="px-2 pb-1 pt-1 text-ui-xs text-text-tertiary">Files changed</p>
              <ul aria-label="Files changed" className="m-0 grid list-none gap-0.5 p-0">
                {FILES.map(f => (
                  <li key={f.name} className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-ui-sm">
                    <FileCode aria-hidden className="size-icon-sm shrink-0 text-text-tertiary" />
                    <span className="min-w-0 flex-1 truncate font-mono text-mono text-text-primary">{f.name}</span>
                    <span className="text-ui-xs tabular-nums text-success-text">+{f.add}</span>
                    <span className="text-ui-xs tabular-nums text-danger-text">−{f.del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SidePanel>
      </div>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex min-w-0 items-center gap-3 border-b border-border-subtle px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-ui text-title-4 text-text-primary">Refactor checkout flow</h1>
            <p className="truncate text-ui-xs text-text-tertiary">fieldnote-web · checkout-refactor · 14m 02s</p>
          </div>
          <Chip size="sm" tone="info" dot>Running</Chip>
          <IconButton size="sm" label="Session options"><Ellipsis /></IconButton>
        </header>

        <ScrollArea label="Conversation" className="min-h-0 flex-1" viewportRef={transcript}>
          <div className="mx-auto grid w-full max-w-[42rem] gap-6 px-4 py-5">
            <Message author="user">
              Refactor the checkout flow. Split it into shipping, payment and review, and add saved cards with a limit of three.
            </Message>

            <div className="grid gap-3">
              <Thinking label="Thought for 14s" status="done">
                Card validation is shared with the wallet sheet, so I’ll keep it in one hook. That way Apple Pay and saved cards agree on limits.
              </Thinking>
              <Message meta="Fieldnote Agent · 2 tool calls · 12s" onCopy={noop} copyLabel="Copy message" onRetry={noop} retryLabel="Retry">
                <p>Here is the split I’d make. Each step gets its own route, and the cart moves into one provider so totals stay in sync.</p>
              </Message>
              <Proposal
                title="Split checkout into three steps" badge="Plan mode"
                chips={<><Chip size="sm" appearance="soft">+ 2 components</Chip><Chip size="sm" appearance="soft">5 files</Chip></>}
                onBuild={noop} onEdit={noop}
              >
                Shipping, payment and review become routes under <MessageCode>src/checkout</MessageCode>. Saved cards sit above the card form, with a limit of three.
              </Proposal>
            </div>

            <Message author="user">Build it. Ask before touching the shared Button.</Message>

            <div className="grid gap-3">
              <Message meta="Fieldnote Agent · 3 tool calls · 1m 04s" onCopy={noop} copyLabel="Copy message" onRetry={noop} retryLabel="Retry">
                <p>
                  Shipping is extracted and the cart lives in <MessageCode>cart-provider.tsx</MessageCode>. One question before the payment step:
                </p>
              </Message>
              <Clarification question="Should saved cards show the expiry date?" defaultValue="show">
                <ClarificationOption value="show" label="Show expiry" hint="“Visa •••• 4242 · 08/27”" />
                <ClarificationOption value="hide" label="Hide expiry" hint="Shorter rows, details on tap" />
              </Clarification>
            </div>

            <div className="grid gap-3">
              <Plan title="Checkout refactor" steps={PLAN} countLabel={(d, t) => `${d} of ${t} done`} statusLabels={PLAN_STATUS} />

              <Message streaming meta="Fieldnote Agent · 4 tool calls · 38s">
                <p>
                  Payment is the largest piece. Card validation now lives in <MessageCode>usePaymentForm</MessageCode>, and{' '}
                  <MessageCode>SavedCardList</MessageCode> reads from <MessageCode>savedCardsFor(customerId)</MessageCode>, capped at three cards.
                </p>
                <p>
                  Two checkout tests still expect the old flow. I’m updating them now, and I’ll ask before adding a dev dependency.<Caret />
                </p>
              </Message>

              <ActivityTree nodes={TREE} worker={{ name: 'Worker · checkout-refactor', meta: 'round 4 · 38s' }} />

              <ToolCall name="read_file" detail="src/checkout/CheckoutFlow.tsx" icon={<FileCode />} duration="0.4s" />
              <ToolCall name="search" detail={'"PaymentForm" · src/**'} icon={<Search />} duration="1.1s">
                14 matches in 6 files
              </ToolCall>
              <ToolCall status="failed" name="run_tests" detail="pnpm test -- checkout" icon={<FlaskConical />} failedLabel="2 failed">
                <span className="grid gap-0.5 font-mono text-mono">
                  <span>payment.spec.ts › pays with a saved card</span>
                  <span className="text-text-secondary">expected 3 cards, received 4</span>
                </span>
              </ToolCall>
              <ToolCall
                status="running" name="edit_file" detail="src/checkout/PaymentStep.tsx" icon={<Pencil />}
                activity="Editing" progress={58} progressLabel={n => `${n} progress`}
              />

              <CodeDiff aria-label="Changes to PaymentStep.tsx" filename="src/checkout/PaymentStep.tsx" onAccept={noop} onReject={noop}>
                <CodeDiffLine number={12}>
                  <T syntax="keyword">export function</T> PaymentStep({'{ cart, onDone }'}: PaymentStepProps) {'{'}
                </CodeDiffLine>
                <CodeDiffLine number={13} kind="remove">
                  {'  '}<T syntax="keyword">const</T> [card, setCard] = useState(emptyCard);
                </CodeDiffLine>
                <CodeDiffLine number={13} kind="add">
                  {'  '}<T syntax="keyword">const</T> {'{ form, saved, submit }'} = usePaymentForm(cart, onDone);
                </CodeDiffLine>
                <CodeDiffLine number={14} kind="remove">
                  {'  '}<T syntax="keyword">return</T> &lt;CardForm <T syntax="property">value</T>={'{card}'} onChange={'{setCard}'} /&gt;;
                </CodeDiffLine>
                <CodeDiffLine number={14} kind="add">
                  {'  '}<T syntax="keyword">return</T> (
                </CodeDiffLine>
                <CodeDiffLine number={15} kind="add">
                  {'    '}&lt;&gt;
                </CodeDiffLine>
                <CodeDiffLine number={16} kind="add">
                  {'      '}&lt;SavedCardList <T syntax="property">cards</T>={'{saved}'} <T syntax="property">onPick</T>={'{form.useSavedCard}'} /&gt;
                </CodeDiffLine>
                <CodeDiffLine number={17} kind="add">
                  {'      '}&lt;CardForm {'{...form.fields}'} <T syntax="property">onSubmit</T>={'{submit}'} /&gt;
                </CodeDiffLine>
                <CodeDiffLine number={18} kind="add">
                  {'    '}&lt;/&gt;
                </CodeDiffLine>
                <CodeDiffLine number={19} kind="add">
                  {'  '});
                </CodeDiffLine>
                <CodeDiffLine number={20}>{'}'}</CodeDiffLine>
              </CodeDiff>

              {approval === null && (
                <PermissionRequest
                  title="Install @testing-library/user-event?"
                  description="Adds one dev dependency to package.json. You can undo it from Revisions."
                  onDecision={setApproval}
                />
              )}
              {approval === 'deny' && (
                <p className="text-ui-sm text-text-tertiary">Denied. The agent continues without the dependency.</p>
              )}
              {approval !== null && approval !== 'deny' && (
                <PermissionRequest
                  status="allowed"
                  title={approval === 'allow-always' ? 'Allowed for this project' : 'Allowed once'}
                  description="Dev dependency added · package.json"
                />
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="mx-auto grid w-full max-w-[42rem] gap-2 px-4 pb-4 pt-2">
          <Suggestions aria-label="Suggested prompts">
            <SuggestionsItem icon={<FlaskConical />} hint="38 tests · about 40s">Run the full checkout suite</SuggestionsItem>
            <SuggestionsItem icon={<ShieldCheck />} hint="policy · 44 px">Check tap targets on new steps</SuggestionsItem>
            <SuggestionsItem icon={<Contrast />} hint="from PaymentStep.tsx">Explain the saved-card limit</SuggestionsItem>
          </Suggestions>
          <Composer
            inputLabel="Message Fieldnote Agent" sendLabel="Send" stopLabel="Stop" attachLabel="Add context" modeLabel="Mode"
            usageLabel={p => `Context ${p}%`} placeholder="Reply, or ask for a change…" modes={['Ask', 'Plan', 'Build']}
            defaultMode="Build" modelLabel="Claude Opus · Deep" usage={42} running
            onAttach={noop} onStop={noop} onModelClick={noop}
            context={(
              <>
                <Chip shape="rounded" appearance="surface" icon={<Frame />} onRemove={noop} removeLabel="Remove">checkout-flow.fig</Chip>
                <Chip shape="rounded" appearance="surface" icon={<Image />} onRemove={noop} removeLabel="Remove">ref-stripe.png</Chip>
                <Chip shape="rounded" appearance="surface" icon={<FileCode />} onRemove={noop} removeLabel="Remove">PaymentStep.tsx</Chip>
              </>
            )}
          />
        </div>
      </main>

      <div className="hidden min-h-0 @min-[1040px]:flex">
        <SidePanel label="Agent work" title="Review" side="end" size="pane" defaultWidth={320}>
          <div className="grid gap-5 p-3">
            <section>
              <SectionTitle title="Preview" meta="PaymentStep" />
              <PreviewArtboard />
              <p className="px-1 pt-2 text-ui-xs text-text-tertiary">Agent is editing the payment card and saved-card rows.</p>
            </section>

            <section>
              <SectionTitle title="Revisions" meta="5" />
              <RevisionHistory aria-label="Revisions" defaultValue="payment-draft" note="Restore waits until the running edit finishes." restoreDisabled>
                <RevisionHistoryItem itemId="payment-draft" author="agent" title="Payment step draft" detail="PaymentStep.tsx · +7 −2" time="14:31" />
                <RevisionHistoryItem itemId="shipping" author="agent" title="Shipping extracted" detail="routes/shipping.tsx" time="14:21" />
                <RevisionHistoryItem itemId="cart" title="Cart moved to provider" detail="cart-provider.tsx · Mina" time="14:09" />
                <RevisionHistoryItem itemId="copy" title="Copy pass" detail="3 strings" time="13:40" />
                <RevisionHistoryItem itemId="scaffold" title="Scaffold routes" detail="5 files" time="13:12" />
              </RevisionHistory>
            </section>

            <section>
              <SectionTitle title="Changes in this revision" meta="4" />
              <ChangeDetail aria-label="Changes in this revision">
                <ChangeDetailItem kind="mod" path="PaymentStep › props" from="onDone" to="onDone, savedCards" />
                <ChangeDetailItem kind="add" path="PaymentStep › SavedCardList" to="max 3" />
                <ChangeDetailItem kind="mod" path="CardForm › submit" from="onSubmit(card)" to="submit(form.fields)" />
                <ChangeDetailItem kind="del" path="PaymentStep › inlineValidate" from="validateCard" />
              </ChangeDetail>
            </section>

            <section>
              <SectionTitle title="Policy" meta="checkout" />
              <PolicyFindings summary={{ errors: 1, warnings: 2, passes: 38 }} aria-label="Policy findings">
                <PolicyFindingsItem
                  title="Literal color in PaymentStep" location="PaymentStep.tsx:42"
                  action={<Button tone="agent" size="xs" aria-label="Fix: Literal color in PaymentStep">Fix</Button>}
                />
                <PolicyFindingsItem
                  severity="warning" title="Tap target under 44 px" location="SavedCardList · 32 px"
                  action={<Button tone="ghost" size="xs" aria-label="Show: Tap target under 44 px">Show</Button>}
                />
                <PolicyFindingsItem
                  severity="warning" title="Empty state missing" location="SavedCardList · 0 cards"
                  action={<Button tone="ghost" size="xs" aria-label="Add: Empty state missing">Add</Button>}
                />
                <PolicyFindingsItem severity="pass" title="Checkout copy meets style guide" location="3 strings · 0 issues" />
              </PolicyFindings>
            </section>

            <section>
              <SectionTitle title="Context" meta="Round 7" />
              <ContextAnalytics
                aria-label="Context usage" rounds={ROUNDS} defaultSelectedRound={6} segments={SEGMENTS}
                summary="Round 7 · 18.4k in · 1.2k out" share="42% of window"
              />
            </section>

            <section>
              <SectionTitle title="Model" meta="Claude" />
              <ModelMenu
                inline label="Models" searchLabel="Search models" searchPlaceholder="Search models" defaultValue="claude-opus"
                groupLabel={(p, c) => `${p} · ${c ? 'connected' : 'not connected'}`}
              >
                <ModelMenuGroup provider="Anthropic" connected>
                  <ModelMenuItem value="claude-opus" initial="A" name="Claude Opus" description="Deep · 1M context" />
                  <ModelMenuItem value="claude-sonnet" initial="A" name="Claude Sonnet" description="Balanced · faster edits" />
                </ModelMenuGroup>
                <ModelMenuGroup provider="OpenAI" connected={false}>
                  <ModelMenuConnect initial="O" onConnect={noop}>Connect provider…</ModelMenuConnect>
                </ModelMenuGroup>
              </ModelMenu>
            </section>
          </div>
        </SidePanel>
      </div>
    </div>
  );
}
