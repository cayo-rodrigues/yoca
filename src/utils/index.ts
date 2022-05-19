export const roundToTwo = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;
