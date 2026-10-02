type Defined<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/**
 * Drops keys whose value is undefined, so the result can be spread onto props that forbid an explicit `undefined`
 * (exactOptionalPropertyTypes). Third-party components such as Radix roots treat an absent key and `undefined` alike.
 */
export function defined<T extends Record<string, unknown>>(props: T): Defined<T> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(props)) if (props[key] !== undefined) out[key] = props[key];
  return out as Defined<T>;
}
