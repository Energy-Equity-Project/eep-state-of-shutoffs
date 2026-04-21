interface Props {
  rank: number;
  outOf: number;
  className?: string;
}

export default function StateRankCard({ rank, outOf, className }: Props) {
  return (
    <aside
      aria-label={`National ranking: ${rank} of ${outOf}`}
      className={`border border-[--color-border-light] bg-white inline-block px-3.5 md:px-5 py-2.5 md:py-4 ${className ?? ''}`}
    >
      <div className="md:hidden inline-flex gap-3.5 items-baseline">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[--color-text-tertiary]">
          National rank
        </span>
        <span className="font-serif text-[22px] leading-none font-medium">
          {rank}
          <span className="text-[14px] italic text-[--color-text-tertiary]"> of {outOf}</span>
        </span>
      </div>
      <div className="hidden md:block">
        <div className="font-sans text-[11px] uppercase tracking-[0.12em] text-[--color-text-tertiary]">
          National rank
        </div>
        <div className="font-serif text-[34px] leading-none font-medium mt-1.5 mb-1.5">
          {rank}
          <span className="text-[18px] italic text-[--color-text-tertiary]"> of {outOf}</span>
        </div>
        <div className="font-sans text-[11px] text-[--color-text-tertiary]">
          1 = highest rate
        </div>
      </div>
    </aside>
  );
}
