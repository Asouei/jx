'use client';

import { useTranslations } from 'next-intl';
import type { SiteContent } from '@/lib/content-schema';

const glyphSvgs = [
  // Camera
  <svg key="cam" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  // Mail
  <svg key="mail" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  // Sparkle
  <svg key="spark" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  // Gift
  <svg key="gift" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>,
];

export default function WhatYouGet({ content }: { content: SiteContent }) {
  const t = useTranslations('wyg');
  const items = t.raw('items') as Array<{ title: string; sub: string }>;

  return (
    <section className="sect" id="get">
      <div className="wrap">
        <div className="reveal">
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div className="eyebrow">
              <span className="dot" /> {t('eyebrow')}
            </div>
          </div>
          <div className="wyg-card">
            <h2 className="h-2" style={{ textAlign: 'center' }}>
              {t('title')}
            </h2>
            <ul className="wyg-list">
              {items.map((item, i) => (
                <li key={i} className="wyg-item">
                  <div className="wyg-glyph">{glyphSvgs[i % glyphSvgs.length]}</div>
                  <div className="wyg-text">
                    <b>{item.title}</b> <span className="muted">— {item.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center' }}>
              <a
                className="btn btn-accent btn-glow"
                href={content.fanvue_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cta_open')}{' '}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
