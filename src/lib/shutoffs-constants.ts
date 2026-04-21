import type { ShutoffRecord } from '../data/shutoffs-types';

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

export type EiaFlag = 'R' | 'Q';

export const FLAG_DEFINITIONS: Record<EiaFlag, string> = {
  R: 'Large relative standard error (RSE) greater than 50',
  Q: 'State response rate less than 50%',
};

export type ShutoffMeasure = 'shutoffs' | 'shutoff_notices' | 'reconnections';

export function getOneInX(rate: number): number {
  if (!rate || rate <= 0) return 0;
  return Math.round(1 / rate);
}

export function getNeighbor(code: string): string | null {
  return STATE_NEIGHBORS[code] ?? null;
}

export function computeMonthlyFlags(
  records: ShutoffRecord[],
  fuel: 'electric' | 'gas',
  measures: ShutoffMeasure[],
): Set<EiaFlag> {
  const flags = new Set<EiaFlag>();
  for (const r of records) {
    for (const m of measures) {
      const key = `${fuel}_${m}_flag` as keyof ShutoffRecord;
      const v = r[key] as 'Q' | 'R' | null;
      if (v === 'R' || v === 'Q') flags.add(v);
    }
  }
  return flags;
}
