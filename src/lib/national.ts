import type { StateAnnual } from '../data/shutoffs-types';
import data from '../data/shutoffs.json';
import {
  computeStatesForNational,
  type MetricControls,
  type NationalSummary,
  type StateNationalRow,
  type Fuel,
  type Metric,
  type Unit,
} from './national-constants';

export {
  FUEL_LABELS,
  METRIC_NOUNS,
  METRIC_VERBS,
  METRIC_NOUNS_PLURAL,
  FUEL_DISPLAY,
  METRIC_DISPLAY,
  UNIT_DISPLAY,
  BREAKPOINTS,
  getBreakpoints,
  computeStatesForNational,
  type Fuel,
  type Metric,
  type Unit,
  type MetricControls,
  type NationalSummary,
  type StateNationalRow,
} from './national-constants';

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

export function getStatesForNational(controls: MetricControls): StateNationalRow[] {
  return computeStatesForNational(data.aggregates.state_annual as StateAnnual[], controls);
}
