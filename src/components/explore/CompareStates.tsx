import { useState, useEffect } from 'react';
import {
  STATE_CODES,
  getStateAnnual,
  getNationalRank,
  getNationalElectricRate,
  getNationalGasRate,
  getHighestRateState,
  getNeighbor,
  getMonthlyFlags,
  type EiaFlag,
} from '../../lib/shutoffs';
import { formatPercent } from '../../lib/format';
import { FlagAsterisk, FlagFootnote } from './QualityFlag';
import StatePickerSheet from './StatePickerSheet';
import SegmentedControl from './SegmentedControl';
import type { PillOption } from './SegmentedControl';

type Fuel = 'electric' | 'gas';

const FUEL_OPTIONS: PillOption<Fuel>[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'gas', label: 'Gas' },
];

interface Props {
  currentCode: string;
}

interface CompareRow {
  code: string | null; // null = national
  name: string;
  rate: number;
  rank: number | null;
  tag?: string;
}

const MAX_EXTRA = 5;

function buildDefaultRows(currentCode: string, fuel: 'electric' | 'gas'): CompareRow[] {
  const neighborCode = getNeighbor(currentCode);
  const highest = getHighestRateState(fuel);
  const rows: CompareRow[] = [];

  // Current state
  const cur = getStateAnnual(currentCode);
  rows.push({
    code: currentCode,
    name: STATE_CODES[currentCode] ?? currentCode,
    rate: cur[`${fuel}_annual_shutoff_rate`],
    rank: getNationalRank(currentCode, fuel),
  });

  // National average
  rows.push({
    code: null,
    name: 'National average',
    rate: fuel === 'electric' ? getNationalElectricRate() : getNationalGasRate(),
    rank: null,
  });

  // Neighbor
  if (neighborCode && neighborCode !== currentCode) {
    const n = getStateAnnual(neighborCode);
    rows.push({
      code: neighborCode,
      name: STATE_CODES[neighborCode] ?? neighborCode,
      rate: n[`${fuel}_annual_shutoff_rate`],
      rank: getNationalRank(neighborCode, fuel),
      tag: 'neighbor',
    });
  }

  // Highest rate state (skip if it's already the current state)
  if (highest.code !== currentCode) {
    rows.push({
      code: highest.code,
      name: highest.name,
      rate: highest.rate,
      rank: 1,
      tag: 'highest',
    });
  }

  return rows;
}

function parseCompareParam(): string[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  return params
    .get('compare')
    ?.split(',')
    .filter((c) => c && STATE_CODES[c]) ?? [];
}

