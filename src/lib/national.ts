import type { StateAnnual } from '../data/shutoffs-types';
import data from '../data/shutoffs.json';
import { STATE_NAMES_TO_CODE } from './shutoffs';

export type Fuel = 'electric' | 'gas' | 'combined';
export type Metric = 'shutoffs' | 'finalNotices' | 'reconnections';
export type Unit = 'rate' | 'count';

export interface MetricControls {
  fuel: Fuel;
  metric: Metric;
  unit: Unit;
}

export interface NationalSummary {
  electricShutoffs: number;
  gasShutoffs: number;
  combinedShutoffs: number;
  electricFinalNotices: number;
  gasFinalNotices: number;
  electricReconnections: number;
  gasReconnections: number;
  electricShutoffsPerReconnection: number;
  statesReporting: number;
  statesTotal: number;
  statesExempt: number;
  totalHouseholds: number;
}

export interface StateNationalRow {
  st: string;
  name: string;
  value: number;
  countValue: number;
  rateValue: number;
}

function stateRate(total: number | null, avgCustomers: number): number {
  if (!total || !avgCustomers) return 0;
  return total / avgCustomers;
}

export function getNationalHouseholds(): number {
  return (data.household_metrics.state_households as { households: number }[]).reduce(
    (sum, s) => sum + (s.households ?? 0),
    0,
  );
}

export function getNationalTotals(): NationalSummary {
  const nt = data.aggregates.national_totals;
  const stateAnnual = data.aggregates.state_annual as StateAnnual[];

  // Reporting: state has non-zero electric shutoffs total
  const statesReporting = stateAnnual.filter((s) => (s.electric_shutoffs_total ?? 0) > 0).length;
  const statesTotal = 51;

  const electricShutoffs = nt.electric_shutoffs_total;
  const electricReconnections = nt.electric_reconnections_total ?? 0;

  return {
    electricShutoffs,
    gasShutoffs: nt.gas_shutoffs_total,
    combinedShutoffs: nt.electric_shutoffs_total + nt.gas_shutoffs_total,
    electricFinalNotices: nt.electric_shutoff_notices_total,
    gasFinalNotices: nt.gas_shutoff_notices_total,
    electricReconnections,
    gasReconnections: nt.gas_reconnections_total ?? 0,
    // Reconnections per 100 shutoffs (substitutes "within 14 days" which isn't in EIA-112)
    electricShutoffsPerReconnection: electricShutoffs > 0
      ? Math.round((electricReconnections / electricShutoffs) * 100)
      : 0,
    statesReporting,
    statesTotal,
    statesExempt: statesTotal - statesReporting,
    totalHouseholds: getNationalHouseholds(),
  };
}

export function getNationalRate({ fuel, metric }: Pick<MetricControls, 'fuel' | 'metric'>): number {
  const nt = data.aggregates.national_totals;
  const totalElectricCustomers = nt.avg_electric_customers * 51;
  const totalGasCustomers = nt.avg_gas_customers * 51;

  if (metric === 'shutoffs') {
    if (fuel === 'electric') return nt.electric_shutoffs_total / totalElectricCustomers;
    if (fuel === 'gas') return nt.gas_shutoffs_total / totalGasCustomers;
    return (nt.electric_shutoffs_total + nt.gas_shutoffs_total) / totalElectricCustomers;
  }
  if (metric === 'finalNotices') {
    if (fuel === 'electric') return nt.electric_shutoff_notices_total / totalElectricCustomers;
    if (fuel === 'gas') return nt.gas_shutoff_notices_total / totalGasCustomers;
    return (nt.electric_shutoff_notices_total + nt.gas_shutoff_notices_total) / totalElectricCustomers;
  }
  // reconnections
  if (fuel === 'electric') return (nt.electric_reconnections_total ?? 0) / totalElectricCustomers;
  if (fuel === 'gas') return (nt.gas_reconnections_total ?? 0) / totalGasCustomers;
  return ((nt.electric_reconnections_total ?? 0) + (nt.gas_reconnections_total ?? 0)) / totalElectricCustomers;
}

