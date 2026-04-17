import type { StateAnnual } from '../../data/shutoffs-types';
import { formatCount } from '../../lib/format';

interface Props {
  stateAnnual: StateAnnual;
  stateName: string;
}

export default function WarningsVsDisconnections({ stateAnnual, stateName }: Props) {
  const notices = stateAnnual.electric_shutoff_notices_total;
  const disconnected = stateAnnual.electric_shutoffs_total;
  const resolvedPct = notices > 0 ? Math.round(((notices - disconnected) / notices) * 100) : 0;

  const caption = `${stateName} utilities sent ${formatCount(notices)} electric shutoff notices in 2024. About ${resolvedPct}% were resolved before disconnection — typically by payment plans, loans, or skipping other bills under pressure.`;

  const disconnectBarWidth = notices > 0 ? `${((disconnected / notices) * 100).toFixed(1)}%` : '0%';

  return (
    <div className="bg-[--color-surface] border border-[--color-border-light] rounded-xl px-6 py-5 mb-6">
      <h2 className="text-base font-medium mb-1">Warnings vs. disconnections</h2>
      <p className="text-[13px] text-[--color-text-secondary] mb-4 max-w-xl">{caption}</p>

      <div className="grid gap-2.5">
        <div className="grid grid-cols-[90px_1fr_110px] gap-3 items-center">
          <span className="text-[13px] text-[--color-text-secondary]">Notices sent</span>
          <div className="h-[22px] bg-[--color-muted] rounded-sm overflow-hidden">
            <div className="h-full bg-[--color-neutral-bar-light]" style={{ width: '100%' }} />
          </div>
          <span className="text-[13px] font-medium text-right">{formatCount(notices)}</span>
        </div>

        <div className="grid grid-cols-[90px_1fr_110px] gap-3 items-center">
          <span className="text-[13px] text-[--color-text-secondary]">Disconnected</span>
          <div className="h-[22px] bg-[--color-muted] rounded-sm overflow-hidden">
            <div className="h-full bg-[--color-accent]" style={{ width: disconnectBarWidth }} />
          </div>
          <span className="text-[13px] font-medium text-right">{formatCount(disconnected)}</span>
        </div>
      </div>
    </div>
  );
}
