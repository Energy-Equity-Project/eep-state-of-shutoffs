import { useState } from 'react';
import { getPipelineData, type PipelineStage } from '../../lib/pipeline';
import { formatCount, formatCondensed } from '../../lib/format';
import { computeMonthlyFlags } from '../../lib/shutoffs-constants';
import type { StateAnnual, ShutoffRecord } from '../../data/shutoffs-types';
import { FlagAsterisk, FlagFootnote } from './QualityFlag';
import SegmentedControl from './SegmentedControl';
import type { PillOption } from './SegmentedControl';

type Fuel = 'electric' | 'gas';

const FUEL_OPTIONS: PillOption<Fuel>[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'gas', label: 'Gas' },
];

interface Props {
  stateAnnual: StateAnnual;
  stateMonthly: ShutoffRecord[];
  households: number | null;
  stateName: string;
}

const MIN_AREA_PCT = 0.015;

function scaledSize(value: number | null, maxValue: number): number {
  if (value == null) return 0;
  return Math.max(Math.sqrt(value / maxValue), Math.sqrt(MIN_AREA_PCT));
}

// SVG layout constants
const SVG_W = 920;
const SVG_H = 360;
const BASELINE_Y = 310;
const STAGE_SPACING = 210;
const STAGE01_X = 30;

const DESKTOP_BOX_MIN_W = 52;
const DESKTOP_BOX_MIN_H = 86;
const DESKTOP_BOX_MAX_W = 162;
const DESKTOP_BOX_MAX_H = 270;

function desktopBoxDims(value: number | null, maxValue: number) {
  if (value == null || maxValue <= 0) {
    return { w: DESKTOP_BOX_MIN_W, h: DESKTOP_BOX_MIN_H };
  }
  const scale = Math.sqrt(Math.min(value / maxValue, 1));
  const h = Math.max(Math.round(DESKTOP_BOX_MAX_H * scale), DESKTOP_BOX_MIN_H);
  const w = Math.max(Math.round(DESKTOP_BOX_MAX_W * scale), DESKTOP_BOX_MIN_W);
  return { w, h };
}

function stageColor(stage: PipelineStage): string {
  if (stage.emphasis === 'warn') return 'var(--color-pipeline-warn)';
  if (stage.id === 'reconnected') return 'var(--color-pipeline-reconnect)';
  return 'var(--color-pipeline-fill)';
}