export function getStatesForNational({ fuel, metric, unit }: MetricControls): StateNationalRow[] {
  const stateAnnual = data.aggregates.state_annual as StateAnnual[];

  const rows = stateAnnual
    .map((s): StateNationalRow | null => {
      const code = STATE_NAMES_TO_CODE[s.state];
      if (!code) return null;

      let countValue: number;
      let rateValue: number;

      if (metric === 'shutoffs') {
        if (fuel === 'electric') {
          countValue = s.electric_shutoffs_total;
          rateValue = s.electric_annual_shutoff_rate * 100;
        } else if (fuel === 'gas') {
          countValue = s.gas_shutoffs_total;
          rateValue = s.gas_annual_shutoff_rate * 100;
        } else {
          countValue = s.electric_shutoffs_total + s.gas_shutoffs_total;
          rateValue = stateRate(countValue, s.electric_avg_customers) * 100;
        }
      } else if (metric === 'finalNotices') {
        if (fuel === 'electric') {
          countValue = s.electric_shutoff_notices_total;
          rateValue = stateRate(s.electric_shutoff_notices_total, s.electric_avg_customers) * 100;
        } else if (fuel === 'gas') {
          countValue = s.gas_shutoff_notices_total;
          rateValue = stateRate(s.gas_shutoff_notices_total, s.gas_avg_customers) * 100;
        } else {
          countValue = s.electric_shutoff_notices_total + s.gas_shutoff_notices_total;
          rateValue = stateRate(countValue, s.electric_avg_customers) * 100;
        }
      } else {
        // reconnections
        if (fuel === 'electric') {
          countValue = s.electric_reconnections_total ?? 0;
          rateValue = stateRate(s.electric_reconnections_total, s.electric_avg_customers) * 100;
        } else if (fuel === 'gas') {
          countValue = s.gas_reconnections_total ?? 0;
          rateValue = stateRate(s.gas_reconnections_total, s.gas_avg_customers) * 100;
        } else {
          countValue = (s.electric_reconnections_total ?? 0) + (s.gas_reconnections_total ?? 0);
          rateValue = stateRate(countValue, s.electric_avg_customers) * 100;
        }
      }

      const value = unit === 'rate' ? rateValue : countValue;
      return { st: code, name: s.state, value, countValue, rateValue };
    })
    .filter((r): r is StateNationalRow => r !== null);

  return rows.sort((a, b) => b.value - a.value);
}

// Breakpoints derived from shutoffs.json quintiles, rounded to clean intervals:
//   Rates ≥5% range  → nearest 5 percentage points
//   Rates <5% range  → nearest 1 percentage point (gas values too small for 5% steps)
//   Counts (millions) → nearest 0.5M
//   Counts (thousands) → nearest 50k; sub-50k metrics use nearest 5k/10k
// Key format: `${fuel}-${metric}-${unit}`
export const BREAKPOINTS: Record<string, [number, number, number, number]> = {
  'electric-shutoffs-rate':        [5,       10,       15,       20],
  'electric-shutoffs-count':       [50000,   100000,   150000,   400000],
  'gas-shutoffs-rate':             [1,       2,        3,        4],
  'gas-shutoffs-count':            [5000,    15000,    30000,    50000],
  'combined-shutoffs-rate':        [5,       10,       15,       20],
  'combined-shutoffs-count':       [50000,   100000,   200000,   450000],
  'electric-finalNotices-rate':    [30,      40,       70,       95],
  'electric-finalNotices-count':   [500000,  1000000,  1500000,  3000000],
  'gas-finalNotices-rate':         [15,      25,       35,       60],
  'gas-finalNotices-count':        [50000,   150000,   250000,   700000],
  'combined-finalNotices-rate':    [35,      50,       90,       120],
  'combined-finalNotices-count':   [500000,  1000000,  2500000,  3500000],
  'electric-reconnections-rate':   [5,       10,       15,       20],
  'electric-reconnections-count':  [50000,   100000,   150000,   300000],
  'gas-reconnections-rate':        [1,       2,        3,        5],
  'gas-reconnections-count':       [5000,    10000,    20000,    40000],
  'combined-reconnections-rate':   [5,       10,       15,       20],
  'combined-reconnections-count':  [50000,   100000,   150000,   350000],
};

export function getBreakpoints(
  fuel: Fuel,
  metric: Metric,
  unit: Unit,
): [number, number, number, number] {
  return BREAKPOINTS[`${fuel}-${metric}-${unit}`] ?? [0, 0, 0, 0];
}

export const FUEL_LABELS: Record<Fuel, string> = {
  electric: 'electric',
  gas: 'gas',
  combined: 'combined',
};

export const METRIC_NOUNS: Record<Metric, string> = {
  shutoffs: 'shutoff',
  finalNotices: 'final notice',
  reconnections: 'reconnection',
};

export const FUEL_DISPLAY: Record<Fuel, string> = {
  electric: 'Electric',
  gas: 'Gas',
  combined: 'Combined',
};

export const METRIC_DISPLAY: Record<Metric, string> = {
  shutoffs: 'Shutoffs',
  finalNotices: 'Final notices',
  reconnections: 'Reconnections',
};

export const UNIT_DISPLAY: Record<Unit, string> = {
  rate: 'Percent (of customers)',
  count: 'Counts',
};
