// Type-only guard: both sets export the same names, so switching the set never breaks a call site. Checked by typecheck, never imported.
import type * as Phosphor from './phosphor.ts';
import type * as Solar from './solar.ts';

type Same<A, B> = [Exclude<keyof A, keyof B>, Exclude<keyof B, keyof A>] extends [never, never] ? true : { onlyInFirst: Exclude<keyof A, keyof B>; onlyInSecond: Exclude<keyof B, keyof A> };

export const iconSetParity: Same<typeof Phosphor, typeof Solar> = true;