export default function CompareStates({ currentCode }: Props) {
  const [extraCodes, setExtraCodes] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fuel, setFuel] = useState<Fuel>('electric');

  useEffect(() => {
    setExtraCodes(parseCompareParam());
  }, []);

  function updateUrl(codes: string[]) {
    const params = new URLSearchParams(window.location.search);
    if (codes.length > 0) {
      params.set('compare', codes.join(','));
    } else {
      params.delete('compare');
    }
    history.replaceState(null, '', `${window.location.pathname}${codes.length ? '?' + params.toString() : ''}`);
  }

  function addState(code: string) {
    if (extraCodes.includes(code) || code === currentCode) return;
    const next = [...extraCodes, code].slice(0, MAX_EXTRA);
    setExtraCodes(next);
    updateUrl(next);
    setSheetOpen(false);
  }

  function removeState(code: string) {
    const next = extraCodes.filter((c) => c !== code);
    setExtraCodes(next);
    updateUrl(next);
  }

  const defaultRows = buildDefaultRows(currentCode, fuel);

  const extraRows: CompareRow[] = extraCodes
    .filter((c) => !defaultRows.some((r) => r.code === c))
    .map((code) => {
      const a = getStateAnnual(code);
      return {
        code,
        name: STATE_CODES[code] ?? code,
        rate: a[`${fuel}_annual_shutoff_rate`],
        rank: getNationalRank(code, fuel),
      };
    });

  const allRows = [...defaultRows, ...extraRows];
  const trueMax = Math.max(...allRows.map((r) => r.rate).filter(Number.isFinite), 0.0001);
  const canAdd = extraCodes.length < MAX_EXTRA;

  const flagsByCode = new Map<string, Set<EiaFlag>>();
  for (const row of allRows) {
    if (row.code) flagsByCode.set(row.code, getMonthlyFlags(row.code, fuel, ['shutoffs']));
  }
  const cardFlags = new Set<EiaFlag>();
  flagsByCode.forEach((s) => s.forEach((f) => cardFlags.add(f)));

  const alreadyInList = new Set([
    ...allRows.map((r) => r.code).filter(Boolean) as string[],
  ]);

  return (
    <div className="bg-white border border-[--color-border-light] px-6 py-5 mb-6">
      <div className="flex justify-between items-baseline mb-1">
        <h2 className="text-base font-medium">Compare to other states</h2>
        {canAdd && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="text-xs px-2.5 py-1 border border-[--color-border-light] text-[--color-text-secondary] hover:border-[--color-border-medium] focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors"
          >
            + Add state
          </button>
        )}
      </div>
      <p className="text-[13px] text-[--color-text-secondary] mb-3">{fuel === 'electric' ? 'Electric' : 'Gas'} annual shutoff rate, 2024.</p>

      <div className="mb-4">
        <SegmentedControl<Fuel>
          options={FUEL_OPTIONS}
          value={fuel}
          onChange={setFuel}
        />
      </div>

      <div>
        {allRows.map((row, i) => {
          const isCurrent = row.code === currentCode;
          const barWidth = `${((row.rate / trueMax) * 100).toFixed(1)}%`;
          const isExtra = extraCodes.includes(row.code ?? '');

          return (
            <div
              key={row.code ?? 'national'}
              className="grid grid-cols-[140px_1fr_56px_44px] gap-3 items-center py-2 border-b border-[--color-border-light] last:border-b-0"
            >
              <span className={`text-[13px] flex items-center gap-1 ${isCurrent ? 'font-medium' : ''}`}>
                {row.code ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCurrent) window.location.href = `/explore/${row.code}`;
                    }}
                    className={`focus-visible:outline-2 focus-visible:outline-[--color-accent] rounded ${
                      isCurrent ? 'text-[--color-accent] cursor-default' : 'hover:underline'
                    }`}
                    disabled={isCurrent}
                  >
                    {row.name}
                  </button>
                ) : (
                  <span>{row.name}</span>
                )}
                {row.tag && (
                  <span className="text-[--color-text-tertiary] text-[11px]">({row.tag})</span>
                )}
                {isExtra && (
                  <button
                    type="button"
                    onClick={() => removeState(row.code!)}
                    aria-label={`Remove ${row.name}`}
                    className="text-[--color-text-tertiary] text-xs ml-0.5 focus-visible:outline-2 focus-visible:outline-[--color-accent] rounded"
                  >
                    ×
                  </button>
                )}
              </span>

              <div className="h-4 bg-[--color-muted] rounded-sm overflow-hidden">
                {Number.isFinite(row.rate) && (
                  <div
                    className={`h-full ${isCurrent ? 'bg-[--color-accent]' : 'bg-[--color-neutral-bar]'}`}
                    style={{ width: barWidth }}
                  />
                )}
              </div>

              <span className="text-[13px] text-right">
                {Number.isFinite(row.rate) ? formatPercent(row.rate) : '—'}
                {row.code && flagsByCode.get(row.code)?.size ? <FlagAsterisk /> : null}
              </span>
              <span className="text-xs text-[--color-text-tertiary] text-right">
                {row.rank != null ? `#${row.rank}` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      <FlagFootnote flags={cardFlags} />

      {sheetOpen && (
        <StatePickerSheet
          title="Add a state to compare"
          currentCode={currentCode}
          mode="add"
          onSelect={addState}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
