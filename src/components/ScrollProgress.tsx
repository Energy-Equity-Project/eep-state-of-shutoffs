import { useEffect, useRef, useState } from 'react';

interface SectionDef {
  id: string;
  label: string;
}

interface Props {
  sections: SectionDef[];
}

export default function ScrollProgress({ sections }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<Element | null>(null);

  useEffect(() => {
    const container = document.querySelector('main[data-scroll-container]');
    scrollContainerRef.current = container;

    const observers: IntersectionObserver[] = [];

    sections.forEach((sec, i) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(i);
          }
        },
        {
          root: container,
          threshold: 0.5,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2"
    >
      {sections.map((sec, i) => (
        <button
          key={sec.id}
          onClick={() => scrollTo(sec.id)}
          aria-label={sec.label}
          className={`w-2.5 h-2.5 rounded-full border border-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
            i === activeIndex
              ? 'bg-ink'
              : 'bg-transparent hover:bg-ink/40'
          }`}
        />
      ))}
    </nav>
  );
}
