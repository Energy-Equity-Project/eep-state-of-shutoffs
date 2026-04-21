import type { MetricControls, Fuel, Metric, Unit } from '../../lib/national';

interface Props {
  value: MetricControls;
  onChange: (next: MetricControls) => void;
  compact?: boolean;
}

const FUEL_OPTIONS: { value: Fuel; label: string }[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'gas', label: 'Gas' },
  { value: 'combined', label: 'Combined' },
];

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: 'shutoffs', label: 'Shutoffs' },
  { value: 'finalNotices', label: 'Final notices' },
  { value: 'reconnections', label: 'Reconnections' },
];

const UNIT_OPTIONS: { value: Unit; label: string }[] = [
  { value: 'rate', label: 'Percent (of customers)' },
  { value: 'count', label: 'Counts' },
];

function PillGroup<T extends string>({
  legend,
  options,
  selected,
  onSelect,
  compact,
}: {
  legend: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
  compact?: boolean;
}) {
  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
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
        className="text-[11px] uppercase tracking-[0.12em] text-[--color-text-secondary] mb-0"
        aria-hidden="true"
      >
        {legend}
      </p>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt, idx) => {
          const isActive = opt.value === selected;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(opt.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={[
                'text-[13px] px-3 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-[--color-accent]',
                compact ? 'py-1' : 'py-1.5',
                isActive
                  ? 'bg-[--color-ink] text-[--color-paper] border-[--color-ink]'
                  : 'bg-transparent text-[--color-text-secondary] border-[--color-border-medium] hover:text-[--color-ink]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
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

export default function MetricBar({ value, onChange, compact }: Props) {
  return (
    <div
      className={[
        'flex flex-wrap items-start gap-y-3',
        compact ? 'py-2 px-3' : 'py-3 px-4',
        'border-y border-dashed border-[--color-border-light] mb-6',
      ].join(' ')}
      role="group"
      aria-label="View controls"
    >
      <PillGroup
        legend="FUEL"
        options={FUEL_OPTIONS}
        selected={value.fuel}
        onSelect={(fuel) => onChange({ ...value, fuel })}
        compact={compact}
      />
      <Divider />
      <PillGroup
        legend="METRIC"
        options={METRIC_OPTIONS}
        selected={value.metric}
        onSelect={(metric) => onChange({ ...value, metric })}
        compact={compact}
      />
      <Divider />
      <PillGroup
        legend="UNIT"
        options={UNIT_OPTIONS}
        selected={value.unit}
        onSelect={(unit) => onChange({ ...value, unit })}
        compact={compact}
      />
    </div>
  );
}
