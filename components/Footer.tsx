'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div>{t('copy')}</div>
      <div style={{ marginTop: 10 }}>
        <a href="#">{t('terms')}</a> ·{' '}
        <a href="#">{t('privacy')}</a> ·{' '}
        <a href="#">{t('contact')}</a>
      </div>
    </footer>
  );
}
