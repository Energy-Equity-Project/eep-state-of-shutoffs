export function formatCount(n: number): string {
  return Math.round(n).toLocaleString();
}

export function formatPercent(rate: number): string {
  return (rate * 100).toFixed(1) + '%';
}

export function formatMultiplier(m: number): string {
  return m.toFixed(1) + '×';
}
