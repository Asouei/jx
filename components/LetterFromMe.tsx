'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { SiteContent, MultiLangText } from '@/lib/content-schema';

function getText(ml: MultiLangText, locale: string): string {
  return ml[locale as keyof MultiLangText] || ml.en;
}

export default function LetterFromMe({ content }: { content: SiteContent }) {
  const t = useTranslations('letter');
  const locale = useLocale();

  return (
    <section className="sect">
      <div className="wrap">
        <div className="reveal">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="eyebrow">
              <span className="dot" /> {t('eyebrow')}
            </div>
          </div>
          <div className="letter-wrap">
            <div
              className="letter-avatar"
              style={{ backgroundImage: `url(${content.images.letter})` }}
            />
            <div className="letter-stack">
              <div className="letter-bubble">
                {getText(content.letter_text, locale)}
              </div>
              <div className="letter-sign">
                {getText(content.letter_sign, locale)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
