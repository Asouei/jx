'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function TopBar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState<'soft' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('juli_theme') as 'soft' | 'dark' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'soft' ? 'dark' : 'soft';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('juli_theme', next);
  };

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
  ];

  const switchLang = (code: string) => {
    const segments = pathname.split('/');
    segments[1] = code;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="brand">
        <span className="brand-mark">juli</span>
        <span className="heart">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </span>
      </a>
      <div className="topbar-tools">
        <button
          className="icon-btn with-label"
          onClick={() => setLangOpen((v) => !v)}
          aria-label="Language"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>{locale.toUpperCase()}</span>
        </button>
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Theme"
        >
          {theme === 'soft' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          )}
        </button>
        {langOpen && (
          <div className="lang-menu" onMouseLeave={() => setLangOpen(false)}>
            {langs.map((l) => (
              <button
                key={l.code}
                className={l.code === locale ? 'active' : ''}
                onClick={() => switchLang(l.code)}
              >
                <span className="lang-code">{l.code.toUpperCase()}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
