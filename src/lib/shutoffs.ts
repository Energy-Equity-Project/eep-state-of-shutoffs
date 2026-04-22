import type { StateAnnual, ShutoffRecord, NationalMonthly, CostAnnual, CostChange } from '../data/shutoffs-types';
import data from '../data/shutoffs.json';
import {
  STATE_CODES,
  STATE_NAMES_TO_CODE,
  computeMonthlyFlags,
  type EiaFlag,
  type ShutoffMeasure,
} from './shutoffs-constants';

export {
  STATE_CODES,
  STATE_NAMES_TO_CODE,
  FLAG_DEFINITIONS,
  getOneInX,
  getNeighbor,
  type EiaFlag,
  type ShutoffMeasure,
} from './shutoffs-constants';

// Cache for multiplier computations
const multiplierCache = new Map<string, { electric: number; gas: number }>();

function buildMultiplierCache() {
  if (multiplierCache.size > 0) return;
  const { national_totals } = data.aggregates;
  const nationalElectricRate = national_totals.electric_shutoffs_total / (national_totals.avg_electric_customers * 51);
  const nationalGasRate = national_totals.gas_shutoffs_total / (national_totals.avg_gas_customers * 51);

  for (const s of data.aggregates.state_annual) {
    const code = STATE_NAMES_TO_CODE[s.state];
    if (!code) continue;
    multiplierCache.set(code, {
      electric: s.electric_annual_shutoff_rate / nationalElectricRate,
      gas: s.gas_annual_shutoff_rate / nationalGasRate,
    });
  }
}

export function getStateHouseholds(code: string): number | null {
  const name = STATE_CODES[code];
  const row = (data as any).household_metrics?.state_households?.find((r: any) => r.state === name);
  return row?.households ?? null;
}

export function getStateAnnual(code: string): StateAnnual {
  const name = STATE_CODES[code];
  const row = data.aggregates.state_annual.find((s) => s.state === name);
  if (!row) throw new Error(`No state_annual data for ${code}`);
  return row as StateAnnual;
}

export function getAllStateAnnual(): StateAnnual[] {
  return data.aggregates.state_annual as StateAnnual[];
}

export function getStateMonthly(code: string): ShutoffRecord[] {
  const name = STATE_CODES[code];
  return data.records.filter((r) => r.state === name) as ShutoffRecord[];
}

export function getNationalMonthly(): NationalMonthly[] {
  return data.aggregates.national_monthly as NationalMonthly[];
}

const noticeConversionRankingCache: { electric?: string[]; gas?: string[] } = {};

function buildNoticeConversionRanking(fuel: 'electric' | 'gas'): string[] {
  if (noticeConversionRankingCache[fuel]) return noticeConversionRankingCache[fuel]!;
  const noticesKey = `${fuel}_shutoff_notices_total` as const;
  const shutoffsKey = `${fuel}_shutoffs_total` as const;
  const ranked = (data.aggregates.state_annual as StateAnnual[])
    .filter((s) => (s[noticesKey] as number) > 0)
    .map((s) => ({ state: s.state, rate: (s[shutoffsKey] as number) / (s[noticesKey] as number) }))
    .sort((a, b) => b.rate - a.rate)
    .map((x) => x.state);
  noticeConversionRankingCache[fuel] = ranked;
  return ranked;
}

export function getNoticeToShutoffRank(code: string, fuel: 'electric' | 'gas'): number {
  const name = STATE_CODES[code];
  const idx = buildNoticeConversionRanking(fuel).indexOf(name);
  return idx === -1 ? 0 : idx + 1;
}

export function getNoticeToShutoffOneInX(annual: StateAnnual, fuel: 'electric' | 'gas'): number {
  const notices = annual[`${fuel}_shutoff_notices_total`] as number | null;
  const shutoffs = annual[`${fuel}_shutoffs_total`] as number | null;
  if (!notices || !shutoffs) return 0;
  return Math.round(notices / shutoffs);
}

export function getNationalRank(code: string, fuel: 'electric' | 'gas'): number {
  const name = STATE_CODES[code];
  const key = fuel === 'electric' ? 'electric_annual_shutoff_rate_desc' : 'gas_annual_shutoff_rate_desc';
  const idx = data.aggregates.state_rankings[key].indexOf(name);
  return idx === -1 ? 0 : idx + 1;
}

export function getMultiplierVsNational(code: string, fuel: 'electric' | 'gas'): number {
  buildMultiplierCache();
  return multiplierCache.get(code)?.[fuel] ?? 1;
}

export function getHighestRateState(fuel: 'electric' | 'gas'): { code: string; name: string; rate: number; rank: number } {
  const key = fuel === 'electric' ? 'electric_annual_shutoff_rate_desc' : 'gas_annual_shutoff_rate_desc';
  const name = data.aggregates.state_rankings[key][0];
  const code = STATE_NAMES_TO_CODE[name] ?? '';
  const annual = data.aggregates.state_annual.find((s) => s.state === name);
  const rate = fuel === 'electric'
    ? (annual?.electric_annual_shutoff_rate ?? 0)
    : (annual?.gas_annual_shutoff_rate ?? 0);
  return { code, name, rate, rank: 1 };
}

export function getMonthlyFlags(
  code: string,
  fuel: 'electric' | 'gas',
  measures: ShutoffMeasure[],
): Set<EiaFlag> {
  return computeMonthlyFlags(getStateMonthly(code), fuel, measures);
}

export function getAllStateCodes(): string[] {
  return data.aggregates.state_annual
    .map((s) => STATE_NAMES_TO_CODE[s.state])
    .filter(Boolean);
}

export function getYear(): number {
  return data.year;
}

export function getStateCost2024(code: string): CostAnnual | null {
  const name = STATE_CODES[code];
  const row = data.cost_metrics.state_annual_costs.find(
    (r) => r.state === name && r.year === 2024
  );
  return (row as CostAnnual) ?? null;
}

export function getCostChange(code: string): CostChange | null {
  const name = STATE_CODES[code];
  const row = data.cost_metrics.cost_changes_2020_to_2024.find((r) => r.state === name);
  return (row as CostChange) ?? null;
}

export function getNationalElectricRate(): number {
  const { national_totals } = data.aggregates;
  return national_totals.electric_shutoffs_total / (national_totals.avg_electric_customers * 51);
}

export function getNationalGasRate(): number {
  const { national_totals } = data.aggregates;
  return national_totals.gas_shutoffs_total / (national_totals.avg_gas_customers * 51);
}
