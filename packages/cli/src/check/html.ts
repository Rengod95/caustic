// A small allowlist of HTML attributes (React spelling) by tag, for props that pass through to a component's root
// element. Not a full DOM typing: global attributes plus the common ones of the elements Caustic roots render.

export const ALWAYS_ALLOWED = new Set(['key', 'ref', 'className', 'style', 'children', 'id']);

const GLOBAL = [
  'title', 'role', 'tabIndex', 'hidden', 'dir', 'lang', 'translate', 'draggable', 'spellCheck', 'contentEditable', 'inert',
  'autoFocus', 'accessKey', 'nonce', 'slot', 'is', 'enterKeyHint', 'inputMode', 'autoCapitalize', 'autoCorrect',
  'popover', 'popoverTarget', 'popoverTargetAction', 'itemProp', 'itemScope', 'itemType', 'itemID', 'itemRef',
  'suppressHydrationWarning', 'suppressContentEditableWarning', 'dangerouslySetInnerHTML',
];

const BY_TAG: Record<string, string[]> = {
  a: ['href', 'target', 'rel', 'download', 'hrefLang', 'ping', 'referrerPolicy', 'type', 'media'],
  button: ['type', 'disabled', 'form', 'formAction', 'formMethod', 'formEncType', 'formNoValidate', 'formTarget', 'name', 'value'],
  input: ['type', 'name', 'value', 'defaultValue', 'checked', 'defaultChecked', 'disabled', 'placeholder', 'readOnly', 'required',
    'min', 'max', 'step', 'minLength', 'maxLength', 'pattern', 'autoComplete', 'list', 'multiple', 'accept', 'size', 'form',
    'src', 'alt', 'width', 'height', 'capture'],
  select: ['name', 'value', 'defaultValue', 'disabled', 'required', 'multiple', 'form', 'autoComplete', 'size'],
  textarea: ['name', 'value', 'defaultValue', 'placeholder', 'rows', 'cols', 'disabled', 'readOnly', 'required', 'minLength',
    'maxLength', 'wrap', 'autoComplete', 'form'],
  img: ['src', 'alt', 'width', 'height', 'srcSet', 'sizes', 'loading', 'decoding', 'crossOrigin', 'referrerPolicy', 'fetchPriority'],
  label: ['htmlFor', 'form'],
  form: ['action', 'method', 'encType', 'noValidate', 'target', 'name', 'autoComplete', 'acceptCharset'],
  fieldset: ['disabled', 'form', 'name'],
  dialog: ['open'],
  details: ['open', 'name'],
  ol: ['start', 'reversed', 'type'],
  li: ['value'],
  td: ['colSpan', 'rowSpan', 'headers', 'abbr'],
  th: ['colSpan', 'rowSpan', 'headers', 'scope', 'abbr'],
  time: ['dateTime'],
  progress: ['value', 'max'],
  meter: ['value', 'min', 'max', 'low', 'high', 'optimum'],
  output: ['htmlFor', 'form', 'name'],
  option: ['value', 'label', 'selected', 'disabled'],
  svg: ['viewBox', 'width', 'height', 'fill', 'stroke', 'xmlns', 'preserveAspectRatio'],
};

const UNION = new Set([...GLOBAL, ...Object.values(BY_TAG).flat()]);

/** HTML attributes allowed on a root element `el` ('any' or unknown: the union of every tag above). */
export function htmlAttributes(el: string | undefined): Set<string> {
  const tag = el && BY_TAG[el];
  return tag ? new Set([...GLOBAL, ...tag]) : UNION;
}

export const isPassThrough = (name: string) =>
  ALWAYS_ALLOWED.has(name) || name.startsWith('data-') || name.startsWith('aria-') || /^on[A-Z]/.test(name);
