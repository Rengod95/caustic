import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const reactSrc = join(root, 'packages/react/src');
export const componentsDir = join(reactSrc, 'components');
export const specsDir = join(root, 'packages/spec/src/specs');
export const reportsDir = process.env.CAUSTIC_REPORTS_DIR ?? join(root, 'packages/gateway/reports');
/** Self-test runs mutate components temporarily and must not record gate results. */
export const selftest = process.env.CAUSTIC_SELFTEST === '1';
export const baselinesDir = join(root, 'baselines');
export const tokensDist = join(root, 'packages/tokens/dist');
/** The approved HTML specimens (visual source of truth until React baselines replace them). */
export const specimenRoot = resolve(root, '../caustic-preview');
