import type { CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { CompareView, type CompareViewProps } from './compare-view.tsx';

/** Demo art: an artboard with three bars and a button bar. The radii and the button color are art data (custom properties). */
const Art = ({ radius, buttonRadius, button, padded = false }: { radius: string; buttonRadius: string; button: string; padded?: boolean }) => (
  <div
    className={cn('grid h-[70%] w-[66%] content-start gap-2 rounded-(--r) bg-canvas-artboard shadow-artboard', padded ? 'p-5' : 'p-3.5')}
    style={{ '--r': radius, '--rb': buttonRadius, '--btn': button, '--bar': 'oklch(.2 .02 50 / .12)' } as CSSProperties}
  >
    <i className="h-2 w-[40%] rounded-xs bg-(--bar)" />
    <i className="h-2 w-[70%] rounded-xs bg-(--bar)" />
    <i className="h-2 w-[60%] rounded-xs bg-(--bar)" />
    <b className="mt-1.5 h-5.5 w-1/2 rounded-(--rb) bg-(--btn)" />
  </div>
);

const Compare = (props: Partial<CompareViewProps>) => (
  <CompareView
    aria-label="Before and after" beforeLabel="v2.3" afterLabel="Now"
    before={<Art radius="10px" buttonRadius="6px" button="oklch(.22 .02 50)" />}
    after={<Art radius="20px" buttonRadius="999px" button="oklch(.56 .16 42)" padded />}
    {...props}
  />
);

export default defineFixture({
  id: 'compare-view',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Compare {...(props as Partial<CompareViewProps>)} />,
  examples: {
    'visual-comparison': () => <Compare />,
  },
});
