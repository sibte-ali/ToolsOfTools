import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { krutiDevToUnicode } from '../../lib/krutidev/index';

interface KeyDef {
  code: string;
  label: string;
  normalKd: string;
  shiftKd: string;
  normalDev: string;
  shiftDev: string;
  width?: string;
  isSpecial?: boolean;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  // Row 1: Number row
  [
    { code: 'Backquote', label: '`', normalKd: '`', shiftKd: '~', normalDev: '़', shiftDev: '्' },
    { code: 'Digit1', label: '1', normalKd: '1', shiftKd: '!', normalDev: '1', shiftDev: '!' },
    { code: 'Digit2', label: '2', normalKd: '2', shiftKd: '@', normalDev: '2', shiftDev: 'slash' },
    { code: 'Digit3', label: '3', normalKd: '3', shiftKd: '#', normalDev: '3', shiftDev: 'रु' },
    { code: 'Digit4', label: '4', normalKd: '4', shiftKd: '$', normalDev: '4', shiftDev: '+' },
    { code: 'Digit5', label: '5', normalKd: '5', shiftKd: '%', normalDev: '5', shiftDev: 'ः' },
    { code: 'Digit6', label: '6', normalKd: '6', shiftKd: '^', normalDev: '6', shiftDev: '‘' },
    { code: 'Digit7', label: '7', normalKd: '7', shiftKd: '&', normalDev: '7', shiftDev: 'ऋ' },
    { code: 'Digit8', label: '8', normalKd: '8', shiftKd: '*', normalDev: '8', shiftDev: 'द्व' },
    { code: 'Digit9', label: '9', normalKd: '9', shiftKd: '(', normalDev: '9', shiftDev: 'त्र' },
    { code: 'Digit0', label: '0', normalKd: '0', shiftKd: ')', normalDev: '0', shiftDev: 'द्य' },
    { code: 'Minus', label: '-', normalKd: '-', shiftKd: '_', normalDev: '.', shiftDev: 'ऋ' },
    { code: 'Equal', label: '=', normalKd: '=', shiftKd: '+', normalDev: 'त्र', shiftDev: '्' },
    { code: 'Backspace', label: '⌫', normalKd: '', shiftKd: '', normalDev: 'Del', shiftDev: 'Del', width: 'w-16 sm:w-20', isSpecial: true },
  ],
  // Row 2: Top QWERTY row
  [
    { code: 'Tab', label: 'Tab', normalKd: '\t', shiftKd: '\t', normalDev: 'Tab', shiftDev: 'Tab', width: 'w-14 sm:w-16', isSpecial: true },
    { code: 'KeyQ', label: 'Q', normalKd: 'q', shiftKd: 'Q', normalDev: 'ु', shiftDev: 'फ' },
    { code: 'KeyW', label: 'W', normalKd: 'w', shiftKd: 'W', normalDev: 'ू', shiftDev: 'ॅ' },
    { code: 'KeyE', label: 'E', normalKd: 'e', shiftKd: 'E', normalDev: 'म', shiftDev: 'म्' },
    { code: 'KeyR', label: 'R', normalKd: 'r', shiftKd: 'R', normalDev: 'त', shiftDev: 'त्' },
    { code: 'KeyT', label: 'T', normalKd: 't', shiftKd: 'T', normalDev: 'ज', shiftDev: 'ज्' },
    { code: 'KeyY', label: 'Y', normalKd: 'y', shiftKd: 'Y', normalDev: 'ल', shiftDev: 'ल्' },
    { code: 'KeyU', label: 'U', normalKd: 'u', shiftKd: 'U', normalDev: 'न', shiftDev: 'न्' },
    { code: 'KeyI', label: 'I', normalKd: 'i', shiftKd: 'I', normalDev: 'प', shiftDev: 'प्' },
    { code: 'KeyO', label: 'O', normalKd: 'o', shiftKd: 'O', normalDev: 'व', shiftDev: 'व्' },
    { code: 'KeyP', label: 'P', normalKd: 'p', shiftKd: 'P', normalDev: 'च', shiftDev: 'च्' },
    { code: 'BracketLeft', label: '[', normalKd: '[', shiftKd: '{', normalDev: 'ख्', shiftDev: 'क्ष' },
    { code: 'BracketRight', label: ']', normalKd: ']', shiftKd: '}', normalDev: ',', shiftDev: 'द्व' },
    { code: 'Backslash', label: '\\', normalKd: '\\', shiftKd: '|', normalDev: '?', shiftDev: '।' },
  ],
  // Row 3: Home ASDF row
  [
    { code: 'CapsLock', label: 'Caps', normalKd: '', shiftKd: '', normalDev: 'Caps', shiftDev: 'Caps', width: 'w-16 sm:w-20', isSpecial: true },
    { code: 'KeyA', label: 'A', normalKd: 'a', shiftKd: 'A', normalDev: 'ं', shiftDev: '।' },
    { code: 'KeyS', label: 'S', normalKd: 's', shiftKd: 'S', normalDev: 'े', shiftDev: 'ै' },
    { code: 'KeyD', label: 'D', normalKd: 'd', shiftKd: 'D', normalDev: 'क', shiftDev: 'क्' },
    { code: 'KeyF', label: 'F', normalKd: 'f', shiftKd: 'F', normalDev: 'ि', shiftDev: 'थ्' },
    { code: 'KeyG', label: 'G', normalKd: 'g', shiftKd: 'G', normalDev: 'ह', shiftDev: 'ळ' },
    { code: 'KeyH', label: 'H', normalKd: 'h', shiftKd: 'H', normalDev: 'ी', shiftDev: 'भ्' },
    { code: 'KeyJ', label: 'J', normalKd: 'j', shiftKd: 'J', normalDev: 'र', shiftDev: 'श्र' },
    { code: 'KeyK', label: 'K', normalKd: 'k', shiftKd: 'K', normalDev: 'ा', shiftDev: 'ज्ञ' },
    { code: 'KeyL', label: 'L', normalKd: 'l', shiftKd: 'L', normalDev: 'स', shiftDev: 'स्' },
    { code: 'Semicolon', label: ';', normalKd: ';', shiftKd: ':', normalDev: 'य', shiftDev: 'रू' },
    { code: 'Quote', label: "'", normalKd: "'", shiftKd: '"', normalDev: 'श्', shiftDev: 'ष्' },
    { code: 'Enter', label: '↵ Enter', normalKd: '\n', shiftKd: '\n', normalDev: '↵', shiftDev: '↵', width: 'w-18 sm:w-22', isSpecial: true },
  ],
  // Row 4: Bottom ZXCV row
  [
    { code: 'ShiftLeft', label: '⇧ Shift', normalKd: '', shiftKd: '', normalDev: '⇧', shiftDev: '⇧', width: 'w-20 sm:w-24', isSpecial: true },
    { code: 'KeyZ', label: 'Z', normalKd: 'z', shiftKd: 'Z', normalDev: '्र', shiftDev: 'र्' },
    { code: 'KeyX', label: 'X', normalKd: 'x', shiftKd: 'X', normalDev: 'ग', shiftDev: 'ग्' },
    { code: 'KeyC', label: 'C', normalKd: 'c', shiftKd: 'C', normalDev: 'ब', shiftDev: 'ब्' },
    { code: 'KeyV', label: 'V', normalKd: 'v', shiftKd: 'V', normalDev: 'अ', shiftDev: 'ट' },
    { code: 'KeyB', label: 'B', normalKd: 'b', shiftKd: 'B', normalDev: 'इ', shiftDev: 'ठ' },
    { code: 'KeyN', label: 'N', normalKd: 'n', shiftKd: 'N', normalDev: 'द', shiftDev: 'छ' },
    { code: 'KeyM', label: 'M', normalKd: 'm', shiftKd: 'M', normalDev: 'उ', shiftDev: 'ड' },
    { code: 'Comma', label: ',', normalKd: ',', shiftKd: '<', normalDev: 'ए', shiftDev: 'ढ' },
    { code: 'Period', label: '.', normalKd: '.', shiftKd: '>', normalDev: 'ण्', shiftDev: 'झ' },
    { code: 'Slash', label: '/', normalKd: '/', shiftKd: '?', normalDev: 'ध्', shiftDev: 'घ्' },
    { code: 'ShiftRight', label: '⇧ Shift', normalKd: '', shiftKd: '', normalDev: '⇧', shiftDev: '⇧', width: 'w-20 sm:w-24', isSpecial: true },
  ],
];

