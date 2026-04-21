import { useMemo } from 'react';
import { useMetricControls } from '../../lib/useMetricControls';
import {
  getStatesForNational,
  getNationalRate,
  FUEL_DISPLAY,
  METRIC_DISPLAY,
  FUEL_LABELS,
  METRIC_NOUNS,
} from '../../lib/national';
import { getYear } from '../../lib/shutoffs';
import MetricBar from './MetricBar';
import HexMap from './HexMap';
import NationalKpiRow from './NationalKpiRow';
import ScrollableRankList from './ScrollableRankList';

const YEAR = getYear();

function getOtherFuelLabel(fuel: string): string {
  if (fuel === 'electric') return 'gas';
  if (fuel === 'gas') return 'electric';
  return 'individual fuels';
}

export default function NationalTrendsView() {
  const { controls, onChange } = useMetricControls();
  const { fuel, metric, unit } = controls;

  const statesData = useMemo(() => getStatesForNational(controls), [controls]);

  const hexData = statesData.map((r) => ({ st: r.st, value: r.value }));

  const nationalRate = useMemo(() => getNationalRate({ fuel, metric }), [fuel, metric]);
  const oneInN = nationalRate > 0 ? Math.round(1 / nationalRate) : 0;

  // Headline lede stats
  const highState = statesData[0];
  const lowState = statesData.length > 0 ? statesData[statesData.length - 1] : null;
  const highPct = highState ? highState.rateValue.toFixed(0) : '?';
  const lowPct = lowState ? lowState.rateValue.toFixed(0) : '?';

  const fuelLabel = FUEL_LABELS[fuel];
  const metricNoun = METRIC_NOUNS[metric];
  const eyebrow = `National · ${YEAR} · ${FUEL_DISPLAY[fuel]} ${METRIC_DISPLAY[metric]}`;

  const sectionTag =
    unit === 'count' ? 'ALL STATES · RANKED BY COUNT' : 'ALL STATES · RANKED BY RATE';

  function navigateToState(st: string) {
    const params = new URLSearchParams();
    params.set('fuel', fuel);
    params.set('metric', metric);
    params.set('unit', unit);
    window.location.href = `/explore/${st}?${params.toString()}`;
  }

  return (
    <div>
      {/* Headline block */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[--color-text-secondary] mb-2">
          {eyebrow}
        </p>
        <h1 className="text-[26px] md:text-[34px] font-semibold leading-tight mb-3 max-w-3xl"
            style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
          {oneInN > 0 ? (
            <>
              Across the country,{' '}
              <span className="highlight">1 in {oneInN.toLocaleString()} households</span>{' '}
              faced a{fuelLabel.startsWith('e') ? 'n' : ''} {fuelLabel} {metricNoun} in {YEAR}.
            </>
          ) : (
            <>Across the country, utilities recorded {fuelLabel} {metricNoun}s in {YEAR}.</>
          )}
        </h1>
        {highState && lowState && (
          <p className="text-[14px] text-[--color-text-secondary] leading-relaxed max-w-2xl">
            Rates vary widely — from under {lowPct}% in {lowState.name} to over {highPct}% in{' '}
            {highState.name}. Switch fuel to see how {getOtherFuelLabel(fuel)} compares, or
            combine both for the fuller picture.
          </p>
        )}
      </div>

      {/* KPI summary row */}
      <NationalKpiRow />

      {/* Metric control bar */}
      <MetricBar value={controls} onChange={onChange} />

      {/* Map + ranked list */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* Left: hex map */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[--color-text-secondary] mb-3">
            Every state, equal weight
          </p>
          <HexMap
            data={hexData}
            size={28}
            unit={unit}
            onHexClick={navigateToState}
          />
          <p className="md:hidden text-[12px] text-[--color-text-tertiary] mt-2">
            Tap a hex to open a state page.
          </p>
        </div>

        {/* Right: ranked list */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[--color-text-secondary] mb-3">
            {sectionTag}
          </p>
          <ScrollableRankList rows={statesData} unit={unit} />
        </div>
      </div>
    </div>
  );
}
