import {
  AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignStartHorizontal, AlignStartVertical,
  Copy, Scissors, Trash2,
} from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { ButtonGroup, ButtonGroupSeparator, type ButtonGroupProps } from './button-group.tsx';

/** The former AlignBar: three horizontal, a separator, three vertical alignments. */
const AlignSample = (props: Partial<ButtonGroupProps>) => (
  <ButtonGroup aria-label="Align" {...props}>
    <IconButton label="Align left"><AlignStartVertical /></IconButton>
    <IconButton label="Align horizontal centers"><AlignCenterVertical /></IconButton>
    <IconButton label="Align right"><AlignEndVertical /></IconButton>
    <ButtonGroupSeparator />
    <IconButton label="Align top"><AlignStartHorizontal /></IconButton>
    <IconButton label="Align vertical centers"><AlignCenterHorizontal /></IconButton>
    <IconButton label="Align bottom"><AlignEndHorizontal /></IconButton>
  </ButtonGroup>
);

export default defineFixture({
  id: 'button-group',
  render: props => <AlignSample {...(props as Partial<ButtonGroupProps>)} />,
  examples: {
    // align-bar had no example of its own; this one shows its two densities and a row of labelled actions.
    'align-bar-densities': () => (
      <div className="grid justify-items-start gap-3">
        <AlignSample />
        <ButtonGroup density="tight" aria-label="Align">
          <IconButton label="Align left"><AlignStartVertical /></IconButton>
          <IconButton label="Align center"><AlignCenterVertical /></IconButton>
          <IconButton label="Align right"><AlignEndVertical /></IconButton>
        </ButtonGroup>
        <ButtonGroup aria-label="Edit" size="sm">
          <Button variant="ghost" iconStart={<Scissors />}>Cut</Button>
          <Button variant="ghost" iconStart={<Copy />}>Copy</Button>
          <ButtonGroupSeparator />
          <IconButton label="Delete"><Trash2 /></IconButton>
        </ButtonGroup>
      </div>
    ),
  },
});