const PRACTICE_PRESETS = [
  { label: 'Preset: National Motto', kd: "Hkkjr ,d egku ns'k gSA" },
  { label: 'Preset: Duty & Truth', kd: 'deZ gh /eZ gSA lR; dh fot; gksrh gSA' },
  { label: 'Preset: Conjuncts (क्ष त्र ज्ञ श्र)', kd: '{kek] =k.k] Kku vkSj Jfed dk lEekuA' },
  { label: 'Preset: Short-i Matra (ि)', kd: "fdlku fdrkc vkSj f'k{kk ls gh fodkl lEHko gSA" },
  { label: 'Preset: CPCT / SSC Practice', kd: "Hkkjrh deskad dk;kZy;ksa esa fgUnh Vad.k dk fo'ks\"k egRo gSA" },
];

export default function KrutiDevKeyboard() {
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [activeKeyCode, setActiveKeyCode] = useState<string | null>(null);
  const [typedKruti, setTypedKruti] = useState<string>("Hkkjr ,d egku ns'k gSA");
  const [copiedKruti, setCopiedKruti] = useState<boolean>(false);
  const [copiedUnicode, setCopiedUnicode] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute live Unicode Devanagari output
  const unicodeOutput = krutiDevToUnicode(typedKruti);

  // Synchronize physical keyboard interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftActive(true);
      }
      setActiveKeyCode(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftActive(false);
      }
      setActiveKeyCode(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle virtual on-screen key click
  const handleVirtualKeyClick = useCallback((key: KeyDef) => {
    if (key.code === 'ShiftLeft' || key.code === 'ShiftRight') {
      setIsShiftActive((prev) => !prev);
      return;
    }
    if (key.code === 'Backspace') {
      setTypedKruti((prev) => prev.slice(0, -1));
      return;
    }
    if (key.code === 'Enter') {
      setTypedKruti((prev) => prev + '\n');
      return;
    }
    if (key.code === 'Tab') {
      setTypedKruti((prev) => prev + '\t');
      return;
    }
    if (key.code === 'CapsLock') {
      setIsShiftActive((prev) => !prev);
      return;
    }

    const charToAdd = isShiftActive ? key.shiftKd : key.normalKd;
    setTypedKruti((prev) => prev + charToAdd);
  }, [isShiftActive]);

  const handleCopyUnicode = async () => {
    try {
      await navigator.clipboard.writeText(unicodeOutput);
      setCopiedUnicode(true);
      setTimeout(() => setCopiedUnicode(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleCopyKruti = async () => {
    try {
      await navigator.clipboard.writeText(typedKruti);
      setCopiedKruti(true);
      setTimeout(() => setCopiedKruti(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleClear = () => {
    setTypedKruti('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div class="space-y-8">
      {/* On-Screen Remington Keyboard Container */}
      <div class="rounded-2xl border border-neutral-200 bg-neutral-900 p-4 sm:p-6 text-white shadow-xl dark:border-neutral-800">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              Interactive Layout Map
            </span>
            <h2 class="mt-1 text-base sm:text-lg font-bold text-white">
              Kruti Dev 010 Remington QWERTY Keyboard
            </h2>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShiftActive((prev) => !prev)}
              class={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                isShiftActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md ring-2 ring-amber-400'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span>⇧ Shift:</span>
              <span>{isShiftActive ? 'ACTIVE (Upper Characters)' : 'OFF (Lower Characters)'}</span>
            </button>
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div class="mt-5 space-y-2 overflow-x-auto pb-2 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} class="flex justify-center gap-1 sm:gap-1.5 min-w-[700px]">
              {row.map((key) => {
                const isActive = activeKeyCode === key.code;
                const isShiftKey = key.code === 'ShiftLeft' || key.code === 'ShiftRight';
                const keyWidth = key.width || 'w-10 sm:w-12';
                const displayDevanagari = isShiftActive ? key.shiftDev : key.normalDev;

                return (
                  <button
                    key={key.code}
                    type="button"
                    onClick={() => handleVirtualKeyClick(key)}
                    class={`relative flex flex-col items-center justify-between rounded-lg p-1.5 sm:p-2 h-14 sm:h-16 text-xs transition duration-75 cursor-pointer font-sans ${keyWidth} ${
                      isActive || (isShiftKey && isShiftActive)
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-95'
                        : key.isSpecial
                        ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700/80 shadow-xs'
                    }`}
                    title={`Key: ${key.label} | Normal: ${key.normalDev} (${key.normalKd}) | Shift: ${key.shiftDev} (${key.shiftKd})`}
                  >
                    {/* Top row: English QWERTY letter badge */}
                    <div class="flex w-full items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span>{key.label}</span>
                      {!key.isSpecial && (
                        <span class={`text-[9px] ${isShiftActive ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                          {key.shiftDev}
                        </span>
                      )}
                    </div>

                    {/* Center: Prominent Devanagari Glyph */}
                    <div class="text-sm sm:text-base font-bold font-hindi">
                      {displayDevanagari}
                    </div>

                    {/* Bottom: subtle ASCII character */}
                    {!key.isSpecial && (
                      <div class="text-[9px] text-neutral-500 font-mono">
                        {isShiftActive ? key.shiftKd : key.normalKd}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Spacebar Row */}
          <div class="flex justify-center gap-1.5 min-w-[700px] pt-1">
            <button
              type="button"
              onClick={() => setTypedKruti((prev) => prev + ' ')}
              class="h-10 sm:h-11 w-72 sm:w-96 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition cursor-pointer flex items-center justify-center shadow-xs"
            >
              ␣ Spacebar
            </button>
          </div>
        </div>

        {/* Quick legend helper */}
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800 pt-3 text-xs text-neutral-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              Shifted Characters: Orange Badge
            </span>
            <span class="flex items-center gap-1">
              <span class="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
              Active Pressed Key
            </span>
          </div>
          <div>
            Click any on-screen key or type with your physical keyboard to practice below.
          </div>
        </div>
      </div>

      {/* Typing Practice Box */}
      <div class="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div>
            <h3 class="text-lg font-bold text-[#0D47A1] dark:text-white">
              Live Kruti Dev Hindi Typing Practice
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Type Remington keystrokes below to see instantaneous Unicode Hindi translation.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <select
              aria-label="Practice Presets"
              onChange={(e: any) => {
                const val = e.target.value;
                if (val) setTypedKruti(val);
              }}
              class="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
            >
              <option value="">Load Practice Sentence...</option>
              {PRACTICE_PRESETS.map((p, idx) => (
                <option key={idx} value={p.kd}>{p.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleClear}
              class="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer"
            >
              Clear Text
            </button>
          </div>
        </div>

        {/* Dual Input/Output Panels */}
        <div class="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Panel: Kruti Dev 010 Keystrokes Input */}
          <div class="flex flex-col space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                1. Kruti Dev 010 Keystrokes (Type or Click Keys)
              </label>
              <button
                type="button"
                onClick={handleCopyKruti}
                class="text-xs font-semibold text-[#1976D2] hover:underline dark:text-sky-400 cursor-pointer"
              >
                {copiedKruti ? '✓ Copied Keystrokes' : 'Copy Keystrokes'}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              rows={5}
              value={typedKruti}
              onInput={(e: any) => setTypedKruti(e.target.value)}
              placeholder="Type Remington keystrokes here (e.g. Hkkjr ,d egku ns'k gSA)..."
              class="w-full rounded-xl border border-neutral-300 bg-neutral-50 p-3.5 font-mono text-sm leading-relaxed text-neutral-900 shadow-inner focus:border-[#1976D2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1976D2]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:focus:border-sky-400"
            />
            <div class="text-[11px] text-neutral-500 dark:text-neutral-400">
              Length: {typedKruti.length} keystrokes
            </div>
          </div>

          {/* Right Panel: Live Unicode Devanagari Hindi Output */}
          <div class="flex flex-col space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                2. Live Unicode Hindi Preview (Readable Everywhere)
              </label>
              <button
                type="button"
                onClick={handleCopyUnicode}
                class="rounded-md bg-[#0D47A1] px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-[#1565C0] dark:bg-sky-600 dark:hover:bg-sky-500 transition cursor-pointer"
              >
                {copiedUnicode ? '✓ Copied Hindi' : 'Copy Hindi Text'}
              </button>
            </div>
            <div class="min-h-[128px] flex-1 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-base leading-relaxed text-neutral-900 shadow-inner dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white select-all">
              {unicodeOutput || (
                <span class="text-neutral-400 italic text-sm">
                  Hindi Devanagari translation will appear live as you type...
                </span>
              )}
            </div>
            <div class="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <span>Chars: {unicodeOutput.length} | Words: {unicodeOutput.trim() ? unicodeOutput.trim().split(/\s+/).length : 0}</span>
              <span class="text-green-600 dark:text-green-400 font-medium">✓ UTF-8 Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
