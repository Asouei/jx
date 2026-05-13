'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { SiteContent, MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function PollTeaser({ content }: { content: SiteContent }) {
  const t = useTranslations('poll');
  const locale = useLocale();
  const { poll } = content;

  if (!poll.active) return null;

  const total = poll.options.reduce((a, o) => a + o.real_votes + o.adjustment, 0);

  return (
    <a href="#poll" className="poll-teaser">
      <span className="poll-teaser-dot" />
      <span className="poll-teaser-label">{t('teaser')}</span>
      <span className="poll-teaser-title">{getText(poll.title, locale)}</span>
      <span className="poll-teaser-count">
        {total.toLocaleString()} {t('votes')}
      </span>
      <span className="poll-teaser-arrow">↓</span>
    </a>
  );
}
