import { AUDIENCES, TIERS } from '../../data/whatYouCanDo';
import type { Audience, ActionKind } from '../../data/whatYouCanDo';
import { createEndnoteRegistry } from '../../lib/endnotes';
import ActionText from './ActionText';
import ActionEndnotes from './ActionEndnotes';

interface Props {
  audience: Audience;
  index: number;
  activeTabId: string;
}

function getTierStyles(kind: ActionKind) {
  switch (kind) {
    case 'no-brainer':
      return {
        rowExtra: { borderLeft: 'none', background: 'none', paddingLeft: 0 } as React.CSSProperties,
        swatchStyle: { background: 'var(--color-card)', border: '1px solid var(--color-ink)' } as React.CSSProperties,
        headlineWeight: 400 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-quiet)',
        detailExtra: {} as React.CSSProperties,
      };
    case 'no-regrets':
      return {
        rowExtra: {
          borderLeft: '2px solid var(--color-marker)',
          background: 'linear-gradient(rgba(254,231,138,0.18), transparent 70%)',
          paddingLeft: '14px',
        } as React.CSSProperties,
        swatchStyle: { background: 'var(--color-marker)', border: '1px solid var(--color-ink)' } as React.CSSProperties,
        headlineWeight: 500 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-ink)',
        detailExtra: {} as React.CSSProperties,
      };
    case 'no-fear':
      return {
        rowExtra: {
          borderLeft: '3px solid var(--color-ink)',
          background: 'var(--color-soft)',
          paddingLeft: '14px',
        } as React.CSSProperties,
        swatchStyle: { background: 'var(--color-ink)', border: '1px solid var(--color-ink)' } as React.CSSProperties,
        headlineWeight: 600 as React.CSSProperties['fontWeight'],
        tierLabelColor: 'var(--color-ink)',
        detailExtra: { borderLeft: '2px solid var(--color-ink)', paddingLeft: '12px' } as React.CSSProperties,
      };
  }
}

export default function ActionBriefing({ audience, index, activeTabId }: Props) {
  const registry = createEndnoteRegistry();
  const total = audience.actions.length;
  const nn = String(index + 1).padStart(2, '0');

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
      {/* Recipient strip */}
      <div
        style={{
          padding: '22px 36px',
          borderBottom: '1px dashed var(--color-hairline)',
          background: '#fbfaf3',
        }}
      >
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
          {audience.level} · Action briefing {nn} / {String(AUDIENCES.length).padStart(2, '0')}
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

      {/* Action list */}
      <div style={{ padding: '26px 36px 32px' }}>
        {/* List header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-quiet)',
            }}
          >
            Recommended actions — {total}
          </div>

          {/* Difficulty legend */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
            {TIERS.map((tier) => {
              const { swatchStyle } = getTierStyles(tier.kind);
              return (
                <div key={tier.kind} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      flexShrink: 0,
                      marginTop: '1px',
                      ...swatchStyle,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        lineHeight: 1.2,
                        color: 'var(--color-ink)',
                      }}
                    >
                      {tier.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '10px',
                        color: 'var(--color-quiet)',
                        lineHeight: 1.2,
                      }}
                    >
                      {tier.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {audience.actions.map((action, i) => {
            const isLast = i === audience.actions.length - 1;
            const rowNum = String(i + 1).padStart(2, '0');
            const tier = TIERS.find((t) => t.kind === action.kind)!;
            const { rowExtra, swatchStyle, headlineWeight, tierLabelColor, detailExtra } = getTierStyles(action.kind);

            return (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 0,
                  borderBottom: isLast ? 'none' : '1px dashed var(--color-hairline)',
                  ...rowExtra,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-quiet)',
                    width: '36px',
                    flexShrink: 0,
                    paddingTop: '22px',
                    lineHeight: 1.55,
                  }}
                >
                  {rowNum}
                </span>
                <div style={{ flex: 1, paddingTop: '10px', paddingBottom: '12px' }}>
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
                        width: '11px',
                        height: '11px',
                        flexShrink: 0,
                        ...swatchStyle,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '9.5px',
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
                      fontSize: '14.5px',
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
                        fontSize: '13px',
                        color: 'var(--color-pencil)',
                        lineHeight: 1.6,
                        marginTop: '6px',
                        ...detailExtra,
                      }}
                    >
                      <ActionText text={action.detail} registry={registry} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Endnotes */}
      <ActionEndnotes registry={registry} />

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
