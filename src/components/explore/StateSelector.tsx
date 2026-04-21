import { useState } from 'react';
import { STATE_CODES } from '../../lib/shutoffs';
import StatePickerSheet from './StatePickerSheet';

interface Props {
  currentCode: string;
}

const SORTED = Object.entries(STATE_CODES).sort((a, b) => a[1].localeCompare(b[1]));

export default function StateSelector({ currentCode }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  function navigate(code: string) {
    window.location.href = `/explore/${code}`;
  }

  const currentName = STATE_CODES[currentCode] ?? currentCode;

  return (
    <>
      {/* Desktop: native select */}
      <select
        value={currentCode}
        onChange={(e) => navigate(e.target.value)}
        className="hidden md:block text-[13px] px-2.5 py-1.5 border border-[--color-border-light] bg-[--color-surface] focus-visible:outline-2 focus-visible:outline-[--color-accent]"
        aria-label="Select a state"
      >
        {SORTED.map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>

      {/* Mobile: button that opens sheet */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="md:hidden w-full text-left text-[13px] px-2.5 py-1.5 border border-[--color-border-light] bg-[--color-surface] focus-visible:outline-2 focus-visible:outline-[--color-accent]"
      >
        {currentName} ▾
      </button>

      {sheetOpen && (
        <StatePickerSheet
          title="Select a state"
          currentCode={currentCode}
          mode="navigate"
          onSelect={(code) => { setSheetOpen(false); navigate(code); }}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}