export default function ShutoffPipeline({ stateAnnual, stateMonthly, households, stateName }: Props) {
  const [fuel, setFuel] = useState<Fuel>('electric');
  const { stages, maxValue } = getPipelineData(stateAnnual, households, fuel);
  const noticesFlags = computeMonthlyFlags(stateMonthly, fuel, ['shutoff_notices']);
  const shutoffsFlags = computeMonthlyFlags(stateMonthly, fuel, ['shutoffs']);
  const reconnectionsFlags = computeMonthlyFlags(stateMonthly, fuel, ['reconnections']);
  const cardFlags = computeMonthlyFlags(stateMonthly, fuel, ['shutoff_notices', 'shutoffs', 'reconnections']);

  const householdsStage = stages.find((s) => s.id === 'households');
  const noticesStage = stages.find((s) => s.id === 'notices');
  const shutoffsStage = stages.find((s) => s.id === 'shutoffs');
  const reconnectedStage = stages.find((s) => s.id === 'reconnected');
  const neverStage = stages.find((s) => s.id === 'never_reconnected');

  const shutoffs = shutoffsStage?.value ?? 0;
  const neverReconnected = neverStage?.value ?? null;
  const notices = noticesStage?.value ?? null;

  const hasReconnections = reconnectedStage != null && neverStage != null;

  let caption: string;
  if (hasReconnections && neverReconnected != null) {
    const pct = shutoffs > 0 ? Math.round((neverReconnected / shutoffs) * 100) : 0;
    caption = `Of ${formatCount(shutoffs)} shutoffs executed, ${formatCount(neverReconnected)} (${pct}%) were never followed by a reconnection in 2024.`;
  } else {
    caption = `Utilities in ${stateName} sent ${formatCount(notices ?? 0)} shutoff notices and executed ${formatCount(shutoffs)} ${fuel} shutoffs in 2024.`;
  }

  // Build aria label
  const ariaLabel = stages
    .map((s) => `${s.label}: ${s.value != null ? formatCount(s.value) : 'data not available'}`)
    .join('. ');

  // Desktop SVG rendering
  const mainStages = stages.filter((s) =>
    s.id === 'households' || s.id === 'notices' || s.id === 'shutoffs'
  );

  const svgBoxes: Array<{
    stage: PipelineStage;
    x: number;
    y: number;
    w: number;
    h: number;
  }> = mainStages.map((stage, i) => {
    const { w, h } = desktopBoxDims(stage.value, maxValue);
    const x = STAGE01_X + i * STAGE_SPACING;
    const y = BASELINE_Y - h;
    return { stage, x, y, w, h };
  });

  const shutoffsBox = svgBoxes.find((b) => b.stage.id === 'shutoffs');

  // 04A and 04B boxes positioned to the right of shutoffs box
  const SPLIT_X = shutoffsBox ? shutoffsBox.x + shutoffsBox.w + 60 : 700;
  const splitMid = BASELINE_Y - (shutoffsBox ? shutoffsBox.h / 2 : 150);

  const reconnectedBox = reconnectedStage
    ? (() => {
        const { w, h } = desktopBoxDims(reconnectedStage.value, maxValue);
        const y = splitMid - h - 8;
        return { stage: reconnectedStage, x: SPLIT_X, y, w, h };
      })()
    : null;

  const neverBox = neverStage
    ? (() => {
        const { w, h } = desktopBoxDims(neverStage.value, maxValue);
        const y = splitMid + 8;
        return { stage: neverStage, x: SPLIT_X, y, w, h };
      })()
    : null;

  return (
    <div className="bg-white border border-[--color-border-light] px-6 py-5 mb-6">
      <h2 className="text-base font-medium mb-1">The shutoff pipeline, to scale</h2>
      <p className="text-[13px] text-[--color-text-secondary] mb-3 max-w-xl">{caption}</p>

      {/* Fuel toggle */}
      <div className="mb-4">
        <SegmentedControl<Fuel>
          options={FUEL_OPTIONS}
          value={fuel}
          onChange={setFuel}
        />
      </div>

      {/* Desktop SVG view */}
      <div className="hidden md:block overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width={SVG_W}
          height={SVG_H}
          role="img"
          aria-label={ariaLabel}
          className="max-w-full"
        >
          <title>{ariaLabel}</title>

          {svgBoxes.map(({ stage, x, y, w, h }) => (
            <g key={stage.id}>
              {/* Eyebrow + label above box */}
              <text
                x={x + w / 2}
                y={y - 28}
                textAnchor="middle"
                fontSize="9"
                letterSpacing="1.5"
                fill="var(--color-text-tertiary)"
                fontFamily="var(--font-sans)"
                textLength={undefined}
              >
                STAGE {stage.stageNumber}
              </text>
              <text
                x={x + w / 2}
                y={y - 12}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-ink)"
                fontFamily="var(--font-sans)"
              >
                {stage.label}
              </text>

              {/* Box */}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={stageColor(stage)}
                rx={3}
              />

              {/* Value inside box */}
              {h > 24 && stage.value != null && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 5}
                  textAnchor="middle"
                  fontSize={h > 60 ? 15 : 11}
                  fontWeight="600"
                  fill="#0a0a0a"
                  fontFamily="var(--font-sans)"
                >
                  {formatCondensed(stage.value)}
                  {((stage.id === 'notices' && noticesFlags.size > 0) ||
                    (stage.id === 'shutoffs' && shutoffsFlags.size > 0)) && (
                    <tspan fill="var(--color-flag)" fontWeight="600">*</tspan>
                  )}
                </text>
              )}

              {/* Axis label below box */}
              {stage.value != null && (
                <text
                  x={x + w / 2}
                  y={BASELINE_Y + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--color-text-tertiary)"
                  fontFamily="var(--font-sans)"
                >
                  {formatCondensed(stage.value)}
                </text>
              )}
            </g>
          ))}

          {/* Connector line from shutoffs to split boxes */}
          {shutoffsBox && (reconnectedBox || neverBox) && (
            <line
              x1={shutoffsBox.x + shutoffsBox.w}
              y1={shutoffsBox.y + shutoffsBox.h / 2}
              x2={SPLIT_X}
              y2={shutoffsBox.y + shutoffsBox.h / 2}
              stroke="var(--color-border-medium)"
              strokeWidth={1}
            />
          )}

          {/* 04A reconnected box */}
          {reconnectedBox && (() => {
            const { stage, x, y, w, h } = reconnectedBox;
            return (
              <g key="reconnected">
                <rect x={x} y={y} width={w} height={h} fill={stageColor(stage)} rx={3} />
                {h > 16 && stage.value != null && (
                  <text
                    x={x + w / 2}
                    y={y + h / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="600"
                    fill="#0a0a0a"
                    fontFamily="var(--font-sans)"
                  >
                    {formatCondensed(stage.value)}
                    {reconnectionsFlags.size > 0 && (
                      <tspan fill="var(--color-flag)" fontWeight="600">*</tspan>
                    )}
                  </text>
                )}
                <text
                  x={x + w + 8}
                  y={y + h / 2 - 6}
                  fontSize="11"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-sans)"
                >
                  STAGE {stage.stageNumber} {stage.label}
                </text>
                {stage.ratioCaption && (
                  <text
                    x={x + w + 8}
                    y={y + h / 2 + 9}
                    fontSize="10"
                    fill="var(--color-text-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {stage.ratioCaption}
                  </text>
                )}
              </g>
            );
          })()}

          {/* 04B never reconnected box */}
          {neverBox && (() => {
            const { stage, x, y, w, h } = neverBox;
            return (
              <g key="never_reconnected">
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={stageColor(stage)}
                  stroke="var(--color-pipeline-warn)"
                  strokeWidth={2}
                  rx={3}
                />
                {h > 16 && stage.value != null && (
                  <text
                    x={x + w / 2}
                    y={y + h / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="600"
                    fill="#ffffff"
                    fontFamily="var(--font-sans)"
                  >
                    {formatCondensed(stage.value)}
                    {reconnectionsFlags.size > 0 && (
                      <tspan fill="var(--color-flag)" fontWeight="600">*</tspan>
                    )}
                  </text>
                )}
                <text
                  x={x + w + 8}
                  y={y + h / 2 - 6}
                  fontSize="11"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-sans)"
                >
                  STAGE {stage.stageNumber} {stage.label}
                </text>
                {stage.ratioCaption && (
                  <text
                    x={x + w + 8}
                    y={y + h / 2 + 9}
                    fontSize="10"
                    fill="var(--color-pipeline-warn)"
                    fontFamily="var(--font-sans)"
                  >
                    {stage.ratioCaption}
                  </text>
                )}
              </g>
            );
          })()}
        </svg>

      </div>

      <FlagFootnote flags={cardFlags} />

      {/* Mobile ledger view */}
      <div className="md:hidden space-y-3 mt-4">
        {stages.map((stage, idx) => {
          const scale = scaledSize(stage.value, maxValue);
          const isWarn = stage.emphasis === 'warn';
          const showDivider = stage.id === 'reconnected';

          return (
            <div key={stage.id}>
              {showDivider && (
                <p className="text-[12px] text-[--color-text-tertiary] pl-4 py-1">
                  ↳ of those shutoffs…
                </p>
              )}
              <div
                className={
                  isWarn
                    ? 'border-l-2 border-[--color-pipeline-warn] bg-[--color-pipeline-warn]/5 pl-3 -ml-3 rounded-r'
                    : ''
                }
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[--color-text-tertiary] mr-1">
                      {stage.stageNumber}
                    </span>
                    <span className="text-[13px] text-[--color-ink]">{stage.label}</span>
                  </div>
                  <span className="text-[13px] font-medium tabular-nums shrink-0">
                    {stage.value != null ? formatCondensed(stage.value) : '—'}
                  </span>
                </div>

                <div className="h-[6px] bg-[--color-muted] rounded-sm overflow-hidden mb-1">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${(scale * 100).toFixed(1)}%`,
                      backgroundColor: stageColor(stage),
                    }}
                  />
                </div>

                {stage.ratioCaption && (
                  <p
                    className="text-[11px]"
                    style={{ color: isWarn ? 'var(--color-pipeline-warn)' : 'var(--color-text-tertiary)' }}
                  >
                    {stage.ratioCaption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
