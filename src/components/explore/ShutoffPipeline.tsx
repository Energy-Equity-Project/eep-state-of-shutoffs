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
    caption = `Of ${formatCount(shutoffs)} shutoffs executed, ${formatCount(neverReconnected)} (${pct}%) were never reconnected in 2024.`;
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

  // Stage 4 — single stacked bar, same dimensions as the shutoffs box
  const STAGE04_X = shutoffsBox ? shutoffsBox.x + shutoffsBox.w + 60 : 700;

  const stage4Box = shutoffsBox && reconnectedStage && neverStage
    ? { x: STAGE04_X, y: shutoffsBox.y, w: shutoffsBox.w, h: shutoffsBox.h }
    : null;

  const reconnValue = reconnectedStage?.value ?? 0;
  const neverValue = neverStage?.value ?? 0;
  const segmentTotal = reconnValue + neverValue;
  const reconnH = stage4Box && segmentTotal > 0
    ? Math.round(stage4Box.h * (reconnValue / segmentTotal))
    : 0;
  const neverH = stage4Box ? stage4Box.h - reconnH : 0;

  return (
    <div className="bg-white border border-[--color-border-light] px-6 py-5 mb-6">
      <h2 className="text-base font-medium mb-1">The shutoff pipeline:</h2>
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

          {/* Connector line from shutoffs to stage 4 box */}
          {shutoffsBox && stage4Box && (
            <line
              x1={shutoffsBox.x + shutoffsBox.w}
              y1={shutoffsBox.y + shutoffsBox.h / 2}
              x2={STAGE04_X}
              y2={shutoffsBox.y + shutoffsBox.h / 2}
              stroke="var(--color-border-medium)"
              strokeWidth={1}
            />
          )}

          {/* Stage 4 — stacked bar (never reconnected on top, reconnected on bottom) */}
          {stage4Box && reconnectedStage && neverStage && (() => {
            const { x, y, w, h } = stage4Box;
            const neverY = y;
            const reconnY = y + neverH;
            return (
              <g key="stage4">
                {/* Eyebrow + label */}
                <text
                  x={x + w / 2}
                  y={y - 28}
                  textAnchor="middle"
                  fontSize="9"
                  letterSpacing="1.5"
                  fill="var(--color-text-tertiary)"
                  fontFamily="var(--font-sans)"
                >
                  STAGE 04
                </text>
                <text
                  x={x + w / 2}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-sans)"
                >
                  Shutoff outcomes
                </text>

                {/* Clip path so stacked rects get rounded corners from the outer box */}
                <clipPath id="stage4clip">
                  <rect x={x} y={y} width={w} height={h} rx={3} />
                </clipPath>

                {/* Never reconnected segment (top, warn red) */}
                {neverH > 0 && (
                  <rect
                    x={x}
                    y={neverY}
                    width={w}
                    height={neverH}
                    fill="var(--color-pipeline-warn)"
                    clipPath="url(#stage4clip)"
                  />
                )}

                {/* Reconnected segment (bottom, green) */}
                {reconnH > 0 && (
                  <rect
                    x={x}
                    y={reconnY}
                    width={w}
                    height={reconnH}
                    fill="var(--color-pipeline-reconnect)"
                    clipPath="url(#stage4clip)"
                  />
                )}

                {/* Value inside never segment */}
                {neverH > 16 && neverStage.value != null && (
                  <text
                    x={x + w / 2}
                    y={neverY + neverH / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="600"
                    fill="#ffffff"
                    fontFamily="var(--font-sans)"
                  >
                    {formatCondensed(neverStage.value)}
                    {reconnectionsFlags.size > 0 && (
                      <tspan fill="var(--color-flag)" fontWeight="600">*</tspan>
                    )}
                  </text>
                )}

                {/* Value inside reconnected segment */}
                {reconnH > 16 && reconnectedStage.value != null && (
                  <text
                    x={x + w / 2}
                    y={reconnY + reconnH / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="600"
                    fill="#0a0a0a"
                    fontFamily="var(--font-sans)"
                  >
                    {formatCondensed(reconnectedStage.value)}
                    {reconnectionsFlags.size > 0 && (
                      <tspan fill="var(--color-flag)" fontWeight="600">*</tspan>
                    )}
                  </text>
                )}

                {/* Right-side label for never reconnected segment */}
                <text
                  x={x + w + 8}
                  y={neverY + neverH / 2 - 6}
                  fontSize="11"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-sans)"
                >
                  {neverStage.label}
                </text>
                {neverStage.ratioCaption && (
                  <text
                    x={x + w + 8}
                    y={neverY + neverH / 2 + 9}
                    fontSize="10"
                    fill="var(--color-pipeline-warn)"
                    fontFamily="var(--font-sans)"
                  >
                    {neverStage.ratioCaption}
                  </text>
                )}

                {/* Right-side label for reconnected segment */}
                <text
                  x={x + w + 8}
                  y={reconnY + reconnH / 2 - 6}
                  fontSize="11"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-sans)"
                >
                  {reconnectedStage.label}
                </text>
                {reconnectedStage.ratioCaption && (
                  <text
                    x={x + w + 8}
                    y={reconnY + reconnH / 2 + 9}
                    fontSize="10"
                    fill="var(--color-text-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {reconnectedStage.ratioCaption}
                  </text>
                )}

                {/* Axis label below box */}
                {shutoffsStage?.value != null && (
                  <text
                    x={x + w / 2}
                    y={BASELINE_Y + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--color-text-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {formatCondensed(shutoffsStage.value)}
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
