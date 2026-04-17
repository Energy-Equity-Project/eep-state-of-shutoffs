export function formatCount(n: number): string {
  return Math.round(n).toLocaleString();
}

export function formatDollars(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

export function formatChangePct(pct: number): string {
  const arrow = pct >= 0 ? '↑' : '↓';
  return `${arrow} ${Math.round(Math.abs(pct))}%`;
}

export function formatPercent(rate: number): string {
  return (rate * 100).toFixed(1) + '%';
}

export function formatMultiplier(m: number): string {
  return m.toFixed(1) + '×';
}
