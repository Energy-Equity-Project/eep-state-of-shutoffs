import { useState, useEffect } from 'react';
import { AUDIENCES } from '../../data/whatYouCanDo';
import AudienceTabs from './AudienceTabs';
import ActionBriefing from './ActionBriefing';
import AudienceChips from './AudienceChips';
import ActionList from './ActionList';

const VALID_IDS = new Set(AUDIENCES.map((a) => a.id));

function getInitialRole(): string {
  if (typeof window === 'undefined') return 'federal';
  const p = new URLSearchParams(window.location.search).get('role');
  return p && VALID_IDS.has(p) ? p : 'federal';
}

export default function WhatYouCanDoView() {
  const [activeRole, setActiveRole] = useState<string>(getInitialRole);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('role');
    if (p && !VALID_IDS.has(p)) {
      history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  function handleChange(id: string) {
    setActiveRole(id);
    history.replaceState({}, '', `?role=${id}`);
  }

  const activeIndex = AUDIENCES.findIndex((a) => a.id === activeRole);
  const activeAudience = AUDIENCES[activeIndex] ?? AUDIENCES[0];

  return (
    <div>
      {/* Headline block — shared */}
      <div style={{ marginBottom: '32px' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-text-secondary)',
            marginBottom: '10px',
          }}
        >
          A guide for action
        </p>

        {/* Desktop h1 */}
        <h1
          className="hidden md:block"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '40px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 16px',
          }}
        >
          Seven action briefings —{' '}
          <span className="highlight">one for every desk that can move this.</span>
        </h1>

        {/* Mobile h1 */}
        <h1
          className="md:hidden"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 12px',
          }}
        >
          What you can do{' '}
          <span className="highlight">depends on where you sit.</span>
        </h1>

        {/* Desktop lede */}
        <p
          className="hidden md:block"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            color: 'var(--color-pencil)',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: 0,
          }}
        >
          Each tab below is a memo addressed to one of the people, offices, or organizations who
          can change shutoff policy. Read yours. Forward another to whoever needs it.
        </p>

        {/* Mobile lede */}
        <p
          className="md:hidden"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            color: 'var(--color-pencil)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Pick your role. The page rewrites itself to show only what applies.
        </p>
      </div>

      {/* Desktop: tabs + briefing */}
      <div className="hidden md:block">
        <AudienceTabs
          audiences={AUDIENCES}
          active={activeRole}
          onChange={handleChange}
        />
        <ActionBriefing
          audience={activeAudience}
          index={activeIndex}
          activeTabId={`tab-${activeRole}`}
        />
      </div>

      {/* Mobile: chips + action list */}
      <div className="md:hidden">
        <AudienceChips
          audiences={AUDIENCES}
          active={activeRole}
          onChange={handleChange}
        />
        <div style={{ marginTop: '18px' }}>
          <ActionList audience={activeAudience} index={activeIndex} />
        </div>
      </div>
    </div>
  );
}
