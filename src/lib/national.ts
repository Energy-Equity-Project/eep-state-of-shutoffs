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

// Data-driven quintile breakpoints derived from all 51 state values in shutoffs.json.
// Key format: `${fuel}-${metric}-${unit}`
// Rate values are percentages; count values are raw integers.
export const BREAKPOINTS: Record<string, [number, number, number, number]> = {
  'electric-shutoffs-rate':        [3.2,    4.3,     6.3,     10.1],
  'electric-shutoffs-count':       [31000,  85000,   174000,  376000],
  'gas-shutoffs-rate':             [1.2,    1.8,     2.6,     4.3],
  'gas-shutoffs-count':            [5000,   13000,   30000,   52000],
  'combined-shutoffs-rate':        [3.9,    5.3,     7.2,     12.5],
  'combined-shutoffs-count':       [33000,  100000,  191000,  427000],
  'electric-finalNotices-rate':    [27.9,   42.3,    68.1,    94.3],
  'electric-finalNotices-count':   [257000, 766000,  1642000, 3172000],
  'gas-finalNotices-rate':         [15.3,   22.8,    34.7,    58.4],
  'gas-finalNotices-count':        [39000,  154000,  273000,  716000],
  'combined-finalNotices-rate':    [36.1,   51.8,    92.0,    121.7],
  'combined-finalNotices-count':   [369000, 927000,  2296000, 3481000],
  'electric-reconnections-rate':   [2.7,    3.9,     5.3,     9.3],
  'electric-reconnections-count':  [26000,  71000,   134000,  315000],
  'gas-reconnections-rate':        [0.5,    1.0,     1.4,     2.6],
  'gas-reconnections-count':       [2200,   8800,    19000,   37000],
  'combined-reconnections-rate':   [2.9,    4.2,     6.0,     10.9],
  'combined-reconnections-count':  [28000,  86000,   164000,  341000],
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
