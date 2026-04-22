import type { Fuel, Metric, Unit } from '../../lib/national-constants';
import { getBreakpoints } from '../../lib/national-constants';
import { formatCondensed } from '../../lib/format';

// [state_code, row, col]
const HEX_COORDS: [string, number, number][] = [
  ['AK', 0, 0], ['ME', 0, 10],
  ['VT', 1, 9], ['NH', 1, 10],
  ['WA', 2, 1], ['ID', 2, 2], ['MT', 2, 3], ['ND', 2, 4], ['MN', 2, 5],
  ['WI', 2, 6], ['MI', 2, 7], ['NY', 2, 8], ['MA', 2, 9], ['CT', 2, 10], ['RI', 2, 11],
  ['OR', 3, 1], ['NV', 3, 2], ['WY', 3, 3], ['SD', 3, 4], ['IA', 3, 5],
  ['IL', 3, 6], ['IN', 3, 7], ['OH', 3, 8], ['PA', 3, 9], ['NJ', 3, 10],
  ['CA', 4, 1], ['UT', 4, 2], ['CO', 4, 3], ['NE', 4, 4], ['MO', 4, 5],
  ['KY', 4, 6], ['WV', 4, 7], ['VA', 4, 8], ['MD', 4, 9], ['DE', 4, 10],
  ['AZ', 5, 2], ['NM', 5, 3], ['KS', 5, 4], ['AR', 5, 5], ['TN', 5, 6],
  ['NC', 5, 7], ['SC', 5, 8], ['DC', 5, 9],
  ['HI', 6, 0], ['OK', 6, 4], ['LA', 6, 5], ['MS', 6, 6], ['AL', 6, 7], ['GA', 6, 8],
  ['TX', 7, 4], ['FL', 7, 8],
];

const RAMP = ['#f0ecdc', '#e4d7a6', '#d6b57c', '#c97568', '#8a3328'];
const LABEL_FILL = ['#5f5e5a', '#5f5e5a', '#ffffff', '#ffffff', '#ffffff'];

function getBucket(value: number, thresholds: [number, number, number, number]): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) return i;
  }
  return 4;
}

function formatBreakpoint(value: number, unit: Unit): string {
  if (unit === 'rate') return `${value % 1 === 0 ? value : value.toFixed(1)}%`;
  return formatCondensed(value);
}

function buildLegendLabels(thresholds: [number, number, number, number], unit: Unit): string[] {
  return [
    `<${formatBreakpoint(thresholds[0], unit)}`,
    `${formatBreakpoint(thresholds[0], unit)}–${formatBreakpoint(thresholds[1], unit)}`,
    `${formatBreakpoint(thresholds[1], unit)}–${formatBreakpoint(thresholds[2], unit)}`,
    `${formatBreakpoint(thresholds[2], unit)}–${formatBreakpoint(thresholds[3], unit)}`,
    `${formatBreakpoint(thresholds[3], unit)}+`,
  ];
}

function hexPoints(cx: number, cy: number, r: number): string {
  return [30, 90, 150, 210, 270, 330]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return `${(cx + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');
}

interface HexDatum {
  st: string;
  value: number;
}

interface Props {
  data: HexDatum[];
  fuel: Fuel;
  metric: Metric;
  size?: number;
  unit: Unit;
  onHexClick?: (st: string) => void;
}

export default function HexMap({ data, fuel, metric, size = 28, unit, onHexClick }: Props) {
  const sqrt3 = Math.sqrt(3);
  const colW = sqrt3 * size;
  const rowH = 1.5 * size;
  const pad = size;

  const thresholds = getBreakpoints(fuel, metric, unit);
  const legendLabels = buildLegendLabels(thresholds, unit);

  const valueMap = new Map(data.map((d) => [d.st, d.value]));

  const hexes = HEX_COORDS.map(([st, row, col]) => {
    const offsetX = row % 2 === 0 ? (sqrt3 / 2) * size : 0;
    const cx = col * colW + offsetX + pad;
    const cy = row * rowH + size + pad;
    return { st, row, col, cx, cy };
  });

  const maxCx = Math.max(...hexes.map((h) => h.cx)) + size + pad;
  const maxCy = Math.max(...hexes.map((h) => h.cy)) + size + pad;

  const buckets = hexes.map((h) => getBucket(valueMap.get(h.st) ?? 0, thresholds));

  const ranked = [...hexes.map((h, i) => ({ i, v: valueMap.get(h.st) ?? 0 }))]
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map((x) => x.i);
  const leaderSet = new Set(ranked);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${maxCx.toFixed(0)} ${maxCy.toFixed(0)}`}
        style={{ width: '100%', display: 'block' }}
        aria-label="Hex tile map of the United States"
        role="img"
      >
        {hexes.map((h, i) => {
          const bucket = buckets[i];
          const fill = RAMP[bucket];
          const labelColor = LABEL_FILL[bucket];
          const isLeader = leaderSet.has(i);
          const val = valueMap.get(h.st) ?? 0;
          const ariaLabel =
            unit === 'rate'
              ? `${h.st}: ${val.toFixed(1)}%`
              : `${h.st}: ${Math.round(val / 1000)}k`;

          return (
            <g
              key={h.st}
              role="button"
              tabIndex={0}
              aria-label={ariaLabel}
              onClick={() => onHexClick?.(h.st)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onHexClick?.(h.st);
                }
              }}
              style={{ cursor: onHexClick ? 'pointer' : 'default' }}
            >
              <polygon
                points={hexPoints(h.cx, h.cy, size - 1)}
                fill={fill}
                stroke={isLeader ? 'var(--color-ink)' : 'var(--color-border-medium)'}
                strokeWidth={isLeader ? 2 : 0.8}
                onMouseEnter={(e) => {
                  if (!isLeader) (e.currentTarget as SVGElement).setAttribute('stroke', 'var(--color-ink)');
                }}
                onMouseLeave={(e) => {
                  if (!isLeader) (e.currentTarget as SVGElement).setAttribute('stroke', 'var(--color-border-medium)');
                }}
              />
              <text
                x={h.cx}
                y={h.cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={labelColor}
                fontSize={size < 24 ? 8 : 10}
                fontFamily="var(--font-sans)"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {h.st}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-[--color-text-secondary]">
        {RAMP.map((color, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 10,
                background: color,
                border: '1px solid var(--color-border-light)',
                borderRadius: 2,
              }}
            />
            {legendLabels[i]}
          </span>
        ))}
        <span className="ml-auto italic">Click on the state tiles to view their state profile.</span>
      </div>

      <figcaption className="sr-only">
        Hex tile map showing values by state, 2024.
      </figcaption>
    </figure>
  );
}
