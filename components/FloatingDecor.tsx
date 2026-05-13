'use client';

import { useState, useEffect } from 'react';

type Kind = 'mixed' | 'hearts' | 'sparkles';

interface FloaterItem {
  glyph: string;
  left: number;
  delay: number;
  dur: number;
  size: number;
  drift: number;
  spin: number;
  bottom: number;
}

export default function FloatingDecor({ density = 12, kind = 'mixed' as Kind }) {
  const [items, setItems] = useState<FloaterItem[]>([]);

  useEffect(() => {
    const glyphs =
      kind === 'hearts'
        ? ['♥', '♡', '♥']
        : kind === 'sparkles'
        ? ['✦', '✧', '✦', '✶']
        : ['♥', '✦', '✧', '♡', '✿'];
    setItems(
      Array.from({ length: density }).map((_, i) => ({
        glyph: glyphs[i % glyphs.length],
        left: Math.random() * 100,
        delay: -Math.random() * 24,
        dur: 14 + Math.random() * 14,
        size: 12 + Math.random() * 18,
        drift: (Math.random() - 0.5) * 140,
        spin: (Math.random() - 0.5) * 120,
        bottom: -10 - Math.random() * 30,
      }))
    );
  }, [density, kind]);

  if (items.length === 0) return null;

  return (
    <div className="floating-decor" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className="floater"
          style={{
            left: it.left + '%',
            bottom: it.bottom + '%',
            fontSize: it.size + 'px',
            animationDuration: it.dur + 's',
            animationDelay: it.delay + 's',
            ['--drift' as string]: it.drift + 'px',
            ['--spin' as string]: it.spin + 'deg',
          }}
        >
          {it.glyph}
        </span>
      ))}
    </div>
  );
}
