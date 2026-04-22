import { endnotes } from '../data/endnotes';

export interface EndnoteEntry {
  number: number;
  key: string;
  html: string;
}

export interface EndnoteRegistry {
  register(key: string): { number: number; isFirst: boolean };
  entries(): EndnoteEntry[];
}

export function createEndnoteRegistry(): EndnoteRegistry {
  const map = new Map<string, number>();

  return {
    register(key: string) {
      if (!(key in endnotes)) {
        throw new Error(`Endnote key "${key}" not found in src/data/endnotes.ts`);
      }
      if (map.has(key)) {
        return { number: map.get(key)!, isFirst: false };
      }
      const number = map.size + 1;
      map.set(key, number);
      return { number, isFirst: true };
    },
    entries() {
      return Array.from(map.entries()).map(([key, number]) => ({
        number,
        key,
        html: endnotes[key],
      }));
    },
  };
}

export type TextSegment = { type: 'text'; text: string };
export type HighlightSegment = { type: 'highlight'; text: string };
export type EndnoteSegment = { type: 'endnote'; key: string; number: number; isFirst: boolean };
export type Segment = TextSegment | HighlightSegment | EndnoteSegment;

const ENDNOTE_RE = /^\[\^[a-zA-Z0-9_-]+\]$/;

export function renderSegments(
  text: string,
  { highlights, registry }: { highlights: string[]; registry: EndnoteRegistry }
): Segment[] {
  const escapedHighlights = [...highlights]
    .sort((a, b) => b.length - a.length)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  const patterns = [
    ...escapedHighlights,
    '\\[\\^[a-zA-Z0-9_-]+\\]',
  ];

  const regex = new RegExp(`(${patterns.join('|')})`, 'g');
  const segments: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', text: text.slice(last, match.index) });
    }
    const matched = match[0];
    if (ENDNOTE_RE.test(matched)) {
      const key = matched.slice(2, -1);
      const { number, isFirst } = registry.register(key);
      segments.push({ type: 'endnote', key, number, isFirst });
    } else {
      segments.push({ type: 'highlight', text: matched });
    }
    last = match.index + matched.length;
  }

  if (last < text.length) {
    segments.push({ type: 'text', text: text.slice(last) });
  }

  return segments;
}
