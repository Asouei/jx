'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { track } from '@/lib/analytics';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLang = (code: string) => {
    track('language_change', { from: locale, to: code });
    router.replace(pathname, { locale: code as 'en' | 'es' | 'de' });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium hover:opacity-80 transition-opacity bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)]"
        aria-label="Change language"
      >
        🌐
      </button>
      {open && (
        <div className="absolute right-0 top-11 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50 min-w-[80px]">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-[var(--accent)] hover:text-white transition-colors ${
                locale === l.code ? 'font-bold text-[var(--accent)]' : 'text-[var(--text)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
