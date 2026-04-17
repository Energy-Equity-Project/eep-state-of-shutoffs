import type { StateAnnual } from '../../data/shutoffs-types';
import { formatCount, formatPercent, formatMultiplier } from '../../lib/format';
import { getDataQuality } from '../../lib/shutoffs';
import QualityFlag from './QualityFlag';

interface Props {
  stateAnnual: StateAnnual;
  stateCode: string;
  electricRank: number;
  electricMultiplier: number;
  totalStates: number;
}

export default function KpiGrid({ stateAnnual, stateCode, electricRank, electricMultiplier, totalStates }: Props) {
  const elecFlag = getDataQuality(stateCode, 'electric');
  const gasFlag = getDataQuality(stateCode, 'gas');

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
        <p className="text-xs text-[--color-text-secondary] mb-1.5">vs. national average</p>
        <p className="text-[22px] font-medium mb-1">{formatMultiplier(electricMultiplier)}</p>
        <p className="text-xs text-[--color-text-tertiary]">Electric rate</p>
      </div>

      <div className="bg-[--color-surface] border border-[--color-border-light] rounded-lg p-4">
        <p className="text-xs text-[--color-text-secondary] mb-1.5">National rank</p>
        <p className="text-[22px] font-medium mb-1">{electricRank} of {totalStates}</p>
        <p className="text-xs text-[--color-text-tertiary]">1 = highest rate</p>
      </div>
    </div>
  );
}
