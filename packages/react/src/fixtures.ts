// Fixture registry for the gateway harness and docs. One line per component.
import type { Fixture } from './lib/fixture.ts';
import button from './components/button/button.fixture.tsx';

export const fixtures: Record<string, Fixture> = {
  button,
};
