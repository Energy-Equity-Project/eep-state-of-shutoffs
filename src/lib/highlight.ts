/**
 * Splits `text` around `phrases`, returning an array of { text, highlight } segments.
 * Used by Astro components to wrap matched substrings in <Highlight>.
 */
export interface Segment {
  text: string;
  highlight: boolean;
}

export function renderWithHighlights(text: string, phrases: string[]): Segment[] {
  if (!phrases.length) return [{ text, highlight: false }];

  // Build a single regex alternating all phrases, longest first to avoid partial matches
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  const pattern = sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');

  const segments: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ text: text.slice(last, match.index), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ text: text.slice(last), highlight: false });
  }

  return segments;
}
