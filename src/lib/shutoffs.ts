import type { StateAnnual, ShutoffRecord, NationalMonthly, CostAnnual, CostChange } from '../data/shutoffs-types';
import data from '../data/shutoffs.json';

// State code ↔ full name mapping
export const STATE_CODES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export const STATE_NAMES_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODES).map(([code, name]) => [name, code])
);

// One neighbor per state (hand-picked for comparison row default)
const STATE_NEIGHBORS: Record<string, string> = {
  AL: 'GA', AK: 'WA', AZ: 'NM', AR: 'TN', CA: 'AZ', CO: 'UT', CT: 'NY',
  DE: 'MD', DC: 'MD', FL: 'GA', GA: 'AL', HI: 'CA', ID: 'MT', IL: 'IN',
  IN: 'OH', IA: 'IL', KS: 'MO', KY: 'TN', LA: 'MS', ME: 'NH', MD: 'VA',
  MA: 'CT', MI: 'OH', MN: 'WI', MS: 'AL', MO: 'KS', MT: 'ID', NE: 'KS',
  NV: 'UT', NH: 'VT', NJ: 'PA', NM: 'CO', NY: 'PA', NC: 'SC', ND: 'SD',
  OH: 'PA', OK: 'TX', OR: 'WA', PA: 'OH', RI: 'CT', SC: 'NC', SD: 'ND',
  TN: 'KY', TX: 'OK', UT: 'CO', VT: 'NH', VA: 'NC', WA: 'OR', WV: 'VA',
  WI: 'MN', WY: 'MT',
};

// Data quality flags
type DataQualityFlag = 'reporting_gap' | 'muni_heavy' | null;
const DATA_QUALITY: Record<string, Partial<Record<'electric' | 'gas', DataQualityFlag>>> = {
  GA: { gas: 'reporting_gap' },
};

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

export function getStateMonthly(code: string): ShutoffRecord[] {
  const name = STATE_CODES[code];
  return data.records.filter((r) => r.state === name) as ShutoffRecord[];
}

export function getNationalMonthly(): NationalMonthly[] {
  return data.aggregates.national_monthly as NationalMonthly[];
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

export function getOneInX(rate: number): number {
  if (!rate || rate <= 0) return 0;
  return Math.round(1 / rate);
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

export function getNeighbor(code: string): string | null {
  return STATE_NEIGHBORS[code] ?? null;
}

export function getDataQuality(code: string, fuel: 'electric' | 'gas'): DataQualityFlag {
  return DATA_QUALITY[code]?.[fuel] ?? null;
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
