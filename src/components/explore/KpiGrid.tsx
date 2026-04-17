import type { StateAnnual } from '../../data/shutoffs-types';
import { formatCount, formatPercent, formatDollars, formatChangePct } from '../../lib/format';
import { getDataQuality } from '../../lib/shutoffs';
import QualityFlag from './QualityFlag';

interface Props {
  stateAnnual: StateAnnual;
  stateCode: string;
  electricRank: number;
  totalStates: number;
  costBill2024: number | null;
  costTotalPctChange: number | null;
}

export default function KpiGrid({ stateAnnual, stateCode, electricRank, totalStates, costBill2024, costTotalPctChange }: Props) {
  const elecFlag = getDataQuality(stateCode, 'electric');
  const gasFlag = getDataQuality(stateCode, 'gas');

  const billValue = costBill2024 != null ? formatDollars(costBill2024) : '—';
  const billSubtext = costBill2024 == null
    ? 'Data unavailable'
    : costTotalPctChange == null
      ? 'Change since 2020 unavailable'
      : `${formatChangePct(costTotalPctChange)} since 2020`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <div className="bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4">
        <p className="text-xs text-[--color-text-secondary] mb-1.5">Electric shutoffs</p>
        <p className="text-[22px] font-medium mb-1">
          {formatCount(stateAnnual.electric_shutoffs_total)}
          {elecFlag && <QualityFlag />}
        </p>
        <p className="text-xs text-[--color-text-tertiary]">
          {formatPercent(stateAnnual.electric_annual_shutoff_rate)} annual rate
        </p>
      </div>

      <div className="bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4">
        <p className="text-xs text-[--color-text-secondary] mb-1.5">Gas shutoffs</p>
        <p className="text-[22px] font-medium mb-1">
          {formatCount(stateAnnual.gas_shutoffs_total)}
          {gasFlag && <QualityFlag />}
        </p>
        <p className="text-xs text-[--color-text-tertiary]">
          {formatPercent(stateAnnual.gas_annual_shutoff_rate)} annual rate
        </p>
      </div>

      <div className="bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4">
        <p className="text-xs text-[--color-text-secondary] mb-1.5">National rank</p>
        <p className="text-[22px] font-medium mb-1">{electricRank} of {totalStates}</p>
        <p className="text-xs text-[--color-text-tertiary]">1 = highest rate</p>
      </div>

      <div className="bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4">
        <p className="text-xs text-[--color-text-secondary] mb-1.5">Avg monthly utility bill</p>
        <p className="text-[22px] font-medium mb-1">{billValue}</p>
        <p className="text-xs text-[--color-text-tertiary]">{billSubtext}</p>
      </div>
    </div>
  );
}
