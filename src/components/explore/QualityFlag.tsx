import { FLAG_DEFINITIONS, type EiaFlag } from '../../lib/shutoffs';

export function FlagAsterisk() {
  return (
    <sup
      aria-hidden="true"
      className="text-[--color-flag] font-semibold ml-0.5"
    >
      *
    </sup>
  );
}

export function FlagFootnote({ flags }: { flags: Set<EiaFlag> }) {
  if (flags.size === 0) return null;
  const ordered: EiaFlag[] = (['R', 'Q'] as EiaFlag[]).filter((f) => flags.has(f));
  return (
    <div className="mt-3 pt-3 border-t border-[--color-border-light] text-[11px] text-[--color-text-secondary] leading-snug space-y-0.5">
      {ordered.map((f) => (
        <p key={f}>
          <span className="text-[--color-flag] font-semibold">*</span>{' '}
          <span className="font-medium">{f}:</span> {FLAG_DEFINITIONS[f]}
        </p>
      ))}
    </div>
  );
}
