import { useState } from 'react';

interface Props {
  message?: string;
}

export default function QualityFlag({
  message = 'This value may reflect incomplete reporting. Some utilities in this state do not report to the EIA.',
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        aria-label="Incomplete data"
        className="text-[--color-text-secondary] focus-visible:outline-2 focus-visible:outline-[--color-accent] rounded"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        type="button"
      >
        ⚠
      </button>
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded bg-[--color-ink] text-[--color-surface] text-xs px-3 py-2 leading-snug z-50"
        >
          {message}
        </span>
      )}
    </span>
  );
}
