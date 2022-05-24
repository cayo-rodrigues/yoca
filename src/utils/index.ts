export const roundToTwo = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;

export const normalizeTextInput = (s: string) => s.toLowerCase().trim();

export const MAX_DECIMAL = 99999999.99;

export const MAX_INT = 2147483647;
