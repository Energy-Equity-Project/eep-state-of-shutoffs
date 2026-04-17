import type { ShutoffRecord } from '../data/shutoffs-types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function getChartCaption(
  records: ShutoffRecord[],
  fuel: 'electric' | 'gas',
): string {
  const field = fuel === 'electric' ? 'electric_shutoffs' : 'gas_shutoffs';
  let peakMonth = 1;
  let peakValue = -Infinity;

  for (const r of records) {
    const val = r[field] as number | null;
    if (val != null && val > peakValue) {
      peakValue = val;
      peakMonth = r.month;
    }
  }

  const monthName = MONTH_NAMES[peakMonth - 1];
  const fuelLabel = fuel === 'electric' ? 'Electric' : 'Gas';
  const formatted = peakValue > 0 ? peakValue.toLocaleString() : '—';

  return `${fuelLabel} shutoffs peaked in ${monthName} at ${formatted}.`;
}

export function getBothCaption(): string {
  return 'Shown as a percentage of customers since gas and electric customer bases differ.';
}
