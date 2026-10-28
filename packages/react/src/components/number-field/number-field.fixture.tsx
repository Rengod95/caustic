import { Lock, RotateCw, SquareDashed, X } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { NumberField } from './number-field.tsx';

export default defineFixture({
  id: 'number-field',
  // The stepper and hex cases render the old stepper-input and hex-input fixtures; every other case is the scrub field.
  render: props => props.format === 'hex'
    ? <div className="w-50"><NumberField aria-label="Hex" format="hex" defaultValue="E2763F" mixedLabel="Mixed" {...props} /></div>
    : props.appearance === 'stepper'
      ? <NumberField aria-label="Seats" defaultValue={8} {...props} />
      : <div className="w-50"><NumberField aria-label="X" label="X" unit="px" defaultValue={360} mixedLabel="Mixed" {...props} /></div>,
  examples: {
    states: () => (
      <>
        <div className="grid grid-cols-2 gap-1.5">
          <NumberField label="X" defaultValue={360} aria-label="X" />
          <NumberField label="Y" defaultValue={96} aria-label="Y" />
          <NumberField label={<RotateCw />} defaultValue={0} unit="°" aria-label="Rotation" />
          <NumberField label={<SquareDashed />} defaultValue={12} unit="px" aria-label="Gap" />
          <NumberField label="W" mixed mixedLabel="Mixed" aria-label="Width" />
          <NumberField label="H" defaultValue={-8} invalid aria-label="Height" />
          <NumberField label="R" defaultValue={12} locked trailing={<Lock />} aria-label="Radius" />
          <NumberField label="LH" defaultValue={1.5} trailing={<X />} aria-label="Line height" />
        </div>
        <div className="flex items-center gap-1.5 text-hint text-text-secondary">
          <Avatar name="Mina Kang" size="xs" />Radius is being edited by Mina in another window.
          <Button tone="ghost" size="xs" className="ml-auto">Retry</Button>
        </div>
        <span className="text-hint text-danger-text">Height can’t be negative.</span>
      </>
    ),
    // Was StepperInput: the form quantity field in each size, a bounded value at its limit, invalid and disabled.
    'stepper-input-stepper': () => (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Seats"><NumberField appearance="stepper" defaultValue={8} /></Field>
          <Field label="Guests"><NumberField appearance="stepper" size="sm" min={1} max={12} defaultValue={1} /></Field>
          <Field label="Rows"><NumberField appearance="stepper" size="lg" defaultValue={24} /></Field>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Retries" error="Use 5 or fewer."><NumberField appearance="stepper" defaultValue={9} /></Field>
          <Field label="Licenses"><NumberField appearance="stepper" disabled defaultValue={4} /></Field>
        </div>
      </div>
    ),
    // Was HexInput (its preset): the hex format at rest, bound to a token, mixed, invalid and disabled.
    'hex-input-hex': () => (
      <div className="grid w-50 gap-1.5">
        <NumberField format="hex" aria-label="Fill" defaultValue="E2763F" />
        <NumberField format="hex" aria-label="Stroke" token="accent/solid" />
        <NumberField format="hex" aria-label="Shadow" mixed mixedLabel="Mixed" />
        <NumberField format="hex" aria-label="Border" defaultValue="E2763" invalid />
        <NumberField format="hex" aria-label="Disabled" defaultValue="5F4994" disabled />
      </div>
    ),
  },
});
