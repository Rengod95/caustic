'use client';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from '../../icons/index.ts';
import type { ComponentProps, CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { tableCellVariants, tableHeadingVariants, tableRowVariants, tableVariants } from './table.variants.ts';

export interface TableColumn {
  key: string;
  header: ReactNode;
  /** "end" is for numeric columns (tabular numerals). */
  align?: 'start' | 'end';
  sortable?: boolean;
  /** Fixed column width in px, passed as a custom property. */
  width?: number;
}
export type TableRow = { id: string } & Record<string, unknown>;
export interface TableSort { key: string; direction: 'ascending' | 'descending' }

export interface TableProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  columns: TableColumn[];
  rows: TableRow[];
  /** Custom cell content. Defaults to String(row[column.key]). */
  renderCell?: (row: TableRow, column: TableColumn) => ReactNode;
  /** Accessible name for the row checkbox ("Select Mina"). Defaults to the first column value. */
  rowLabel?: (row: TableRow) => string;
  /** Adds a trailing 40px column with an empty header. */
  rowActions?: (row: TableRow) => ReactNode;
  /** Content of the toolbar row. */
  toolbar?: ReactNode;
  /** Adds the checkbox column and aria-selected on rows. */
  selectable?: boolean;
  /** single: one row is chosen by click, Enter or Space (no checkbox column); the chosen row is one raised surface, like the current item of a nav. Uses selectedKeys (at most one key). Default none. */
  selectionMode?: 'none' | 'single';
  /** A row is activated by click, Enter or Space (a click on a control inside the row does not count). With selectionMode single the row is chosen first. Rows become focusable (arrow keys move between them). */
  onRowActivate?: (row: TableRow) => void;
  /** false drops the hairlines between rows and under the header, for a table that sits on the page. Default true. */
  dividers?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  /** Controlled sort; the table never reorders rows itself. */
  sort?: { key: string; direction: 'ascending' | 'descending' } | null;
  onSortChange?: (sort: { key: string; direction: 'ascending' | 'descending' }) => void;
  /** Footer summary; defaults to "<n> of <total> selected" when selectable. */
  summary?: ReactNode;
  /** Current page (1-based); enables the pager together with pageCount. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /** Accessible name of the pager nav. Distinguish it when several tables share a page. */
  pagerLabel?: string;
  /** Caps the scroll area height in px; the body then scrolls under the sticky header. Unset, the table grows with its rows. */
  maxHeight?: number;
}

const pageButton = 'inline-flex h-control-md min-w-control-md items-center justify-center gap-1 rounded-md px-2 text-ui tabular-nums text-text-secondary outline-none transition-control press hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-sm';
/** The current page is the segment thumb (control family, §4 B2): control-raised fill and the control edge, control-raised-hover under the pointer; focus keeps the edge. */
const pageCurrent = 'bg-control-raised font-semibold text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)] hover:bg-control-raised-hover focus-visible:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2),var(--cs-focus)]';

