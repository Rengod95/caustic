import { Braces, CodeXml, FileCode, FileImage, FileUp, Link } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { ChoiceGroup, ChoiceGroupItem, type ChoiceGroupProps } from './choice-group.tsx';

type P = Partial<ChoiceGroupProps>;

// ---- appearance card (was ChoiceCards)
const Plans = (props: P) => (
  <ChoiceGroup aria-label="Plan" defaultValue="pro" {...props}>
    <ChoiceGroupItem value="starter" title="Starter" description="1 editor · 3 projects" price="$0" priceUnit=" / month" />
    <ChoiceGroupItem value="pro" title="Pro" description="Unlimited projects" price="$24" priceUnit=" / month" />
    <ChoiceGroupItem value="team" title="Team" description="Roles & audit log" price="$64" priceUnit=" / month" />
  </ChoiceGroup>
);

const Targets = (props: P) => (
  <ChoiceGroup type="multiple" aria-label="Export targets" defaultValue={['react', 'tokens']} {...props}>
    <ChoiceGroupItem value="react" title="React" description="Components + Tailwind" />
    <ChoiceGroupItem value="swiftui" title="SwiftUI" description="Views + asset catalog" />
    <ChoiceGroupItem value="tokens" title="Tokens" description="DTCG JSON" />
  </ChoiceGroup>
);

// ---- appearance tile (was OptionTiles)
const formats: [string, string, string][] = [
  ['svg', 'SVG', 'vector'], ['png', 'PNG', '2×'], ['jpg', 'JPG', 'quality'], ['webp', 'WebP', 'quality'],
  ['pdf', 'PDF', 'print'], ['fig', 'FIG', 'selection'], ['jsx', 'JSX', 'React'], ['tokens', 'Tokens', 'DTCG'],
];

const sources = [
  { id: 'url', label: 'URL', icon: <Link /> },
  { id: 'file', label: 'File', icon: <FileUp /> },
  { id: 'html', label: 'HTML', icon: <CodeXml /> },
  { id: 'jsx', label: 'JSX', icon: <FileCode /> },
  { id: 'workspace', label: 'Workspace', icon: <Braces /> },
];

const Tiles = (props: P) =>
  props.layout === 'icon' ? (
    <ChoiceGroup appearance="tile" aria-label="Import source" defaultValue="file" columns="5" {...props}>
      {sources.map(s => <ChoiceGroupItem key={s.id} value={s.id} title={s.label} icon={s.icon} />)}
    </ChoiceGroup>
  ) : (
    <ChoiceGroup appearance="tile" aria-label="Export format" defaultValue="png" {...props}>
      {formats.map(([id, label, caption], i) => <ChoiceGroupItem key={id} value={id} title={label} description={caption} icon={i === 0 ? <FileImage /> : undefined} />)}
    </ChoiceGroup>
  );

// ---- appearance answer (was Clarification)
const Answers = (props: P) => (
  <ChoiceGroup appearance="answer" question="Should saved cards show the expiry date?" {...props}>
    <ChoiceGroupItem value="show" title="Show expiry" description="“Visa •••• 4242 · 08/27”" />
    <ChoiceGroupItem value="hide" title="Hide expiry" description="Shorter rows, details on tap" />
  </ChoiceGroup>
);

export default defineFixture({
  id: 'choice-group',
  // Cases: appearance picks the content (card: the plans, or the export targets for type="multiple"; tile: the export
  // formats, or the import sources for layout="icon", in a 400px column; answer: the expiry question in a 400px column, nothing chosen unless defaultValue says so).
  render: props => {
    const p = props as P;
    if (p.appearance === 'tile') return <div className="w-100"><Tiles {...p} /></div>;
    if (p.appearance === 'answer') return <div className="w-100"><Answers {...p} /></div>;
    return p.type === 'multiple' ? <Targets {...p} /> : <Plans {...p} />;
  },
  examples: {
    'choice-cards-choice-cards': () => (
      <>
        <Plans />
        <Targets />
      </>
    ),
    // Border or fill (owner 2026-10-28): outline (default) draws an edge on every tile; soft fills them with neutral.track
    // and no edge. The chosen tile inverts in both; the last grid turns the corner check on (check).
    'option-tiles-option-tiles-fill': () => (
      <div className="grid w-100 gap-4">
        <Tiles />
        <Tiles variant="soft" />
        <Tiles layout="icon" variant="soft" />
        <Tiles check />
      </div>
    ),
    // The selected card's fill (owner 2026-10-28): ink (default, the ink hover step) above the opt-in neutral.solid.
    'choice-cards-selected-fill': () => (
      <div className="grid gap-4">
        <Plans />
        <Plans selectedFill="solid" />
      </div>
    ),
    // The agent's question with two answers, the first chosen (was Clarification; it had no example of its own).
    'clarification-answer': () => (
      <div className="w-100">
        <Answers defaultValue="show" />
      </div>
    ),
  },
});
