import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const NAV_LINKS = [
  { index: '01', label: 'Read', href: '/' },
  { index: '02', label: 'Explore the data', href: '/explore/' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement | null;
    const prevContainerOverflow = scrollContainer?.style.overflow ?? '';
    if (scrollContainer) scrollContainer.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            'button, a, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (scrollContainer) scrollContainer.style.overflow = prevContainerOverflow;
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-overlay"
        aria-label="Open navigation menu"
        className="w-[30px] h-[30px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[--color-accent]"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {mounted && createPortal(
        <div
          id="mobile-menu-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{ backgroundColor: '#fafaf7' }}
          className={`fixed inset-0 z-[9999] flex flex-col motion-reduce:transition-none transition-all duration-200 ease-out ${
            open
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[--color-border-light]">
            <span className="text-[10px] font-sans text-[--color-text-secondary] uppercase tracking-widest">
              Energy Equity Project
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="w-[30px] h-[30px] flex items-center justify-center text-2xl leading-none text-[--color-ink] focus-visible:outline-2 focus-visible:outline-[--color-accent]"
            >
              ×
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-6 pt-10">
            <ul className="space-y-8">
              {NAV_LINKS.map(({ index, label, href }) => (
                <li key={href} className="flex items-baseline gap-4">
                  <span className="text-xs font-sans text-[--color-text-secondary] tabular-nums w-6 shrink-0">
                    {index}
                  </span>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl font-bold text-[--color-ink] hover:text-[--color-accent] focus-visible:outline-2 focus-visible:outline-[--color-accent] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <footer className="px-6 py-8 text-xs text-[--color-text-secondary]">
            Energy Equity Project — Shutoffs Research
          </footer>
        </div>,
        document.body
      )}
    </>
  );
}
