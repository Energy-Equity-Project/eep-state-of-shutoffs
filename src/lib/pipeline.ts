import { getStateAnnual, getStateHouseholds } from './shutoffs';
import { formatMultiplier, formatPercent } from './format';

export interface PipelineStage {
  id: 'households' | 'notices' | 'shutoffs' | 'reconnected' | 'never_reconnected';
  stageNumber: string;
  label: string;
  value: number | null;
  ratioCaption?: string;
  emphasis?: 'warn';
}

export interface PipelineData {
  stages: PipelineStage[];
  maxValue: number;
  noticesMultiplier: number | null;
}

export function getPipelineData(code: string, fuel: 'electric' | 'gas' = 'electric'): PipelineData {
  const annual = getStateAnnual(code);
  const households = getStateHouseholds(code);
  const notices = annual[`${fuel}_shutoff_notices_total`] || null;
  const shutoffs = annual[`${fuel}_shutoffs_total`];
  const reconnections = annual[`${fuel}_reconnections_total`] ?? null;
  const netShutoffs = annual[`${fuel}_net_shutoffs_total`] ?? null;

  const stages: PipelineStage[] = [];

  if (households != null) {
    stages.push({
      id: 'households',
      stageNumber: '01',
      label: 'Households',
      value: households,
      ratioCaption: 'Baseline',
    });
  }

  stages.push({
    id: 'notices',
    stageNumber: '02',
    label: 'Shutoff notices',
    value: notices,
    ratioCaption:
      notices != null && households != null
        ? `${formatMultiplier(notices / households)} per household`
        : undefined,
  });

  stages.push({
    id: 'shutoffs',
    stageNumber: '03',
    label: 'Shutoffs executed',
    value: shutoffs,
    ratioCaption:
      notices != null && notices > 0
        ? `${formatPercent(shutoffs / notices)} of notices`
        : undefined,
  });

  if (reconnections != null) {
    stages.push({
      id: 'reconnected',
      stageNumber: '04A',
      label: 'Reconnected',
      value: reconnections,
      ratioCaption:
        shutoffs > 0 ? `${formatPercent(reconnections / shutoffs)} of shutoffs` : undefined,
    });

    const neverReconnected =
      netShutoffs != null ? netShutoffs : shutoffs - reconnections;

    stages.push({
      id: 'never_reconnected',
      stageNumber: '04B',
      label: 'Never reconnected',
      value: neverReconnected,
      ratioCaption:
        shutoffs > 0 ? `${formatPercent(neverReconnected / shutoffs)} of shutoffs` : undefined,
      emphasis: 'warn',
    });
  }

  const nonNullValues = stages.map((s) => s.value).filter((v): v is number => v != null);
  const maxValue = nonNullValues.length > 0 ? Math.max(...nonNullValues) : 1;

  const noticesMultiplier =
    notices != null && notices > 0 && shutoffs > 0 ? notices / shutoffs : null;

  return { stages, maxValue, noticesMultiplier };
}
