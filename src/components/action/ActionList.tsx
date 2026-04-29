import type { Audience } from '../../data/whatYouCanDo';

interface Props {
  audience: Audience;
  index: number;
}

export default function ActionList({ audience, index }: Props) {
  const total = audience.actions.length;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div>
      {/* Section rule row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-quiet)',
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-quiet)',
          }}
        >
          {audience.level}
        </span>
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          color: 'var(--color-ink)',
          margin: '0 0 10px',
        }}
      >
        {audience.title}
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12.5px',
          color: 'var(--color-pencil)',
          lineHeight: 1.55,
          margin: '0 0 14px',
        }}
      >
        {audience.why}
      </p>

      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-quiet)',
          marginBottom: '8px',
        }}
      >
        Recommended actions — {total}
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {audience.actions.map((action, i) => (
          <li
            key={i}
            style={{
              padding: '10px 0',
              borderTop: '1px solid var(--color-hairline)',
              borderBottom: '1px solid var(--color-hairline)',
              marginBottom: '-1px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: action.kind === 'long' ? 500 : 400,
                lineHeight: 1.55,
                color: 'var(--color-ink)',
              }}
            >
              {action.text}
            </span>
            {action.kind === 'long' && action.detail && (
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11.5px',
                  color: 'var(--color-pencil)',
                  lineHeight: 1.6,
                  marginTop: '6px',
                }}
              >
                {action.detail}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
