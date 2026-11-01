import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'line-grid',
  name: 'LineGrid',
  category: 'data',
  status: 'ready',
  purpose: 'A line cell grid: cells share one line colour with no gap and no per-cell radius, for matrices, metric groups, compare blocks and summary cells. Empty cells are hatched; cross marks sit where the outer lines end.',
  role: 'grid',
  slots: [
    { name: 'root', el: 'div', description: 'Holds the cell layer and the marks layer on shared tracks.' },
    { name: 'cells', el: 'div', parent: 'root', role: 'grid', description: 'The clipped cell layer; the clip trims the outer top and left lines.' },
    { name: 'head', el: 'div', parent: 'cells', description: 'A row or column header cell: no fill, the title on the line, an optional muted word on the right.' },
    { name: 'cell', el: 'div', parent: 'cells', description: 'A data cell. Hatched when it has no items.' },
    { name: 'item', el: 'li', parent: 'cell', required: false, description: 'One entry in a cell: text and an optional 6px dot.' },
    { name: 'marks', el: 'div', parent: 'root', description: 'The unclipped layer that holds the cross marks.' },
    { name: 'mark', el: 'svg', parent: 'marks', description: 'A 14px cross at an outer corner or group boundary. Decorative.' },
  ],
  variants: {
    density: { values: ['regular', 'compact'], default: 'regular', description: 'Cell inline padding: regular 16, compact 12 for many columns.' },
  },
  states: {},
  props: {
    label: { type: 'string', description: 'Accessible name of the grid.' },
    columns: { type: 'readonly LineGridColumn[]', description: 'Column id, label, optional hint and track width.' },
    rows: { type: 'readonly LineGridRow[]', description: 'Row id, label, optional hint and group; a group change gets boundary marks.' },
    cell: { type: '(rowId: string, colId: string) => LineGridCellData | null', description: 'Cell content; null or no items draws a hatched cell.' },
    selected: { type: 'LineGridSelection', description: 'The selected cell, row or column; soft fill.' },
    focus: { type: '(rowId: string, colId: string, itemId: string) => boolean', description: 'Focus lens: items it returns false for take muted text.' },
    density: { type: "'regular' | 'compact'", default: 'regular', description: 'Cell inline padding.' },
    groupBreaks: { type: 'readonly string[]', description: 'Row ids that start a group; defaults to where rows[].group changes.' },
    corner: { type: 'ReactNode', description: 'Top-left header cell content.' },
    rowHeadWidth: { type: 'string', default: '11rem', description: 'Row header track.' },
  },
  events: {
    onSelect: { payload: 'rowId: string, colId: string', when: 'a data cell is pressed or activated with Enter or Space' },
    onSelectRow: { payload: 'rowId: string', when: 'a row header is pressed; passing it adds row headers to the roving order' },
    onSelectColumn: { payload: 'colId: string', when: 'a column header is pressed; passing it adds column headers to the roving order' },
    onItemSelect: { payload: 'rowId: string, colId: string, itemId: string', when: 'an item button is pressed; passing it makes items buttons' },
  },
  styles: [
    { slot: 'cell', expect: { padX: 16, padY: 12, text: 'body', fg: 'text.primary' } },
    { slot: 'cell', when: { density: 'compact' }, expect: { padX: 12 } },
    { slot: 'head', expect: { padX: 16, padY: 12 } },
    { slot: 'mark', expect: { height: 'icon-sm', width: 'icon-sm', fg: 'grid.mark' } },
  ],
  behavior: {
    keyboard: { ArrowRight: 'next cell', ArrowLeft: 'previous cell', ArrowDown: 'cell below', ArrowUp: 'cell above', Home: 'row start', End: 'row end', Enter: 'select', Space: 'select' },
    scenarios: [
      { name: 'press selects a cell', steps: [{ do: 'click', slot: 'cell' }], expect: [{ event: 'onSelect', calls: 1 }] },
      { name: 'Enter selects the focused cell', steps: [{ do: 'focus', slot: 'cell' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onSelect', calls: 1 }] },
    ],
  },
  a11y: { labelRequired: true, notes: ['One cell is in the tab order (roving); arrows move between cells.', 'Cross marks and hatching are decorative; an empty cell is announced as an empty gridcell.'] },
  policies: ['P6'],
  flags: {},
  examples: [],
  usage: [
    'Use for a matrix, metric group, compare block or summary cells. Use Table for sortable records.',
    'LineGridBlock, LineGridCell, LineGridMetric and LineGridEmpty lay out free cells on the same lines.',
    'Cell items are plain text with an optional 6px dot; do not put cards inside cells.',
  ],
});
