import { defineFixture } from '../../lib/fixture.ts';
import { ChoiceCards, ChoiceCardsItem, type ChoiceCardsProps } from './choice-cards.tsx';

const Plans = (props: Partial<ChoiceCardsProps>) => (
  <ChoiceCards aria-label="Plan" defaultValue="pro" {...props}>
    <ChoiceCardsItem value="starter" title="Starter" description="1 editor · 3 projects" price="$0" priceUnit=" / month" />
    <ChoiceCardsItem value="pro" title="Pro" description="Unlimited projects" price="$24" priceUnit=" / month" />
    <ChoiceCardsItem value="team" title="Team" description="Roles & audit log" price="$64" priceUnit=" / month" />
  </ChoiceCards>
);

const Targets = (props: Partial<ChoiceCardsProps>) => (
  <ChoiceCards type="multiple" aria-label="Export targets" defaultValue={['react', 'tokens']} {...props}>
    <ChoiceCardsItem value="react" title="React" description="Components + Tailwind" />
    <ChoiceCardsItem value="swiftui" title="SwiftUI" description="Views + asset catalog" />
    <ChoiceCardsItem value="tokens" title="Tokens" description="DTCG JSON" />
  </ChoiceCards>
);

export default defineFixture({
  id: 'choice-cards',
  render: props => ((props as Partial<ChoiceCardsProps>).type === 'multiple' ? <Targets {...props} /> : <Plans {...props} />),
  examples: {
    'choice-cards': () => (
      <>
        <Plans />
        <Targets />
      </>
    ),
  },
});
