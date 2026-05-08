import { FUEL_DISPLAY } from '../../lib/national-constants';
import type { Fuel, NationalSummary } from '../../lib/national-constants';
import { formatCondensed } from '../../lib/format';

const labelCls = 'text-[11px] md:text-xs text-[--color-text-secondary] mb-1.5';
const valueCls = 'text-[20px] md:text-[22px] font-medium mb-1';
const metaCls = 'text-[11px] md:text-xs text-[--color-text-tertiary]';
const cardCls = 'bg-white border border-[--color-border-light] p-4';

function getMetrics(totals: NationalSummary, rate: number, fuel: Fuel) {
  const fuelLabel = FUEL_DISPLAY[fuel];

  let finalNotices: number;
  let shutoffs: number;
  let neverReconnected: number;

  if (fuel === 'electric') {
    finalNotices = totals.electricFinalNotices;
    shutoffs = totals.electricShutoffs;
    neverReconnected = totals.electricNeverReconnected;
  } else if (fuel === 'gas') {
    finalNotices = totals.gasFinalNotices;
    shutoffs = totals.gasShutoffs;
    neverReconnected = totals.gasNeverReconnected;
  } else {
    finalNotices = totals.electricFinalNotices + totals.gasFinalNotices;
    shutoffs = totals.combinedShutoffs;
    neverReconnected = totals.electricNeverReconnected + totals.gasNeverReconnected;
  }

  const pctOfShutoffs = shutoffs > 0 ? Math.round((neverReconnected / shutoffs) * 100) : 0;

  return { fuelLabel, finalNotices, shutoffs, rate, neverReconnected, pctOfShutoffs };
}

interface Props {
  fuel: Fuel;
  totals: NationalSummary;
  rate: number;
}

export default function NationalKpiRow({ fuel, totals, rate }: Props) {
  const { fuelLabel, finalNotices, shutoffs, neverReconnected, pctOfShutoffs } = getMetrics(totals, rate, fuel);
  const ratePct = (rate * 100).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-[14px] mb-8">
      <div className={cardCls}>
        <p className={labelCls}>{fuelLabel} final notices</p>
        <p className={valueCls}>{formatCondensed(finalNotices)}</p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>{fuelLabel} shutoffs</p>
        <p className={valueCls}>{formatCondensed(shutoffs)}</p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>{fuelLabel} shutoff rate</p>
        <p className={valueCls}>{ratePct}%</p>
        <p className={metaCls}>of customers annually</p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>{fuelLabel} never reconnected</p>
        <p className={valueCls}>{formatCondensed(neverReconnected)}</p>
        <p className={metaCls}>
          {pctOfShutoffs > 0 ? `${pctOfShutoffs}% of shutoffs` : ''}
        </p>
      </div>
    </div>
  );
}
