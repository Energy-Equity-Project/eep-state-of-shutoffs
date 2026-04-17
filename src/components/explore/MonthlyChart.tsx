import { useState } from 'react';
import type { ShutoffRecord } from '../../data/shutoffs-types';
import { getChartCaption, getBothCaption } from '../../lib/chart-captions';

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

export default function MonthlyChart({ stateMonthly, stateName, stateCode }: Props) {
  const [fuel, setFuel] = useState<Fuel>('electric');

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
    : getChartCaption(sorted, fuel as 'electric' | 'gas', stateCode);

  const circleColor = fuel === 'gas' ? '#888780' : '#185fa5';
  const stateLineColor = fuel === 'gas' ? '#888780' : '#185fa5';

  const titleText = fuel === 'both'
    ? `Monthly electric and gas shutoff rates in ${stateName}, 2024`
    : `Monthly ${fuel} shutoffs in ${stateName}, 2024`;

  return (
    <div className="bg-[--color-surface] border border-[--color-border-light] rounded-xl px-6 py-5 mb-6">
      <div className="flex justify-between items-baseline mb-1">
        <h2 className="text-base font-medium">Monthly pattern in 2024</h2>
        <div className="flex gap-4 text-xs text-[--color-text-secondary]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-0.5" style={{ background: stateLineColor }} />
            {stateName}
          </span>
          {fuel === 'both' && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-0.5" style={{ background: '#888780' }} />
              {stateName} (gas)
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
        {/* State dots */}
        <g fill={stateLineColor}>
          {stateVals.map((v, i) => {
            const x = PAD_L + (i / 11) * PLOT_W;
            const y = PAD_T + PLOT_H - (v / maxVal) * PLOT_H;
            return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5" />;
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

      <div className="flex gap-3 mt-3.5 pt-3.5 border-t border-[--color-border-light]">
        {(['electric', 'gas', 'both'] as Fuel[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFuel(f)}
            className={`text-[13px] px-3 py-1.5 rounded-lg border focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors ${
              fuel === f
                ? 'border-[--color-border-medium] text-[--color-ink]'
                : 'border-[--color-border-light] text-[--color-text-secondary] bg-transparent'
            }`}
          >
            {f === 'electric' ? 'Electric' : f === 'gas' ? 'Gas' : 'Both'}
          </button>
        ))}
      </div>
    </div>
  );
}
