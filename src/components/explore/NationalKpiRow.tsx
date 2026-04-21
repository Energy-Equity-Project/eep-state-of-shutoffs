import { getNationalTotals } from '../../lib/national';
import { formatCondensed } from '../../lib/format';

const totals = getNationalTotals();

const labelCls = 'text-[11px] md:text-xs text-[--color-text-secondary] mb-1.5';
const valueCls = 'text-[20px] md:text-[22px] font-medium mb-1';
const metaCls = 'text-[11px] md:text-xs text-[--color-text-tertiary]';
const cardCls = 'bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4';

const oneInN = totals.totalHouseholds > 0
  ? Math.round(totals.totalHouseholds / totals.electricFinalNotices)
  : 0;

export default function NationalKpiRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-[14px] mb-8">
      <div className={cardCls}>
        <p className={labelCls}>Electric shutoffs</p>
        <p className={valueCls}>{formatCondensed(totals.electricShutoffs)}</p>
        {/* No YoY delta: 2023 data not in feed */}
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Final notices sent</p>
        <p className={valueCls}>{formatCondensed(totals.electricFinalNotices)}</p>
        <p className={metaCls}>
          {oneInN > 0 ? `≈ 1 in ${oneInN.toLocaleString()} households` : ''}
        </p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Reconnections</p>
        <p className={valueCls}>{formatCondensed(totals.electricReconnections)}</p>
        <p className={metaCls}>
          {totals.electricShutoffsPerReconnection > 0
            ? `${totals.electricShutoffsPerReconnection} per 100 shutoffs`
            : ''}
        </p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>States reporting</p>
        <p className={valueCls}>
          {totals.statesReporting}/{totals.statesTotal}
        </p>
        <p className={metaCls}>
          {totals.statesExempt > 0 ? `${totals.statesExempt} states exempt` : 'All states reporting'}
        </p>
      </div>
    </div>
  );
}
