'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import type { SiteContent, MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function GiveawayBanner({ content }: { content: SiteContent }) {
  const t = useTranslations('giveaway');
  const locale = useLocale();

  if (!content.giveaway_active) return null;

  return (
    <section className="sect-tight" style={{ paddingBottom: 32 }}>
      <div className="wrap">
        <div className="giveaway reveal">
          <div className="giveaway-text">
            <span className="giveaway-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
              {t('tag')}
            </span>
            <div className="giveaway-title">
              {getText(content.giveaway_title, locale)}
            </div>
          </div>
          <a
            className="btn"
            href={content.giveaway_cta_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getText(content.giveaway_cta_text, locale)}{' '}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
