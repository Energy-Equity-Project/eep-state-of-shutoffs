import type { StateNationalRow, Unit } from '../../lib/national';

interface Props {
  rows: StateNationalRow[];
  unit: Unit;
  compact?: boolean;
}

function formatValue(row: StateNationalRow, unit: Unit): string {
  if (unit === 'rate') return `${row.rateValue.toFixed(1)}%`;
  const n = row.countValue;
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  return `${Math.round(n / 1000)}k`;
}

export default function RankList({ rows, unit, compact }: Props) {
  const maxValue = rows.length > 0 ? rows[0].value : 1;
  const py = compact ? 'py-1.5' : 'py-[9px]';

  return (
    <div>
      {rows.map((row, idx) => {
        const barPct = maxValue > 0 ? (row.value / maxValue) * 100 : 0;
        const useWarnColor = row.rateValue >= 9;

        return (
          <div
            key={row.st}
            className={`grid items-center border-b border-[--color-border-light] ${py}`}
            style={{ gridTemplateColumns: '24px 1fr auto', gap: '12px' }}
          >
            {/* Rank */}
            <span
              className="text-[14px] text-[--color-text-secondary] text-right tabular-nums"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {idx + 1}
            </span>

            {/* State + bar */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[11px] text-[--color-text-secondary] flex-shrink-0"
                  style={{ width: 22 }}
                >
                  {row.st}
                </span>
                <span className="text-[13px] text-[--color-ink] truncate">{row.name}</span>
              </div>
              {/* Bar track */}
              <div
                style={{
                  maxWidth: 180,
                  height: 6,
                  background: 'var(--color-neutral-bar-light)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${barPct}%`,
                    height: '100%',
                    background: useWarnColor ? 'var(--color-warn)' : 'var(--color-ink)',
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>

            {/* Value */}
            <span
              className="text-[14px] text-[--color-ink] text-right tabular-nums"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {formatValue(row, unit)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
