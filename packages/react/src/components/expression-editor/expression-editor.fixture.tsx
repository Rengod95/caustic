import { defineFixture } from '../../lib/fixture.ts';
import { ExpressionEditor, type ExpressionEditorBinding, type ExpressionEditorProps } from './expression-editor.tsx';

const sources = [
  { value: 'color/shadow/ambient', label: 'color/shadow/ambient · color' },
  { value: 'color/accent/solid', label: 'color/accent/solid · color' },
  { value: 'space/200', label: 'space/200 · dimension' },
  { value: 'space/400', label: 'space/400 · dimension' },
];

const bindings: ExpressionEditorBinding[] = [
  { id: 'color', source: 'color/shadow/ambient', property: '', properties: [{ value: '', label: '$value · #1F2937' }], path: '/color' },
  { id: 'blur', source: 'space/200', property: '', properties: [{ value: '', label: '$value · 8' }], path: '/blur' },
];

const raw = '{\n  "composite": {\n    "color": { "ref": { "id": "color/shadow/ambient", "expectedKind": "token" } }\n  }\n}';

const text = {
  hint: 'Changes to a source update this value. Bind its whole value or one property.',
  sourceLabel: 'Source token',
  propertyLabel: 'Source property',
  sourcePlaceholder: 'Choose a token',
  sourceName: (i: number) => `Binding source ${i + 1}`,
  propertyName: (i: number) => `Binding property ${i + 1}`,
  rawToggleLabel: 'Edit expression JSON',
  rawLabel: 'Binding expression',
};

const Editor = (props: Partial<ExpressionEditorProps>) => (
  <div className="w-72"><ExpressionEditor {...text} bindings={bindings} sources={sources} defaultRaw={raw} {...props} /></div>
);

export default defineFixture({
  id: 'expression-editor',
  // Open by default so the field-focus policy (P9) finds the textarea; scenarios override defaultRawOpen.
  render: props => <Editor defaultRawOpen {...(props as Partial<ExpressionEditorProps>)} />,
  examples: {
    bindings: () => <Editor />,
    'raw-error': () => <Editor defaultRawOpen defaultRaw={'{ "ref": '} error="Enter a valid ref or composite JSON expression." />,
  },
});
