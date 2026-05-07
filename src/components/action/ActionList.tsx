import { TIERS } from '../../data/whatYouCanDo';
import type { Audience, ActionKind } from '../../data/whatYouCanDo';
import { createEndnoteRegistry } from '../../lib/endnotes';
import ActionText from './ActionText';
import ActionEndnotes from './ActionEndnotes';

interface Props {
  audience: Audience;
  index: number;
}

function getTierStyles(kind: ActionKind) {
  switch (kind) {
    case 'no-brainer':
      return {
        rowExtra: {} as React.CSSProperties,
        swatchStyle: { background: 'var(--color-card)', border: '1px solid var(--color-ink)' } as React.CSSProperties,
        headlineWeight: 400 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-quiet)',
      };
    case 'no-regrets':
      return {
        rowExtra: {
          borderLeft: '2px solid var(--color-marker)',
          background: 'linear-gradient(rgba(254,231,138,0.22), transparent 80%)',
          paddingLeft: '12px',
        } as React.CSSProperties,
        swatchStyle: { background: 'var(--color-marker)' } as React.CSSProperties,
        headlineWeight: 500 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-ink)',
      };
    case 'no-fear':
      return {
        rowExtra: {
          borderLeft: '3px solid var(--color-ink)',
          background: 'var(--color-soft)',
          paddingLeft: '12px',
        } as React.CSSProperties,
        swatchStyle: { background: 'var(--color-ink)' } as React.CSSProperties,
        headlineWeight: 600 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-ink)',
      };
  }
}

export default function ActionList({ audience, index }: Props) {
  const registry = createEndnoteRegistry();
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

      {/* Mobile legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        {TIERS.map((tier) => {
          const { swatchStyle } = getTierStyles(tier.kind);
          return (
            <div key={tier.kind} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  flexShrink: 0,
                  ...swatchStyle,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '9.5px',
                  color: 'var(--color-quiet)',
                }}
              >
                {tier.label}
              </span>
            </div>
          );
        })}
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {audience.actions.map((action, i) => {
          const tier = TIERS.find((t) => t.kind === action.kind)!;
          const { rowExtra, swatchStyle, headlineWeight, tierLabelColor } = getTierStyles(action.kind);

          return (
            <li
              key={i}
              style={{
                padding: '10px 0',
                borderTop: '1px solid var(--color-hairline)',
                borderBottom: '1px solid var(--color-hairline)',
                marginBottom: '-1px',
                ...rowExtra,
              }}
            >
              {/* Tier label row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '9px',
                    height: '9px',
                    flexShrink: 0,
                    ...swatchStyle,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: tierLabelColor,
                  }}
                >
                  {tier.label}
                </span>
              </div>
              {/* Headline */}
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: headlineWeight,
                  lineHeight: 1.55,
                  color: 'var(--color-ink)',
                }}
              >
                <ActionText text={action.text} registry={registry} />
              </span>
              {/* Detail */}
              {action.detail && (
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11.5px',
                    color: 'var(--color-pencil)',
                    lineHeight: 1.6,
                    marginTop: '6px',
                  }}
                >
                  <ActionText text={action.detail} registry={registry} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ActionEndnotes registry={registry} />
    </div>
  );
}
