import { defineFixture } from '../../lib/fixture.ts';
import { TextProperties, type TextPropertiesLabels, type TextPropertiesProps } from './text-properties.tsx';

const labels: TextPropertiesLabels = {
  weight: 'Font weight',
  size: 'Size',
  lineHeight: 'Line height',
  letterSpacing: 'Letter spacing',
  align: { left: 'Align left', center: 'Align center', right: 'Align right', justify: 'Justify' },
  alignGroup: 'Text alignment',
  valign: { top: 'Top', middle: 'Middle', bottom: 'Bottom' },
  valignGroup: 'Vertical alignment',
  resize: { fixed: 'Fixed', 'auto-h': 'Auto H', 'auto-w': 'Auto W', truncate: 'Truncate' },
  resizeGroup: 'Text resizing',
  case: { none: 'As typed', upper: 'Uppercase', lower: 'Lowercase', title: 'Title case' },
  caseSamples: { none: 'Aa', upper: 'AA', lower: 'aa', title: 'Ab' },
  caseGroup: 'Letter case',
  details: 'Details',
  notice: styleRuns => `This text has ${styleRuns} style runs. Changes apply to the whole layer.`,
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'text-properties',
  render: props => <TextProperties labels={labels} {...(props as Partial<TextPropertiesProps>)} />,
  examples: {
    'text-properties': () => <TextProperties styleRuns={3} labels={labels} />,
  },
});
