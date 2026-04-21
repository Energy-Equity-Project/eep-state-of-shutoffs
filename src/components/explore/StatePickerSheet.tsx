import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { STATE_CODES } from '../../lib/shutoffs-constants';

interface Props {
  title: string;
  currentCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
  mode: 'navigate' | 'add';
}

const ALL_CODES = Object.entries(STATE_CODES)
  .sort((a, b) => a[1].localeCompare(b[1]))
  .map(([code, name]) => ({ code, name }));

export default function StatePickerSheet({ title, currentCode, onSelect, onClose, mode }: Props) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? ALL_CODES.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase()))
    : ALL_CODES;

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!mounted) return null;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return createPortal(
    <>
      {/* Backdrop — click outside to close */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal panel — rendered above backdrop as a sibling */}
      <div
        className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="w-full md:w-[480px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col max-h-[80vh] pointer-events-auto">
          <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-[--color-border-light]">
            <h2 className="text-sm font-medium">{title}</h2>
            <button
              onClick={onClose}
              className="text-[--color-text-tertiary] text-lg leading-none focus-visible:outline-2 focus-visible:outline-[--color-accent] rounded"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="px-5 py-3 border-b border-[--color-border-light]">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search states…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[--color-border-light] bg-[--color-muted] focus-visible:outline-2 focus-visible:outline-[--color-accent]"
            />
          </div>

          <ul className="overflow-y-auto flex-1 py-2">
            {filtered.map(({ code, name }) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => onSelect(code)}
                  className={`w-full text-left px-5 py-2.5 text-sm hover:bg-[--color-muted] focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors ${
                    code === currentCode ? 'font-medium text-[--color-accent]' : 'text-[--color-ink]'
                  }`}
                >
                  {name}
                  <span className="ml-1.5 text-[--color-text-tertiary] text-xs">{code}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>,
    document.body
  );
}
