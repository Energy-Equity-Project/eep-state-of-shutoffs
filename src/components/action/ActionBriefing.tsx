import type { Audience } from '../../data/whatYouCanDo';

interface Props {
  audience: Audience;
  index: number;
  activeTabId: string;
}

export default function ActionBriefing({ audience, index, activeTabId }: Props) {
  const total = audience.actions.length;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      id="action-briefing-panel"
      role="tabpanel"
      aria-labelledby={activeTabId}
      tabIndex={0}
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-ink)',
        borderTop: 'none',
        outline: 'none',
      }}
    >
      {/* Stamp strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
          padding: '22px 36px',
          borderBottom: '1px dashed var(--color-hairline)',
          background: '#fbfaf3',
        }}
      >
        <div
          style={{
            border: '1.5px solid var(--color-ink)',
            padding: '8px 12px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.3,
              color: 'var(--color-ink)',
              whiteSpace: 'nowrap',
            }}
          >
            No. {num} / 07
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-ink)',
              marginTop: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            Action Briefing
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-quiet)',
              marginBottom: '4px',
            }}
          >
            {audience.level}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {audience.title}
          </h2>
        </div>
      </div>

      {/* Action list */}
      <div style={{ padding: '26px 36px 32px' }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-quiet)',
            marginBottom: '16px',
          }}
        >
          Recommended actions — {total}
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {audience.actions.map((action, i) => {
            const isLast = i === audience.actions.length - 1;
            const rowNum = String(i + 1).padStart(2, '0');
            return (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '0',
                  borderBottom: isLast ? 'none' : '1px dashed var(--color-hairline)',
                  padding: '12px 0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-quiet)',
                    width: '36px',
                    flexShrink: 0,
                    lineHeight: 1.55,
                    paddingTop: action.kind === 'long' ? '1px' : '0',
                  }}
                >
                  {rowNum}
                </span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14.5px',
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
                        fontSize: '13px',
                        color: 'var(--color-pencil)',
                        lineHeight: 1.55,
                        marginTop: '6px',
                        paddingLeft: '12px',
                        borderLeft: '2px solid var(--color-marker)',
                      }}
                    >
                      {action.detail}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Foot */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 36px',
          borderTop: '1.5px solid var(--color-ink)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-quiet)',
          }}
        >
          Tsunami of Shutoffs · eep.energy
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-quiet)',
          }}
        >
          {total} actions · pp. 01
        </span>
      </div>
    </div>
  );
}
