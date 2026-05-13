'use client';

import { useState, useEffect } from 'react';
import { track } from '@/lib/analytics';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'soft' | 'dark'>('soft');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'soft' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'dark' : '');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'soft' ? 'dark' : 'soft';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
    track('theme_change', { to: next });
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:opacity-80 transition-opacity bg-[var(--bg-elevated)] border border-[var(--border)]"
      aria-label="Toggle theme"
    >
      {theme === 'soft' ? '☀️' : '🌙'}
    </button>
  );
}
