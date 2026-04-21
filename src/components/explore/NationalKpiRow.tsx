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
  let reconnections: number;

  if (fuel === 'electric') {
    finalNotices = totals.electricFinalNotices;
    shutoffs = totals.electricShutoffs;
    reconnections = totals.electricReconnections;
  } else if (fuel === 'gas') {
    finalNotices = totals.gasFinalNotices;
    shutoffs = totals.gasShutoffs;
    reconnections = totals.gasReconnections;
  } else {
    finalNotices = totals.electricFinalNotices + totals.gasFinalNotices;
    shutoffs = totals.combinedShutoffs;
    reconnections = totals.electricReconnections + totals.gasReconnections;
  }

  const reconPer100 = shutoffs > 0 ? Math.round((reconnections / shutoffs) * 100) : 0;

  return { fuelLabel, finalNotices, shutoffs, rate, reconnections, reconPer100 };
}

interface Props {
  fuel: Fuel;
  totals: NationalSummary;
  rate: number;
}

export default function NationalKpiRow({ fuel, totals, rate }: Props) {
  const { fuelLabel, finalNotices, shutoffs, reconnections, reconPer100 } = getMetrics(totals, rate, fuel);
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
        <p className={labelCls}>{fuelLabel} reconnections</p>
        <p className={valueCls}>{formatCondensed(reconnections)}</p>
        <p className={metaCls}>
          {reconPer100 > 0 ? `${reconPer100} per 100 shutoffs` : ''}
        </p>
      </div>
    </div>
  );
}
