import { defineFixture } from '../../lib/fixture.ts';
import { ReadingOrder, ReadingOrderItem, type ReadingOrderProps } from './reading-order.tsx';

export default defineFixture({
  id: 'reading-order',
  render: props => {
    // Item-level state props apply to the first item.
    const { warning, dragging, ...rest } = props as Partial<ReadingOrderProps> & { warning?: boolean; dragging?: boolean };
    return (
      <ReadingOrder aria-label="Screen reader order" {...rest}>
        <ReadingOrderItem itemId="plan" warning={warning} note={warning ? 'Reads after price' : undefined} dragging={dragging}>Plan name · Pro</ReadingOrderItem>
        <ReadingOrderItem itemId="price">Price · $24 / month</ReadingOrderItem>
        <ReadingOrderItem itemId="badge" warning note="Reads after price">Popular badge</ReadingOrderItem>
        <ReadingOrderItem itemId="features">Feature list · 3 items</ReadingOrderItem>
        <ReadingOrderItem itemId="cta">Upgrade to Pro</ReadingOrderItem>
      </ReadingOrder>
    );
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    'reading-order': () => (
      <ReadingOrder aria-label="Screen reader order">
        <ReadingOrderItem itemId="plan">Plan name · Pro</ReadingOrderItem>
        <ReadingOrderItem itemId="price">Price · $24 / month</ReadingOrderItem>
        <ReadingOrderItem itemId="badge" warning note="Reads after price">Popular badge</ReadingOrderItem>
        <ReadingOrderItem itemId="features">Feature list · 3 items</ReadingOrderItem>
        <ReadingOrderItem itemId="cta">Upgrade to Pro</ReadingOrderItem>
      </ReadingOrder>
    ),
  },
});
