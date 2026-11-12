// Tone scope: a Button or IconButton without its own tone inside an Alert takes the alert tone; an explicit tone wins;
// a solid alert gives the raised neutral button; Popover / Menu / Dialog content resets the scope.
// Run: pnpm exec tsx --test packages/react/tests/tone-scope.test.tsx
import { test } from 'node:test';
import assert from 'node:assert/strict';
// tsx compiles JSX to React.createElement here (classic runtime), so React must be in scope.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert } from '../src/components/alert/alert.tsx';
import { Button } from '../src/components/button/button.tsx';
import { IconButton } from '../src/components/icon-button/icon-button.tsx';
import { scopedTone } from '../src/lib/tone-scope.ts';

/** data-tone / data-variant of every element with the given data-slot, in document order. */
function tones(html: string, slot: string): string[] {
  return [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, 'g'))].map(m => {
    const tone = /data-tone="([^"]+)"/.exec(m[0])?.[1] ?? '-';
    const variant = /data-variant="([^"]+)"/.exec(m[0])?.[1] ?? '-';
    return `${tone}/${variant}`;
  });
}

test('scopedTone resolves tone and variant', () => {
  assert.deepEqual(scopedTone(null, undefined, 'solid', 'soft'), { tone: undefined, variant: 'solid' });
  assert.deepEqual(scopedTone({ tone: 'danger', variant: 'soft' }, undefined, undefined, 'soft'), { tone: 'danger', variant: 'soft' });
  assert.deepEqual(scopedTone({ tone: 'danger', variant: 'soft' }, undefined, 'solid', 'soft'), { tone: 'danger', variant: 'solid' });
  assert.deepEqual(scopedTone({ tone: 'danger', variant: 'soft' }, 'neutral', 'outline', 'soft'), { tone: 'neutral', variant: 'outline' });
  assert.deepEqual(scopedTone({ tone: 'warning', variant: 'solid' }, undefined, 'ghost', 'soft'), { tone: 'neutral', variant: 'outline' });
});

test('buttons in an alert action take the alert tone', () => {
  const html = renderToStaticMarkup(
    <Alert tone="danger" action={<><IconButton label="Detail">i</IconButton><Button size="xs" variant="solid">Re-register key</Button><Button size="xs">Later</Button></>}>Key does not match.</Alert>,
  );
  assert.deepEqual(tones(html, 'button'), ['danger/solid', 'danger/soft']);
  assert.deepEqual(tones(html, 'icon-button'), ['danger/ghost']);
});

test('an explicit tone wins and the dismiss takes the tone', () => {
  const html = renderToStaticMarkup(
    <Alert tone="warning" dismissible dismissLabel="Dismiss" action={<Button size="xs" tone="neutral" variant="outline">Open</Button>}>Settings file changed.</Alert>,
  );
  assert.deepEqual(tones(html, 'button'), ['neutral/outline']);
  assert.deepEqual(tones(html, 'alert-dismiss'), ['warning/ghost']);
});

test('a solid alert gives the raised neutral button and keeps the icon button', () => {
  const html = renderToStaticMarkup(
    <Alert tone="warning" variant="solid" dismissible dismissLabel="Dismiss" action={<Button size="xs" variant="solid">Upgrade</Button>}>Trial ends.</Alert>,
  );
  assert.deepEqual(tones(html, 'button'), ['neutral/outline']);
  assert.deepEqual(tones(html, 'alert-dismiss'), ['neutral/ghost']);
});

test('outside an alert nothing changes', () => {
  const html = renderToStaticMarkup(<><Button>Save</Button><IconButton label="More">m</IconButton></>);
  assert.deepEqual(tones(html, 'button'), ['neutral/solid']);
  assert.deepEqual(tones(html, 'icon-button'), ['neutral/ghost']);
});
