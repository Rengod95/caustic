import type { ReactNode } from 'react';

/**
 * A fixture tells the gateway harness how to render a component.
 * - render(props): one instance for generated cases (variant × size × state) and scenarios.
 *   Event props (onClick, onValueChange…) are injected by the harness to record calls.
 * - examples: one renderer per spec example id; each must reproduce the approved specimen.
 */
export interface Fixture {
  id: string;
  render: (props: Record<string, unknown>) => ReactNode;
  examples: Record<string, () => ReactNode>;
  /** Optional wrapper for cases (e.g. a fixed-width column or an open overlay container). */
  frame?: (children: ReactNode) => ReactNode;
}

export const defineFixture = (f: Fixture) => f;
