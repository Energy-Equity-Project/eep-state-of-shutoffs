import type { StateNationalRow, Unit } from '../../lib/national';
import RankList from './RankList';

interface Props {
  rows: StateNationalRow[];
  unit: Unit;
  compact?: boolean;
}

export default function ScrollableRankList({ rows, unit, compact }: Props) {
  const maxH = compact ? 'max-h-[260px]' : 'max-h-[460px]';
  const unitLabel = unit === 'rate' ? '%' : 'Count';

  return (
    <div
      className="border border-[--color-border-medium] bg-[--color-surface]"
      style={{ borderRadius: 0 }}
    >
      {/* Sticky header */}
      <div
        className="grid text-[10px] uppercase tracking-[0.12em] text-[--color-text-secondary] border-b border-[--color-ink] px-3 py-2"
        style={{
          gridTemplateColumns: '24px 1fr auto',
          gap: '12px',
          background: '#f8f5eb',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <span>#</span>
        <span>State</span>
        <span>{unitLabel}</span>
      </div>

      {/* Scroll window */}
      <div
        className={`${maxH} overflow-y-auto relative px-3`}
        tabIndex={0}
        aria-label="Ranked state list"
        role="region"
      >
        <RankList rows={rows} unit={unit} compact={compact} />

        {/* Bottom fade */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            height: 24,
            background: 'linear-gradient(to bottom, transparent, var(--color-surface))',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[--color-text-secondary] border-t border-[--color-border-light]"
        style={{ background: '#fbfaf6' }}
      >
        <span>{rows.length} states + DC</span>
        <span>scroll ↓</span>
      </div>
    </div>
  );
}
