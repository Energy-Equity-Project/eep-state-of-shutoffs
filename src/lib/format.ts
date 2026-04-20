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

export function formatPctDiffVsNational(m: number): string {
  const pct = Math.round(Math.abs(m - 1) * 100);
  if (pct === 0) return 'equal to';
  return m < 1 ? `${pct}% less than` : `${pct}% more than`;
}

export function formatCondensed(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 10_000_000) return `${Math.round(n / 1e6)}M`;
  if (n >= 1_000_000) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return formatCount(n);
}
