import { useState, useEffect, useRef } from 'react';

interface Props {
  pathname: string;
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore/' },
];

export default function TopRightMenu({ pathname }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="top-right-menu-panel"
        aria-label="Open navigation menu"
        className="w-10 h-10 flex items-center justify-center bg-[--color-surface] border border-[--color-border-light] hover:bg-[--color-muted] transition-colors focus-visible:outline-2 focus-visible:outline-[--color-accent]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        id="top-right-menu-panel"
        role="menu"
        className={`absolute right-0 mt-2 min-w-[160px] bg-white border border-[--color-border-light] shadow-md transition-all duration-150 origin-top-right ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
        style={{ ['--tw-shadow' as string]: '0 4px 12px rgba(0,0,0,0.10)' }}
      >
        <div className="py-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[--color-muted] focus-visible:outline-2 focus-visible:outline-[--color-accent] ${
                isActive(href)
                  ? 'text-[--color-accent] font-semibold bg-[--color-muted]'
                  : 'text-[--color-ink]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
