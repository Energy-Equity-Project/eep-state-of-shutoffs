import { useState } from 'react';
import type { ShutoffRecord } from '../../data/shutoffs-types';
import { getChartCaption, getBothCaption } from '../../lib/chart-captions';
import { getMonthlyFlags } from '../../lib/shutoffs';
import { FlagFootnote } from './QualityFlag';

type Fuel = 'electric' | 'gas' | 'both';

interface Props {
  stateMonthly: ShutoffRecord[];
  stateName: string;
  stateCode: string;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SVG_W = 720;
const SVG_H = 220;
const PAD_L = 44;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 30;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

const COL_W = PLOT_W / 12;

function toPoints(values: number[], maxVal: number): string {
  return values
    .map((v, i) => {
      const x = PAD_L + (i / 11) * PLOT_W;
      const y = PAD_T + PLOT_H - (v / maxVal) * PLOT_H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function formatYLabel(val: number, isRate: boolean): string {
  if (isRate) return (val * 100).toFixed(1) + '%';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return Math.round(val / 1000) + 'k';
  return String(Math.round(val));
}

const TOOLTIP_W = 160;
const TOOLTIP_LINE_H = 16;
const TOOLTIP_PAD_X = 10;
const TOOLTIP_PAD_Y = 8;

export default function MonthlyChart({ stateMonthly, stateName, stateCode }: Props) {
  const [fuel, setFuel] = useState<Fuel>('electric');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const sorted = [...stateMonthly].sort((a, b) => a.month - b.month);

  const isRate = fuel === 'both';

  let stateVals: number[];
  let stateVals2: number[] | null = null;

  if (fuel === 'electric') {
    stateVals = sorted.map((r) => r.electric_shutoffs ?? 0);
  } else if (fuel === 'gas') {
    stateVals = sorted.map((r) => r.gas_shutoffs ?? 0);
  } else {
    stateVals = sorted.map((r) => r.electric_monthly_shutoff_rate);
    stateVals2 = sorted.map((r) => r.gas_monthly_shutoff_rate);
  }

  const allVals = [...stateVals, ...(stateVals2 ?? [])];
  const maxVal = Math.max(...allVals, 0.0001);

  const statePts = toPoints(stateVals, maxVal);
  const statePts2 = stateVals2 ? toPoints(stateVals2, maxVal) : null;

  // Y axis grid lines (4 lines)
  const gridLines = [0.25, 0.5, 0.75, 1].map((pct) => ({
    y: PAD_T + PLOT_H - pct * PLOT_H,
    label: formatYLabel(maxVal * pct, isRate),
  }));

  const caption = fuel === 'both'
    ? getBothCaption()
    : getChartCaption(sorted, fuel as 'electric' | 'gas');

  const cardFlags = fuel === 'both'
    ? new Set([
        ...getMonthlyFlags(stateCode, 'electric', ['shutoffs']),
        ...getMonthlyFlags(stateCode, 'gas', ['shutoffs']),
      ])
    : getMonthlyFlags(stateCode, fuel as 'electric' | 'gas', ['shutoffs']);

  const circleColor = fuel === 'gas' ? '#888780' : '#185fa5';
  const stateLineColor = fuel === 'gas' ? '#888780' : '#185fa5';

  const titleText = fuel === 'both'
    ? `Monthly electric and gas shutoff rates in ${stateName}, 2024`
    : `Monthly ${fuel} shutoffs in ${stateName}, 2024`;

  // Tooltip rendering
  function renderTooltip(idx: number) {
    const record = sorted[idx];
    const monthName = new Date(2024, idx, 1).toLocaleString('en-US', { month: 'long' });
    const label1 = `${monthName} 2024`;

    let lines: string[];
    if (fuel === 'electric') {
      const raw = record?.electric_shutoffs;
      lines = [label1, raw == null ? 'No data' : `${raw.toLocaleString()} electric shutoffs`];
    } else if (fuel === 'gas') {
      const raw = record?.gas_shutoffs;
      lines = [label1, raw == null ? 'No data' : `${raw.toLocaleString()} gas shutoffs`];
    } else {
      const elecRate = stateVals[idx];
      const gasRate = stateVals2![idx];
      lines = [
        label1,
        `Electric: ${formatYLabel(elecRate, true)}`,
        `Gas: ${formatYLabel(gasRate, true)}`,
      ];
    }

    const tooltipH = TOOLTIP_PAD_Y * 2 + lines.length * TOOLTIP_LINE_H;

    // Anchor tooltip above topmost dot
    const dotX = PAD_L + (idx / 11) * PLOT_W;
    const dotY = PAD_T + PLOT_H - (stateVals[idx] / maxVal) * PLOT_H;

    // Clamp X so tooltip stays inside SVG
    let tx = dotX - TOOLTIP_W / 2;
    tx = Math.max(PAD_L, Math.min(tx, SVG_W - PAD_R - TOOLTIP_W));

    // Place above dot; flip below if it would clip the top
    let ty = dotY - tooltipH - 8;
    if (ty < PAD_T) ty = dotY + 8;

    return (
      <g pointerEvents="none">
        <rect
          x={tx}
          y={ty}
          width={TOOLTIP_W}
          height={tooltipH}
          rx="5"
          ry="5"
          fill="var(--color-ink)"
          opacity="0.92"
        />
        {lines.map((line, li) => (
          <text
            key={li}
            x={tx + TOOLTIP_PAD_X}
            y={ty + TOOLTIP_PAD_Y + li * TOOLTIP_LINE_H + 10}
            fontSize={li === 0 ? 10 : 10}
            fontWeight={li === 0 ? 600 : 400}
            fill="var(--color-surface)"
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  return (
    <div className="bg-[--color-surface] border border-[--color-border-light] rounded-xl px-6 py-5 mb-6">
      <div className="flex justify-between items-baseline mb-1">
        <h2 className="text-base font-medium">Monthly pattern in 2024</h2>
        <div className="flex gap-4 text-xs text-[--color-text-secondary]">
          {fuel !== 'gas' && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-0.5" style={{ background: '#185fa5' }} />
              Electric
            </span>
          )}
          {fuel !== 'electric' && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-0.5" style={{ background: '#888780' }} />
              Gas
            </span>
          )}
        </div>
      </div>
      <p className="text-[13px] text-[--color-text-secondary] mb-3 max-w-xl">{caption}</p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        className="w-full h-auto block"
        aria-label={titleText}
      >
        <title>{titleText}</title>
        {/* Grid lines */}
        <g stroke="rgba(10,10,10,0.1)" strokeWidth="0.5">
          {gridLines.map((gl) => (
            <line key={gl.y} x1={PAD_L} y1={gl.y} x2={SVG_W - PAD_R} y2={gl.y} />
          ))}
        </g>
        {/* Y labels */}
        <g fontSize="10" fill="#888780">
          {gridLines.map((gl) => (
            <text key={gl.y} x={PAD_L - 4} y={gl.y + 3} textAnchor="end">{gl.label}</text>
          ))}
        </g>
        {/* State line */}
        <polyline fill="none" stroke={stateLineColor} strokeWidth="2" points={statePts} />
        {/* Gas state line (both mode) */}
        {statePts2 && (
          <polyline fill="none" stroke="#888780" strokeWidth="1.5" points={statePts2} />
        )}
        {/* Vertical guide line for hovered month */}
        {hoverIdx !== null && (
          <line
            x1={(PAD_L + (hoverIdx / 11) * PLOT_W).toFixed(1)}
            y1={PAD_T}
            x2={(PAD_L + (hoverIdx / 11) * PLOT_W).toFixed(1)}
            y2={PAD_T + PLOT_H}
            stroke="rgba(10,10,10,0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}
        {/* State dots */}
        <g fill={stateLineColor}>
          {stateVals.map((v, i) => {
            const x = PAD_L + (i / 11) * PLOT_W;
            const y = PAD_T + PLOT_H - (v / maxVal) * PLOT_H;
            const r = hoverIdx === i ? 4 : 2.5;
            return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} />;
          })}
        </g>
        {/* Gas dots (both mode) */}
        {stateVals2 && (
          <g fill="#888780">
            {stateVals2.map((v, i) => {
              const x = PAD_L + (i / 11) * PLOT_W;
              const y = PAD_T + PLOT_H - (v / maxVal) * PLOT_H;
              const r = hoverIdx === i ? 4 : 2.5;
              return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} />;
            })}
          </g>
        )}
        {/* Tooltip */}
        {hoverIdx !== null && renderTooltip(hoverIdx)}
        {/* Hit areas — transparent rects covering each month column */}
        <g onMouseLeave={() => setHoverIdx(null)}>
          {MONTH_LABELS.map((_, i) => {
            const x = PAD_L + i * COL_W - COL_W / 2;
            return (
              <rect
                key={i}
                x={x.toFixed(1)}
                y={PAD_T}
                width={COL_W.toFixed(1)}
                height={PLOT_H}
                fill="transparent"
                style={{ pointerEvents: 'all', cursor: 'crosshair' }}
                onMouseEnter={() => setHoverIdx(i)}
                onFocus={() => setHoverIdx(i)}
              />
            );
          })}
        </g>
        {/* X axis month labels */}
        <g fontSize="10" fill="#888780" textAnchor="middle">
          {MONTH_LABELS.map((m, i) => {
            const x = PAD_L + (i / 11) * PLOT_W;
            return <text key={m} x={x.toFixed(1)} y={SVG_H - 4}>{m}</text>;
          })}
        </g>
      </svg>

      <FlagFootnote flags={cardFlags} />

      <div className="flex gap-3 mt-3.5 pt-3.5 border-t border-[--color-border-light]">
        {(['electric', 'gas', 'both'] as Fuel[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFuel(f)}
            style={
              fuel === f
                ? { backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)', borderColor: 'var(--color-ink)' }
                : undefined
            }
            className={`text-[13px] px-3 py-1.5 rounded-lg border focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors ${
              fuel !== f ? 'border-[--color-border-light] text-[--color-text-secondary]' : ''
            }`}
          >
            {f === 'electric' ? 'Electric' : f === 'gas' ? 'Gas' : 'Both'}
          </button>
        ))}
      </div>
    </div>
  );
}
