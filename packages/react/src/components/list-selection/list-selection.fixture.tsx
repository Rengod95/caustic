import { defineFixture } from '../../lib/fixture.ts';
import { ListSelection, ListSelectionItem, type ListSelectionProps } from './list-selection.tsx';

export default defineFixture({
  id: 'list-selection',
  render: props => {
    const p = props as Partial<ListSelectionProps>;
    const mode = p.mode ?? 'single';
    // The checked state passes defaultValue "first"; multiple mode promotes it to a one-item array.
    const defaultValue = mode === 'multiple'
      ? (typeof p.defaultValue === 'string' ? [p.defaultValue] : (p.defaultValue ?? []))
      : (p.defaultValue === undefined ? 'second' : p.defaultValue);
    return mode === 'multiple' ? (
      <ListSelection heading="Notify me about" {...p} mode="multiple" defaultValue={defaultValue}>
        <ListSelectionItem itemValue="first" title="Mentions" />
        <ListSelectionItem itemValue="second" title="Agent asks for approval" />
        <ListSelectionItem itemValue="third" title="Every publish" description="Can be noisy on large teams" />
      </ListSelection>
    ) : (
      <ListSelection heading="Appearance" {...p} mode="single" defaultValue={defaultValue}>
        <ListSelectionItem itemValue="first" title="Light" />
        <ListSelectionItem itemValue="second" title="Dark" />
        <ListSelectionItem itemValue="third" title="Match system" description="Follows your OS setting" />
      </ListSelection>
    );
  },
  frame: children => <div className="w-96">{children}</div>,
  examples: {
    'selection-list': () => (
      <div className="grid w-full grid-cols-2 items-start gap-3.5">
        <ListSelection heading="Appearance" defaultValue="dark">
          <ListSelectionItem itemValue="light" title="Light" />
          <ListSelectionItem itemValue="dark" title="Dark" />
          <ListSelectionItem itemValue="system" title="Match system" description="Follows your OS setting" />
        </ListSelection>
        <ListSelection mode="multiple" heading="Notify me about" defaultValue={['mentions', 'approval']}>
          <ListSelectionItem itemValue="mentions" title="Mentions" />
          <ListSelectionItem itemValue="approval" title="Agent asks for approval" />
          <ListSelectionItem itemValue="publish" title="Every publish" description="Can be noisy on large teams" />
        </ListSelection>
      </div>
    ),
  },
});