/** Data table: toolbar, row selection, sortable columns, row actions and a footer with summary and pager. */
export function Table({
  columns, rows, renderCell, rowLabel, rowActions, toolbar, selectable = false, selectionMode = 'none', onRowActivate, dividers = true, selectedKeys, defaultSelectedKeys = [], onSelectedKeysChange,
  sort, onSortChange, summary, page, pageCount, onPageChange, pagerLabel = 'Pagination', maxHeight, tone, variant, radius, shadow, size, className, ...props
}: TableProps) {
  const [selected, setSelected] = useControllableState<string[]>({ value: selectedKeys, defaultValue: defaultSelectedKeys, onChange: onSelectedKeysChange });
  const allOn = rows.length > 0 && rows.every(r => selected.includes(r.id));
  const someOn = rows.some(r => selected.includes(r.id));
  const nameOf = (row: TableRow) => rowLabel?.(row) ?? String(row[columns[0]?.key ?? 'id'] ?? row.id);
  const toggleRow = (id: string) => setSelected(selected.includes(id) ? selected.filter(k => k !== id) : [...selected, id]);
  const single = selectionMode === 'single';
  const pickable = single || onRowActivate !== undefined;
  // Roving tab stop of pickable rows: the chosen row, else the first.
  const stopId = rows.find(r => selected.includes(r.id))?.id ?? rows[0]?.id;
  const activate = (row: TableRow) => {
    if (single) setSelected([row.id]);
    onRowActivate?.(row);
  };
  const rowClick = (row: TableRow) => (e: MouseEvent<HTMLTableRowElement>) => {
    if (e.target instanceof Element && e.target.closest('button, a, input, [role="checkbox"]')) return;
    activate(row);
  };
  const rowKey = (row: TableRow) => (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(row); return; }
    const to = e.key === 'ArrowDown' ? e.currentTarget.nextElementSibling : e.key === 'ArrowUp' ? e.currentTarget.previousElementSibling
      : e.key === 'Home' ? e.currentTarget.parentElement?.firstElementChild : e.key === 'End' ? e.currentTarget.parentElement?.lastElementChild : null;
    if (to instanceof HTMLElement) { e.preventDefault(); to.focus(); }
  };
  const pager = page != null && pageCount != null;
  const footerSummary = summary ?? (selectable ? `${rows.filter(r => selected.includes(r.id)).length} of ${rows.length} selected` : null);
  const hasFooter = footerSummary != null || pager;
  const heading = tableHeadingVariants({ size, dividers });
  const cell = tableCellVariants({ size });
  const colWidth = (w?: number): CSSProperties | undefined => (w == null ? undefined : { '--col-w': `${w}px` } as CSSProperties);

  return (
    <div
      data-slot="table"
      data-size={size ?? 'md'}
      className={cn(tableVariants({ tone, variant, radius, shadow }), className)}
      {...props}
    >
      {toolbar != null && <div data-slot="table-toolbar" className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-3 py-2.5">{toolbar}</div>}
      <div
        data-slot="table-scroll"
        style={maxHeight == null ? undefined : { '--table-max-h': `${maxHeight}px` } as CSSProperties}
        className={cn('overflow-x-auto', maxHeight != null && 'max-h-(--table-max-h) overflow-y-auto')}
      >
        <table data-slot="table-grid" className="w-full min-w-table-min-w border-collapse text-ui">
          <thead data-slot="table-head">
            <tr>
              {selectable && (
                <th data-slot="table-heading" scope="col" className={cn(heading, 'w-table-select-w text-start')}>
                  <Checkbox
                    data-slot="table-head-check" aria-label="Select all"
                    checked={allOn ? true : someOn ? 'indeterminate' : false}
                    onCheckedChange={next => setSelected(next === true ? rows.map(r => r.id) : [])}
                  />
                </th>
              )}
              {columns.map(col => {
                const active = sort?.key === col.key ? sort.direction : undefined;
                const Glyph = active === 'ascending' ? ArrowUp : active === 'descending' ? ArrowDown : ChevronsUpDown;
                return (
                  <th
                    key={col.key} data-slot="table-heading" scope="col" aria-sort={active}
                    style={colWidth(col.width)}
                    className={cn(heading, col.align === 'end' ? 'text-end' : 'text-start', col.width != null && 'w-[var(--col-w)]')}
                  >
                    {col.sortable ? (
                      <button
                        type="button" data-slot="table-sort"
                        className="inline-flex items-center gap-1 rounded-xs text-inherit outline-none transition-control press hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-sm [&_svg]:shrink-0"
                        onClick={() => onSortChange?.({ key: col.key, direction: active === 'ascending' ? 'descending' : 'ascending' })}
                      >
                        {col.header}<Glyph aria-hidden />
                      </button>
                    ) : col.header}
                  </th>
                );
              })}
              {rowActions && <th data-slot="table-heading" scope="col" className={cn(heading, 'w-10')}><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody data-slot="table-body">
            {rows.map(row => {
              const on = selected.includes(row.id);
              return (
                <tr
                  key={row.id} data-slot="table-row" aria-selected={selectable || single ? on : undefined}
                  tabIndex={pickable ? (row.id === stopId ? 0 : -1) : undefined}
                  onClick={pickable ? rowClick(row) : undefined} onKeyDown={pickable ? rowKey(row) : undefined}
                  className={tableRowVariants({ size, selection: single ? 'single' : 'multiple', dividers, pickable })}
                >
                  {selectable && (
                    <td data-slot="table-cell" className={cell}>
                      <Checkbox data-slot="table-row-check" aria-label={`Select ${nameOf(row)}`} checked={on} onCheckedChange={() => toggleRow(row.id)} />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} data-slot="table-cell" className={cn(cell, col.align === 'end' ? 'text-end tabular-nums' : 'text-start')}>
                      {renderCell ? renderCell(row, col) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {rowActions && <td data-slot="table-cell" className={cell}>{rowActions(row)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasFooter && (
        <div data-slot="table-footer" className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-3 py-2 text-ui-sm font-normal text-text-tertiary">
          {footerSummary != null ? <span data-slot="table-summary">{footerSummary}</span> : <span />}
          {pager && (
            <nav data-slot="table-pager" aria-label={pagerLabel} className="flex flex-wrap items-center gap-1">
              <button type="button" data-slot="table-page-prev" aria-label="Previous page" className={pageButton} onClick={() => onPageChange?.(Math.max(1, page - 1))}><ChevronLeft aria-hidden /></button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                <button
                  key={n} type="button" data-slot="table-page" aria-current={n === page ? 'page' : undefined}
                  className={cn(pageButton, n === page && pageCurrent)} onClick={() => onPageChange?.(n)}
                >{n}</button>
              ))}
              <button type="button" data-slot="table-page-next" aria-label="Next page" className={pageButton} onClick={() => onPageChange?.(Math.min(pageCount, page + 1))}><ChevronRight aria-hidden /></button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
