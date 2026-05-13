'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import FloatingDecor from './FloatingDecor';
import type { SiteContent, MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function Hero({ content }: { content: SiteContent }) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const photos = [content.images.hero1, content.images.hero3, content.images.hero2];
  const [photoIdx, setPhotoIdx] = useState(0);
  const [slogIdx, setSlogIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhotoIdx((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(id);
  }, [photos.length]);

  useEffect(() => {
    const id = setInterval(() => setSlogIdx((i) => (i + 1) % content.hero_slogans.length), 3200);
    return () => clearInterval(id);
  }, [content.hero_slogans.length]);

  return (
    <section className="hero" id="top">
      <div className="hero-slides">
        {photos.map((src, i) => (
          <div
            key={src + i}
            className={`hero-slide ${i === photoIdx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-scrim" />
      <FloatingDecor density={14} kind="mixed" />
      <div className="hero-inner">
        <h1 className="hero-name">
          juli<span className="heart">♥</span>
        </h1>
        <div className="hero-handle">{content.handle}</div>
        <div className="hero-slogan-wrap" aria-live="polite">
          {content.hero_slogans.map((s, i) => (
            <div
              key={i}
              className={`hero-slogan ${i === slogIdx ? 'active' : ''}`}
            >
              {getText(s, locale)}
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-cue">
        <span>{t('scroll')}</span>
        <span className="arr" />
      </div>
    </section>
  );
}
