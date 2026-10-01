import { SlidersHorizontal } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Button } from '../button/button.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { Popover, PopoverDescription, PopoverTitle } from './popover.tsx';

export default defineFixture({
  id: 'popover',
  render: props => (
    <div className="grid justify-items-start gap-2.5">
      <Popover inline defaultOpen anchor={<Button tone="secondary" size="sm">Spacing</Button>} {...props}>
        <PopoverTitle>Spacing</PopoverTitle>
        <PopoverDescription>Gap and padding are bound to tokens.</PopoverDescription>
      </Popover>
    </div>
  ),
  examples: {
    anchored: () => (
      <div className="flex items-start gap-6">
        <div className="grid justify-items-start gap-2.5">
          <Popover
            inline
            anchor={<Button tone="secondary" size="sm"><SlidersHorizontal />Spacing</Button>}
          >
            <PopoverTitle>Spacing</PopoverTitle>
            <div className="grid grid-cols-2 gap-1.5">
              <NumberField label="Gap" defaultValue={12} aria-label="Gap" />
              <NumberField label="Pad" defaultValue={16} aria-label="Padding" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ui-dense text-text-tertiary">Bound to space/3</span>
              <Button tone="ghost" size="xs">Detach</Button>
            </div>
          </Popover>
        </div>
        <div className="grid justify-items-start gap-2.5">
          <Popover inline trigger="hover" size="sm" anchor={<Avatar name="Mina Kang" size="md" presence />}>
            <div className="flex items-center gap-2.5">
              <Avatar name="Mina Kang" size="md" />
              <div>
                <PopoverTitle className="block">Mina Kang</PopoverTitle>
                <span className="text-ui-dense text-text-tertiary">Product designer · Seoul</span>
              </div>
            </div>
            <span className="text-ui-dense text-text-tertiary">Editing Pricing / Desktop now</span>
            <div className="flex items-center gap-2">
              <Button tone="secondary" size="xs">Follow</Button>
              <Button tone="ghost" size="xs">Message</Button>
            </div>
          </Popover>
        </div>
      </div>
    ),
  },
});
