import { renderSegments, type EndnoteRegistry } from '../../lib/endnotes';

interface Props { text: string; registry: EndnoteRegistry; }

export default function ActionText({ text, registry }: Props) {
  const segments = renderSegments(text, { highlights: [], registry });
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'text') return <span key={i}>{seg.text}</span>;
        if (seg.type === 'highlight') return <span key={i} className="highlight">{seg.text}</span>;
        return (
          <sup
            key={i}
            className="endnote-ref"
            id={seg.isFirst ? `endnote-ref-${seg.number}` : undefined}
          >
            <a href={`#endnote-${seg.number}`}>{seg.number}</a>
          </sup>
        );
      })}
    </>
  );
}
