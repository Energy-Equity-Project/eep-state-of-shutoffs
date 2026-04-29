import { useRef } from 'react';
import type { Audience } from '../../data/whatYouCanDo';

interface Props {
  audiences: Audience[];
  active: string;
  onChange: (id: string) => void;
}

export default function AudienceTabs({ audiences, active, onChange }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % audiences.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + audiences.length) % audiences.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = audiences.length - 1;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(audiences[idx].id);
      return;
    } else return;

    e.preventDefault();
    onChange(audiences[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Audience"
      style={{
        display: 'flex',
        borderBottom: '1.5px solid var(--color-ink)',
      }}
    >
      {audiences.map((audience, idx) => {
        const isActive = audience.id === active;
        const isLast = idx === audiences.length - 1;
        const num = String(idx + 1).padStart(2, '0');

        return (
          <button
            key={audience.id}
            id={`tab-${audience.id}`}
            ref={(el) => { tabRefs.current[idx] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls="action-briefing-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(audience.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '10px 8px 10px',
              cursor: 'pointer',
              background: isActive ? 'var(--color-card)' : 'transparent',
              border: 'none',
              borderTop: isActive ? '1.5px solid var(--color-ink)' : '1.5px solid transparent',
              borderLeft: isActive ? '1px solid var(--color-ink)' : '1px solid transparent',
              borderRight: isActive
                ? '1px solid var(--color-ink)'
                : isLast
                ? 'none'
                : '1px dashed var(--color-hairline)',
              borderBottom: isActive ? '1.5px solid var(--color-card)' : 'none',
              marginBottom: isActive ? '-1.5px' : '0',
              color: isActive ? 'var(--color-ink)' : 'var(--color-quiet)',
              outline: 'none',
            }}
          >
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--color-marker)',
                  display: 'block',
                }}
              />
            )}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-quiet)',
                lineHeight: 1,
                marginTop: isActive ? '6px' : '3px',
              }}
            >
              {num}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {audience.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
