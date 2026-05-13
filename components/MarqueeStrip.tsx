'use client';

import { useLocale } from 'next-intl';
import type { MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function MarqueeStrip({ items }: { items: MultiLangText[] }) {
  const locale = useLocale();
  const texts = items.map((item) => getText(item, locale));
  const doubled = [...texts, ...texts];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((s, i) => (
          <span key={i} className="marquee-item">{s}</span>
        ))}
      </div>
    </div>
  );
}
