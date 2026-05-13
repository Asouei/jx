'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import FloatingDecor from './FloatingDecor';
import type { SiteContent } from '@/lib/content-schema';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function FanvueCard({ content }: { content: SiteContent }) {
  const t = useTranslations('fv');
  const [now, setNow] = useState(Date.now());

  const targetAt = useMemo(
    () => Date.now() + content.next_drop_hours * 3600 * 1000,
    [content.next_drop_hours]
  );

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, targetAt - now);
  const sec = Math.floor(remaining / 1000) % 60;
  const min = Math.floor(remaining / 60000) % 60;
  const hr = Math.floor(remaining / 3600000) % 24;
  const day = Math.floor(remaining / 86400000);

  const tiles = [
    content.images.fv1,
    content.images.fv2,
    content.images.fv3,
    content.images.fv4,
    content.images.fv5,
    content.images.fv6,
  ];

  return (
    <section className="sect fv-section" id="fanvue">
      <FloatingDecor density={10} kind="sparkles" />
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="reveal">
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span className="fv-seal fv-seal-live">
              <span className="live-dot" /> {t('live_badge')}
            </span>
          </div>
          <div className="fv-kicker">{t('kicker')}</div>
          <p className="fv-tease">{t('tease')}</p>

          <div className="fv-card">
            <div className="fv-grid">
              {tiles.map((src, i) => (
                i >= 3 ? (
                  <div key={i} className="fv-tile-wrap">
                    <div
                      className="fv-tile fv-tile-blurred"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                    <div className="fv-lock-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z"/></svg>
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="fv-tile"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                )
              ))}
            </div>

            <div className="fv-body">
              <div className="fv-next-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-1.1 0-1.99-.89-1.99-1.99h3.98c0 1.1-.89 1.99-1.99 1.99zm7-3H5v-1l2-3V10c0-3.08 1.63-5.64 4.5-6.32V3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.68C17.36 4.36 19 6.92 19 10v6l2 3v1z"/></svg>
                {t('next_drop')}
              </div>

              <div className="countdown" aria-live="polite">
                <div className="cd-cell">
                  <div className="cd-num">{pad(day)}</div>
                  <div className="cd-lbl">{t('d')}</div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num">{pad(hr)}</div>
                  <div className="cd-lbl">{t('h')}</div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num">{pad(min)}</div>
                  <div className="cd-lbl">{t('m')}</div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num">{pad(sec)}</div>
                  <div className="cd-lbl">{t('s')}</div>
                </div>
              </div>

              <ul className="fv-perks">
                {(t.raw('perks') as string[]).map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

              <a
                className="btn btn-accent btn-glow"
                href={content.fanvue_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cta_open')}{' '}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <div className="fv-foot">{t('foot_open')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
