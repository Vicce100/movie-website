export function assertNonNullish<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) throw new Error(message);
}

export function assertsIsDefined(value: unknown | undefined, message: string): asserts value {
  if (value === null || value === undefined) throw new Error(message);
}

export function assertIsNotNullOrUndefined(value: unknown | undefined, message: string): boolean {
  if (value === undefined || null) throw Error(message);
  return true;
}
