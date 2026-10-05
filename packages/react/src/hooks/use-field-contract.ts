import { useRef, useState, type FocusEvent } from 'react';

/**
 * The K2e field contract shared by the composite inspector parts (spec: number-field usage). It owns the rejection, invalid, dirty
 * and focus state of the fields of one part: onFieldCommit returning false rejects a commit, which marks that field invalid until the
 * next edit, Escape or a new value.
 * A field key is the field name, or `name:index` for an indexed field (a gradient stop); a record entry under the plain name applies
 * to every index.
 */
export interface FieldContractOptions<Change extends { field: string }, Field extends string = string> {
  invalid?: Partial<Record<string, boolean>> | undefined;
  describedBy?: Partial<Record<string, string>> | undefined;
  onFieldFocus?: ((event: { field: Field; index?: number }) => void) | undefined;
  onFieldBlur?: ((event: { field: Field; index?: number; dirty: boolean }) => void) | undefined;
  onFieldCommit?: ((change: Change) => boolean | void) | undefined;
}

const plain = (key: string) => key.split(':')[0]!;
const indexOf = (key: string) => { const i = key.split(':')[1]; return i === undefined ? undefined : Number(i); };

export function useFieldContract<Change extends { field: string }, Field extends string = string>(options: FieldContractOptions<Change, Field>) {
  const [rejected, setRejected] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const live = useRef({ rejected: {} as Record<string, boolean>, dirty: {} as Record<string, boolean>, just: {} as Record<string, boolean>, focused: {} as Record<string, boolean> });
  const opts = useRef(options); opts.current = options;

  const markRejected = (key: string, on: boolean) => { live.current.rejected[key] = on; setRejected(r => (r[key] === on || (!on && !r[key]) ? r : { ...r, [key]: on })); };
  const markDirty = (key: string, on: boolean) => { live.current.dirty[key] = on; setDirty(d => (d[key] === on || (!on && !d[key]) ? d : { ...d, [key]: on })); };
  const fromRecord = <T,>(rec: Partial<Record<string, T>> | undefined, key: string): T | undefined => rec?.[key] ?? rec?.[plain(key)];

  const api = {
    /** True while the owner marked the field invalid or a commit of it was rejected. */
    isInvalid: (key: string) => fromRecord(options.invalid, key) === true || rejected[key] === true,
    /** The dirty state right now (refs), for a blur report that runs after the commit. */
    dirtyNow: (key: string) => live.current.dirty[key] === true || live.current.rejected[key] === true,
    isDirty: (key: string) => dirty[key] === true || rejected[key] === true,
    describedBy: (key: string) => fromRecord(options.describedBy, key),
    /** Raises onFieldCommit for one field. Returns true when it was accepted; `apply` runs only then (the part own state and onValueChange). */
    commit: (key: string, change: Change, apply?: () => void): boolean => {
      const result = opts.current.onFieldCommit?.(change);
      if (result === false) { live.current.just[key] = true; markRejected(key, true); return false; }
      live.current.just[key] = false;
      markRejected(key, false);
      apply?.();
      return true;
    },
    /** Feed every draft report of a typed field here. A commit that was just rejected keeps its mark; any other change clears it. */
    draft: (key: string, d: { dirty: boolean }) => {
      if (live.current.just[key]) live.current.just[key] = false;
      else if (live.current.rejected[key]) markRejected(key, false);
      markDirty(key, d.dirty);
    },
    focus: (key: string, scrub = false) => {
      // One report per focus session: a focus forwarded from the slot wrapper reaches the input as well.
      if (!scrub) { if (live.current.focused[key]) return; live.current.focused[key] = true; }
      opts.current.onFieldFocus?.({ field: plain(key) as Field, ...(indexOf(key) === undefined ? {} : { index: indexOf(key)! }) }); },
    blur: (key: string) => {
      live.current.focused[key] = false;
      // The commit of the same blur runs after this handler, so the state is read one microtask later.
      queueMicrotask(() => {
        opts.current.onFieldBlur?.({ field: plain(key) as Field, ...(indexOf(key) === undefined ? {} : { index: indexOf(key)! }), dirty: live.current.dirty[key] === true || live.current.rejected[key] === true });
      });
    },
    /** Attributes for any element of a field (an input, a toggle, a select). */
    attrs: (key: string) => ({
      'data-field': plain(key),
      'data-invalid': api.isInvalid(key) || undefined,
      'data-dirty': api.isDirty(key) || undefined,
      'aria-describedby': api.describedBy(key),
    }),
    /** Attributes for the slot wrapper of a field: the same state without aria-describedby. The wrapper is focusable by a script or a press on its padding and then reports the field itself; report also forwards the focus of everything inside it (a composite field such as a track list). */
    wrapAttrs: (key: string, report = false) => ({
      'data-field': plain(key),
      'data-invalid': api.isInvalid(key) || undefined,
      'data-dirty': api.isDirty(key) || undefined,
      tabIndex: -1,
      onFocus: (e: FocusEvent<HTMLElement>) => { if (report || e.target === e.currentTarget) api.focus(key); },
      onBlur: (e: FocusEvent<HTMLElement>) => { if (report || e.target === e.currentTarget) api.blur(key); },
    }),
    /** Props to spread onto a NumberField (or any input based field): the invalid state, attributes and focus, blur and scrub hooks. */
    inputProps: (key: string, inert = false) => ({
      ...api.attrs(key),
      invalid: api.isInvalid(key),
      onFocus: () => { if (!inert) api.focus(key); },
      onBlur: () => { if (!inert) api.blur(key); },
      onScrubStart: () => { if (!inert) api.focus(key, true); },
    }),
  };
  return api;
}
