import { PaintBucket, Scan, Type } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { InspectorBindings, InspectorBindingsRow, type InspectorBindingsProps, type InspectorBindingsRowProps } from './inspector-bindings.tsx';

const rows = (first: Partial<InspectorBindingsRowProps> = {}) => (
  <>
    <InspectorBindingsRow
      property="Fill" selectorLabel="Fill, color/accent/solid" unbindLabel="Unbind Fill" mixedLabel="Mixed tokens" icon={<PaintBucket />} token="color/accent/solid" swatch="var(--cs-color-accent-solid)"
      context={['color', '· alias depth 2', '· light, dark']} count={first.binding === 'mixed' ? '3 / 5' : undefined} {...first}
    />
    <InspectorBindingsRow property="Corner radius" selectorLabel="Corner radius, radius/card · 20" unbindLabel="Unbind Corner radius" icon={<Scan />} token="radius/card · 20" context={['dimension', '· direct']} />
    <InspectorBindingsRow
      property="Text style" selectorLabel="Text style, Mixed tokens" unbindLabel="Unbind Text style" mixedLabel="Mixed tokens" icon={<Type />} binding="mixed" count="3 / 5" token="Mixed tokens"
      context={['3 of 5 layers use label/md · 2 use literals']}
    />
  </>
);

export default defineFixture({
  id: 'inspector-bindings',
  render: props => {
    // Row-level props (binding, disabled, reserved, onUnbind, onPick) apply to the first row; the rest go to the stack.
    const { binding, onUnbind, onPick, disabled, reserved, options, value, placeholder, onValueChange, unbindDisabled, ...rest } = props as Partial<InspectorBindingsProps> & Pick<InspectorBindingsRowProps, 'binding' | 'onUnbind' | 'onPick' | 'disabled' | 'reserved' | 'options' | 'value' | 'placeholder' | 'onValueChange' | 'unbindDisabled'>;
    return <InspectorBindings addLabel="Bind a property" {...rest}>{rows({ binding, onUnbind, onPick, disabled, reserved, options, value, placeholder, onValueChange, unbindDisabled })}</InspectorBindings>;
  },
  frame: children => <div className="w-90">{children}</div>,
  examples: {
    'foundation-bindings': () => <InspectorBindings addLabel="Bind a property">{rows()}</InspectorBindings>,
  },
});
