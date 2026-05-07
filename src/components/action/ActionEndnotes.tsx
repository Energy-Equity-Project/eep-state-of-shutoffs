import type { EndnoteRegistry } from '../../lib/endnotes';

interface Props { registry: EndnoteRegistry; }

export default function ActionEndnotes({ registry }: Props) {
  const entries = registry.entries();
  if (entries.length === 0) return null;
  return (
    <div style={{ padding: '20px 36px 24px', borderTop: '1px dashed var(--color-hairline)' }}>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          fontWeight: 700,
          marginBottom: '10px',
          color: 'var(--color-ink)',
        }}
      >
        <span className="highlight">References and Notes</span>
      </h3>
      <ol
        style={{
          margin: 0,
          paddingLeft: '20px',
          listStyleType: 'decimal',
          listStylePosition: 'outside',
        }}
      >
        {entries.map((entry) => (
          <li
            key={entry.number}
            id={`endnote-${entry.number}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--color-pencil)',
              lineHeight: 1.6,
              marginBottom: '6px',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: entry.html }} />
            {' '}
            <a
              href={`#endnote-ref-${entry.number}`}
              style={{ color: 'var(--color-quiet)', textDecoration: 'none' }}
              aria-label={`Back to citation ${entry.number}`}
            >↑</a>
          </li>
        ))}
      </ol>
    </div>
  );
}
