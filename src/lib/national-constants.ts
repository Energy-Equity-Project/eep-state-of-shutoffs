import type { StateAnnual } from '../data/shutoffs-types';
import { STATE_NAMES_TO_CODE } from './shutoffs-constants';

export type Fuel = 'electric' | 'gas' | 'combined';
export type Metric = 'shutoffs' | 'finalNotices' | 'neverReconnected';
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
  electricNeverReconnected: number;
  gasNeverReconnected: number;
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

export const FUEL_LABELS: Record<Fuel, string> = {
  electric: 'electric',
  gas: 'gas',
  combined: 'combined',
};

export const METRIC_NOUNS: Record<Metric, string> = {
  shutoffs: 'shutoff',
  finalNotices: 'final notice',
  neverReconnected: 'household never reconnected',
};

export const METRIC_VERBS: Record<Metric, string> = {
  shutoffs: 'executed',
  finalNotices: 'sent',
  neverReconnected: 'never reconnected',
};

export const METRIC_NOUNS_PLURAL: Record<Metric, string> = {
  shutoffs: 'shutoffs',
  finalNotices: 'final notices',
  neverReconnected: 'households never reconnected',
};

export const FUEL_DISPLAY: Record<Fuel, string> = {
  electric: 'Electric',
  gas: 'Gas',
  combined: 'Combined',
};

export const METRIC_DISPLAY: Record<Metric, string> = {
  shutoffs: 'Shutoffs',
  finalNotices: 'Final notices',
  neverReconnected: 'Never reconnected',
};

export const UNIT_DISPLAY: Record<Unit, string> = {
  rate: 'Percent',
  count: 'Counts',
};

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
  'electric-neverReconnected-rate':   [10,    15,       20,       25],
  'electric-neverReconnected-count':  [25000, 50000,    100000,   200000],
  'gas-neverReconnected-rate':        [25,    35,       45,       55],
  'gas-neverReconnected-count':       [2000,  5000,     15000,    30000],
  'combined-neverReconnected-rate':   [10,    15,       20,       25],
  'combined-neverReconnected-count':  [25000, 50000,    100000,   200000],
};

export function getBreakpoints(
  fuel: Fuel,
  metric: Metric,
  unit: Unit,
): [number, number, number, number] {
  return BREAKPOINTS[`${fuel}-${metric}-${unit}`] ?? [0, 0, 0, 0];
}

function stateRate(total: number | null, avgCustomers: number): number {
  if (!total || !avgCustomers) return 0;
  return total / avgCustomers;
}

export function computeStatesForNational(
  stateAnnual: StateAnnual[],
  { fuel, metric, unit }: MetricControls,
): StateNationalRow[] {
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
        // neverReconnected
        if (fuel === 'electric') {
          countValue = s.electric_net_shutoffs_total ?? 0;
          rateValue = s.electric_shutoffs_total > 0
            ? (countValue / s.electric_shutoffs_total) * 100
            : 0;
        } else if (fuel === 'gas') {
          countValue = s.gas_net_shutoffs_total ?? 0;
          rateValue = s.gas_shutoffs_total > 0
            ? (countValue / s.gas_shutoffs_total) * 100
            : 0;
        } else {
          const elecNet = s.electric_net_shutoffs_total ?? 0;
          const gasNet = s.gas_net_shutoffs_total ?? 0;
          countValue = elecNet + gasNet;
          const totalShutoffs = s.electric_shutoffs_total + s.gas_shutoffs_total;
          rateValue = totalShutoffs > 0 ? (countValue / totalShutoffs) * 100 : 0;
        }
      }

      const value = unit === 'rate' ? rateValue : countValue;
      return { st: code, name: s.state, value, countValue, rateValue };
    })
    .filter((r): r is StateNationalRow => r !== null);

  return rows.sort((a, b) => b.value - a.value);
}
