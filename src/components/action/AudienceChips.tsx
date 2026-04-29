import { useRef } from 'react';
import type { Audience } from '../../data/whatYouCanDo';

interface Props {
  audiences: Audience[];
  active: string;
  onChange: (id: string) => void;
}

export default function AudienceChips({ audiences, active, onChange }: Props) {
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % audiences.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + audiences.length) % audiences.length;
    else return;

    e.preventDefault();
    onChange(audiences[next].id);
    chipRefs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Choose your role"
      style={{
        border: '1px solid var(--color-hairline-hard)',
        background: 'var(--color-card)',
        padding: '14px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
      }}
    >
      {audiences.map((audience, idx) => {
        const isActive = audience.id === active;
        return (
          <button
            key={audience.id}
            ref={(el) => { chipRefs.current[idx] = el; }}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(audience.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 500,
              padding: '6px 9px',
              border: '1px solid var(--color-hairline-hard)',
              borderRadius: '999px',
              background: isActive ? 'var(--color-ink)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--color-ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {audience.short}
          </button>
        );
      })}
    </div>
  );
}
