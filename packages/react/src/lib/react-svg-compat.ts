// lucide-react 0.468 declares `import { ReactSVG } from 'react'`, a type @types/react 19 no longer exports. Compilers that check
// declaration files (skipLibCheck: false, as Axiom's root profile does) report TS2305 for it. This declaration restores the
// name with an open tag map; it is type-only, emits no runtime code and is loaded through lib/cn.ts, which every component imports.
// Remove it once lucide-react is upgraded to a release with React 19 typings.
import 'react';

declare module 'react' {
  interface ReactSVG {
    [tag: string]: unknown;
  }
}
