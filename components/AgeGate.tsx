'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AgeGate() {
  const t = useTranslations('age');
  const [verified, setVerified] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('juli_age_verified');
    if (stored === 'true') {
      setVerified(true);
      document.body.classList.remove('no-scroll');
    } else {
      setVerified(false);
      setVisible(true);
      document.body.classList.add('no-scroll');
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem('juli_age_verified', 'true');
    setVerified(true);
    document.body.classList.remove('no-scroll');
  };

  const handleLeave = () => {
    window.location.href = 'https://google.com';
  };

  if (verified || !visible) return null;

  return (
    <div className="age-gate">
      <div
        className="age-gate-bg"
        style={{ backgroundImage: 'url(/img/hero-3.jpg)' }}
      />
      <div className="age-card">
        <div className="age-eyebrow">{t('eyebrow')}</div>
        <h1>{t('title')}</h1>
        <p>{t('sub')}</p>
        <div className="age-actions">
          <button className="btn btn-yes" onClick={handleEnter}>
            {t('yes')}
          </button>
          <button className="btn btn-no" onClick={handleLeave}>
            {t('no')}
          </button>
        </div>
      </div>
    </div>
  );
}
