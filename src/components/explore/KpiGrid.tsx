import type { StateAnnual } from '../../data/shutoffs-types';
import { formatCount, formatPercent, formatDollars, formatChangePct } from '../../lib/format';
import { getMonthlyFlags } from '../../lib/shutoffs';
import { FlagAsterisk, FlagFootnote } from './QualityFlag';

interface Props {
  stateAnnual: StateAnnual;
  stateCode: string;
  electricBill: number | null;
  electricBillPctChange: number | null;
  gasBill: number | null;
  gasBillPctChange: number | null;
}

function billSubtext(bill: number | null, pctChange: number | null): string {
  if (bill == null) return 'Data unavailable';
  if (pctChange == null) return 'Change since 2020 unavailable';
  return `${formatChangePct(pctChange)} since 2020`;
}

export default function KpiGrid({
  stateAnnual,
  stateCode,
  electricBill,
  electricBillPctChange,
  gasBill,
  gasBillPctChange,
}: Props) {
  const electricFlags = getMonthlyFlags(stateCode, 'electric', ['shutoffs']);
  const gasFlags = getMonthlyFlags(stateCode, 'gas', ['shutoffs']);
  const allFlags = new Set([...electricFlags, ...gasFlags]);

  const electricBillValue = electricBill != null ? formatDollars(electricBill) : '—';
  const gasBillValue = gasBill != null ? formatDollars(gasBill) : '—';

  const labelCls = 'text-[11px] md:text-xs text-[--color-text-secondary] mb-1.5';
  const valueCls = 'text-[20px] md:text-[22px] font-medium mb-1';
  const metaCls = 'text-[11px] md:text-xs text-[--color-text-tertiary]';
  const cardCls = 'bg-white border border-[--color-border-light] p-4';

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={cardCls}>
          <p className={labelCls}>Electric shutoffs</p>
          <p className={valueCls}>
            {formatCount(stateAnnual.electric_shutoffs_total)}
            {electricFlags.size > 0 && <FlagAsterisk />}
          </p>
          <p className={metaCls}>
            {formatPercent(stateAnnual.electric_annual_shutoff_rate)} annual rate
          </p>
        </div>

        <div className={cardCls}>
          <p className={labelCls}>Gas shutoffs</p>
          <p className={valueCls}>
            {formatCount(stateAnnual.gas_shutoffs_total)}
            {gasFlags.size > 0 && <FlagAsterisk />}
          </p>
          <p className={metaCls}>
            {formatPercent(stateAnnual.gas_annual_shutoff_rate)} annual rate
          </p>
        </div>

        <div className={cardCls}>
          <p className={labelCls}>Avg electric monthly bill</p>
          <p className={valueCls}>{electricBillValue}</p>
          <p className={metaCls}>{billSubtext(electricBill, electricBillPctChange)}</p>
        </div>

        <div className={cardCls}>
          <p className={labelCls}>Avg gas monthly bill</p>
          <p className={valueCls}>{gasBillValue}</p>
          <p className={metaCls}>{billSubtext(gasBill, gasBillPctChange)}</p>
        </div>
      </div>
      <FlagFootnote flags={allFlags} />
    </div>
  );
}
