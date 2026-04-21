import type { MetricControls, Fuel, Metric, Unit } from '../../lib/national';
import SegmentedControl from './SegmentedControl';
import type { PillOption } from './SegmentedControl';

interface Props {
  value: MetricControls;
  onChange: (next: MetricControls) => void;
  compact?: boolean;
}

const FUEL_OPTIONS: PillOption<Fuel>[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'gas', label: 'Gas' },
  { value: 'combined', label: 'Combined' },
];

const METRIC_OPTIONS: PillOption<Metric>[] = [
  { value: 'shutoffs', label: 'Shutoffs' },
  { value: 'finalNotices', label: 'Final notices' },
  { value: 'reconnections', label: 'Reconnections' },
];

const UNIT_OPTIONS: PillOption<Unit>[] = [
  { value: 'rate', label: 'Percent (of customers)' },
  { value: 'count', label: 'Counts' },
];

function PillGroup<T extends string>({
  legend,
  options,
  selected,
  onSelect,
}: {
  legend: string;
  options: PillOption<T>[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSelect(options[(idx + 1) % options.length].value);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelect(options[(idx - 1 + options.length) % options.length].value);
    }
  }

  return (
    <fieldset className="flex flex-col gap-1 border-0 p-0 m-0">
      <legend className="sr-only">{legend}</legend>
      <p
        className="text-[11px] uppercase tracking-[0.12em] text-[--color-text-secondary]"
        aria-hidden="true"
      >
        {legend}
      </p>
      <SegmentedControl
        options={options}
        value={selected}
        onChange={onSelect}
        pillRole="radio"
        onPillKeyDown={handleKeyDown}
      />
    </fieldset>
  );
}

function Divider() {
  return (
    <div
      className="hidden md:block self-center flex-shrink-0"
      style={{ width: '1px', height: '20px', background: 'var(--color-border-light)', margin: '0 10px' }}
      aria-hidden="true"
    />
  );
}

export default function MetricBar({ value, onChange, compact: _compact }: Props) {
  return (
    <div
      className="flex flex-wrap items-start gap-y-3 py-3 px-4 border-y border-dashed border-[--color-border-light] mb-6"
      role="group"
      aria-label="View controls"
    >
      <PillGroup
        legend="FUEL"
        options={FUEL_OPTIONS}
        selected={value.fuel}
        onSelect={(fuel) => onChange({ ...value, fuel })}
      />
      <Divider />
      <PillGroup
        legend="METRIC"
        options={METRIC_OPTIONS}
        selected={value.metric}
        onSelect={(metric) => onChange({ ...value, metric })}
      />
      <Divider />
      <PillGroup
        legend="UNIT"
        options={UNIT_OPTIONS}
        selected={value.unit}
        onSelect={(unit) => onChange({ ...value, unit })}
      />
    </div>
  );
}
