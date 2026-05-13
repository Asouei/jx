'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SiteContent } from '@/lib/content-schema';

function CountUp({ to, duration = 1500 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{n}</span>;
}

export default function StatsBar({ content }: { content: SiteContent }) {
  const t = useTranslations('stats');

  return (
    <section className="stats" aria-label="stats">
      <div className="stat">
        <div className="stat-num">
          <CountUp to={content.posts_count} />
          <span className="accent">+</span>
        </div>
        <div className="stat-label">
          <span className="si">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-1.1 0-1.99-.89-1.99-1.99h3.98c0 1.1-.89 1.99-1.99 1.99zm7-3H5v-1l2-3V10c0-3.08 1.63-5.64 4.5-6.32V3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.68C17.36 4.36 19 6.92 19 10v6l2 3v1z"/></svg>
          </span>
          {t('posts_label')}
        </div>
      </div>
      <div className="stat">
        <div className="stat-num">
          2<span className="accent">+</span>
        </div>
        <div className="stat-label">
          <span className="si">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </span>
          {t('per_week')}
        </div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{ fontSize: 'clamp(28px, 4.5vw, 40px)' }}>
          {t('dms')}
        </div>
        <div className="stat-label">
          <span className="si">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          {t('dms_sub')}
        </div>
      </div>
    </section>
  );
}
