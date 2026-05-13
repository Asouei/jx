'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { SiteContent, MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function CosplayPoll({ content }: { content: SiteContent }) {
  const t = useTranslations('poll');
  const locale = useLocale();
  const { poll } = content;

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myVote, setMyVote] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedVote = localStorage.getItem(`juli_poll_vote_${poll.id}`);
      if (storedVote) setMyVote(storedVote);

      const storedCounts = localStorage.getItem(`juli_poll_counts_${poll.id}`);
      if (storedCounts) {
        setCounts(JSON.parse(storedCounts));
      } else {
        // Initialize from server data
        const initial: Record<string, number> = {};
        poll.options.forEach((opt) => {
          initial[opt.id] = opt.real_votes + opt.adjustment;
        });
        setCounts(initial);
      }
    } catch {
      const initial: Record<string, number> = {};
      poll.options.forEach((opt) => {
        initial[opt.id] = opt.real_votes + opt.adjustment;
      });
      setCounts(initial);
    }
    setLoaded(true);
  }, [poll]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const vote = useCallback(
    (id: string) => {
      if (myVote) return;
      const newCounts = { ...counts, [id]: (counts[id] || 0) + 1 };
      setCounts(newCounts);
      setMyVote(id);
      try {
        localStorage.setItem(`juli_poll_vote_${poll.id}`, id);
        localStorage.setItem(`juli_poll_counts_${poll.id}`, JSON.stringify(newCounts));
      } catch {}
      // Also send to server
      fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: poll.id, option_id: id }),
      }).catch(() => {});
    },
    [myVote, counts, poll.id]
  );

  if (!poll.active || !loaded) return null;

  return (
    <section className="sect" id="poll" style={{ position: 'relative' }}>
      <div
        className="orb"
        style={{ width: 360, height: 360, top: 40, left: -120, background: 'var(--c-accent)' }}
      />
      <div
        className="orb"
        style={{ width: 280, height: 280, bottom: 40, right: -80, background: 'var(--c-accent-2)' }}
      />
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="reveal">
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div className="eyebrow">
              <span className="dot" /> {t('eyebrow')}
            </div>
          </div>
          <h2 className="h-2" style={{ textAlign: 'center' }}>
            {getText(poll.title, locale)}
          </h2>
          <p className="p-lede" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
            {getText(poll.subtitle, locale)}
          </p>

          <div className="poll-grid">
            {poll.options.map((opt) => {
              const c = counts[opt.id] || 0;
              const pct = total ? Math.round((c / total) * 100) : 0;
              const voted = myVote === opt.id;
              const dimmed = myVote !== null && !voted;
              const showResults = myVote !== null;

              return (
                <div
                  key={opt.id}
                  className={`poll-card${voted ? ' voted' : ''}${dimmed ? ' dimmed' : ''}${showResults ? ' has-results' : ''}`}
                  onClick={() => vote(opt.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && vote(opt.id)}
                >
                  <div
                    className="photo"
                    style={{ backgroundImage: `url(${opt.image_url})` }}
                  />
                  <div className="scrim" />
                  <div className="check" aria-hidden="true">✓</div>
                  <div className="meta">
                    <div className="name">{opt.name}</div>
                    <div className="tag">{getText(opt.tag, locale)}</div>
                  </div>
                  {showResults && (
                    <div className="bar">
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: pct + '%' }} />
                      </div>
                      <div className="pct">{pct}%</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="poll-foot">
            {myVote ? (
              <>
                {t('voted')} · <b>{total.toLocaleString()}</b> {t('votes')}
              </>
            ) : (
              <>
                <b>{total.toLocaleString()}</b> {t('votes')}
              </>
            )}
          </div>

          {myVote && (
            <div style={{ textAlign: 'center', marginTop: 22 }}>
              <a
                className="btn btn-ghost"
                href={content.fanvue_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cta_after')}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
