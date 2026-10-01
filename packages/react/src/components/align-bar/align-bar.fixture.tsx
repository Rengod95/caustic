import {
  AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignStartHorizontal, AlignStartVertical,
} from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { AlignBar, AlignBarItem, AlignBarSeparator, type AlignBarProps } from './align-bar.tsx';

/** The specimen bar: three horizontal, a separator, three vertical alignments. */
const AlignBarSample = (props: Partial<AlignBarProps>) => (
  <AlignBar aria-label="Align" {...props}>
    <AlignBarItem label="Align left"><AlignStartVertical /></AlignBarItem>
    <AlignBarItem label="Align horizontal centers"><AlignCenterVertical /></AlignBarItem>
    <AlignBarItem label="Align right"><AlignEndVertical /></AlignBarItem>
    <AlignBarSeparator />
    <AlignBarItem label="Align top"><AlignStartHorizontal /></AlignBarItem>
    <AlignBarItem label="Align vertical centers"><AlignCenterHorizontal /></AlignBarItem>
    <AlignBarItem label="Align bottom"><AlignEndHorizontal /></AlignBarItem>
  </AlignBar>
);

export default defineFixture({
  id: 'align-bar',
  render: props => <AlignBarSample {...(props as Partial<AlignBarProps>)} />,
  examples: {},
});
