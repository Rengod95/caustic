import type { ReactNode } from 'react';
import { Badge, Table, type TableColumn, type TableRow } from '@caustic/react';
import { Bullets, Mono, Page, PageHeader, Section } from '../ui.tsx';

// "For agents": how a coding agent builds with Caustic. Consumer-facing; it describes the CLI and the skill, never
// the internal authoring process.

function Code({ label, children }: { label: string; children: string }) {
  return (
    <pre aria-label={label} className="m-0 overflow-x-auto rounded-2xl bg-bg-inset px-4 py-3.5 font-mono text-mono text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]">
      <code>{children}</code>
    </pre>
  );
}

const commandColumns: TableColumn[] = [
  { key: 'command', header: 'Command' },
  { key: 'gives', header: 'What it gives' },
];

const commandRows: TableRow[] = [
  { id: 'status', command: 'caustic', gives: 'Status: catalog version, component count, roles and the next commands. Changes nothing.' },
  { id: 'list', command: 'caustic list --tree', gives: 'Every component by category and role, one line each, so nothing stays invisible.' },
  { id: 'find', command: 'caustic find "<need>"', gives: 'Components ranked for a need in plain words, plus siblings to also consider.' },
  { id: 'show', command: 'caustic show <ids> --depth brief|api|full', gives: 'Progressive detail: intent and fit, then props and parts, then examples with code.' },
  { id: 'roles', command: 'caustic roles [role]', gives: 'The role taxonomy, or the components that serve one role.' },
  { id: 'recipes', command: 'caustic recipes [id]', gives: 'Screen recipes: regions, roles and the components that usually fill them.' },
  { id: 'tokens', command: 'caustic tokens [group]', gives: 'The token utilities you may use, by group.' },
  { id: 'check', command: 'caustic check <files>', gives: 'Static check against the tokens and the component APIs. Exit 0 clean, 1 errors to fix, 2 could not read the input.' },
];

const renderCommand = (row: TableRow, column: TableColumn): ReactNode =>
  column.key === 'command' ? <Mono>{String(row.command)}</Mono> : <span className="text-text-secondary">{String(row.gives)}</span>;

const session = `$ caustic
Caustic catalog 1.0.0 · 116 components · 46 roles · 7 recipes · 11 categories
next:
  caustic list --tree               the whole component set by category and role
  caustic find "<need>"             route a need to fitting components
  caustic show <id…> --depth api    props, variants, events (full: + example code)
  caustic roles | recipes | tokens  the role taxonomy, screen layouts, token utilities
  caustic check <files…>            check code against the tokens and the component specs

$ caustic recipes design-editor
Design editor (design-editor)
  titlebar: File name and sync state, undo and redo, the editor mode switch, collaborators and Share.
  start: Pages and the layer tree, with a filter field, in a tabbed side panel.
  canvas: Rulers, frames and their labels, the selection, guides, comments and the agent cursor.
  overlay: Floating tools over the canvas: the tool bar, selection actions, key hints and zoom.
  inspector: Properties of the selection in sections.

$ caustic find "mode switch in the titlebar" --limit 2
find "mode switch in the titlebar"
 1. segmented-control  SegmentedControl · choice.single (+navigation.local, input.pick)
      Switch between two to five short, mutually exclusive views or modes in place.
 2. switch             Switch · choice.toggle (+property.editor)
      Turn a setting on or off with an effect that applies at once, with no save step.
also consider:
  - tabs: the choice swaps a whole panel of content under it (from segmented-control)
  - select: there are more than five options or the labels are long (from segmented-control)
next: caustic show segmented-control switch --depth api

$ caustic show segmented-control layer-tree inspector-panel --depth api
…props, parts, events, keyboard and label requirements…

$ caustic check src/editor.tsx
src/editor.tsx
  line 42: [token-literal] className="bg-[#0a84ff]"
    → use a semantic colour utility, for example bg-accent-solid
1 error, 0 warnings`;

export function AgentsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow={<Badge>For agents</Badge>}
        title="Building with Caustic as an agent"
        lead="Coding agents build Caustic screens through a CLI and a skill. The CLI shows the whole component set, routes a need to the components that fit, expands their API only when asked, and checks the code the agent wrote. The skill holds the workflow."
      />

      <Section id="setup" title="Setup" description="Install the CLI next to the components, and give the agent the skill.">
        <Code label="Install">{`pnpm add @caustic/react
pnpm add -D @caustic/cli
npx caustic        # status and the next commands`}</Code>
        <Bullets items={[
          <>The skill lives in <Mono>skills/caustic/</Mono>: a short <Mono>SKILL.md</Mono> with the workflow and the command map, and references the agent loads only when a step needs them (routing, composition, tokens, check rules, critique, recipes).</>,
          <>Copy that folder into your agent's skills directory (for example <Mono>.claude/skills/caustic/</Mono>), or point the agent at it. <Mono>@caustic/react</Mono> also ships an <Mono>AGENTS.md</Mono> that points agents to the skill and the CLI.</>,
          <>For tools that read plain text, the catalog is shipped as <Mono>@caustic/catalog/llms.txt</Mono>, and as data in <Mono>@caustic/catalog/catalog.json</Mono>.</>,
        ]} />
      </Section>

      <Section id="cli" title="The CLI" description="Every command also prints JSON with --json.">
        <Table aria-label="caustic commands" columns={commandColumns} rows={commandRows} renderCell={renderCommand} />
      </Section>

      <Section id="workflow" title="The workflow" description="Six steps. The agent expands context one step at a time, only for what it will use.">
        <ol className="m-0 grid list-decimal gap-2 pl-5 font-ui text-ui-md-relaxed text-text-secondary">
          <li><b className="font-medium text-text-primary">Shape.</b> Split the screen into regions, or start from a recipe.</li>
          <li><b className="font-medium text-text-primary">Route.</b> For each region, <Mono>caustic find</Mono> the need, or scan <Mono>caustic list --tree</Mono>.</li>
          <li><b className="font-medium text-text-primary">Expand.</b> <Mono>caustic show &lt;ids&gt; --depth api</Mono>; <Mono>full</Mono> only for what it builds with.</li>
          <li><b className="font-medium text-text-primary">Build.</b> Compose parts inside their parents and style with token utilities.</li>
          <li><b className="font-medium text-text-primary">Check.</b> <Mono>caustic check</Mono> and fix every error.</li>
          <li><b className="font-medium text-text-primary">Critique.</b> One pass against the principles: hierarchy, density, one accent, depth, agent light, focus.</li>
        </ol>
      </Section>

      <Section id="routing" title="Fit, not prohibition" description="Roles guide the choice; they do not forbid one.">
        <Bullets items={[
          'Every component has one or two primary roles (choice.single, agent.request, property.editor) and roles it also fits in applied design.',
          '“Also consider” points to a sibling that may fit a nearby need better. It is a suggestion to read, not a rule.',
          'A brief may stretch a component into another role. The agent keeps its accessibility contract and says why.',
          'Generic layouts, such as a page made only of cards and buttons, are defaults to question, not errors.',
        ]} />
      </Section>

      <Section id="session" title="An example session" description="An agent building a design editor screen.">
        <Code label="Example session">{session}</Code>
      </Section>
    </Page>
  );
}
