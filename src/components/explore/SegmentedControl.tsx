export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Pass 'radio' for MetricBar groups that expose arrow-key cycling */
  pillRole?: 'radio';
  onPillKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  pillRole,
  onPillKeyDown,
}: Props<T>) {
  return (
    <div className="flex gap-3">
      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            {...(pillRole === 'radio' ? { role: 'radio', 'aria-checked': isActive } : {})}
            onClick={() => onChange(opt.value)}
            onKeyDown={onPillKeyDown ? (e) => onPillKeyDown(e, idx) : undefined}
            style={
              isActive
                ? { backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)', borderColor: 'var(--color-ink)' }
                : undefined
            }
            className={`text-[13px] px-3 py-1.5 border focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors ${
              !isActive ? 'border-[--color-border-light] text-[--color-text-secondary]' : ''
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
