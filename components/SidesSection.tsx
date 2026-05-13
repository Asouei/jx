'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SiteContent } from '@/lib/content-schema';

export default function SidesSection({ content }: { content: SiteContent }) {
  const t = useTranslations('sides');
  const [side, setSide] = useState<'soft' | 'wild'>('soft');

  return (
    <section className="sect" id="sides">
      <div className="wrap">
        <div className="reveal">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="eyebrow">
              <span className="dot" /> {t('eyebrow')}
            </div>
          </div>
          <div className="sides">
            <div className="sides-photo-wrap">
              <div className="sides-tape" />
              <div
                className={`sides-photo ${side === 'soft' ? 'active' : ''}`}
                style={{ backgroundImage: `url(${content.images.soft})` }}
              />
              <div
                className={`sides-photo ${side === 'wild' ? 'active' : ''}`}
                style={{ backgroundImage: `url(${content.images.wild})` }}
              />
            </div>
            <div className="sides-copy">
              <div className="sides-toggle">
                <button
                  className={side === 'soft' ? 'active' : ''}
                  onClick={() => setSide('soft')}
                >
                  {t('toggle_soft')}
                </button>
                <button
                  className={side === 'wild' ? 'active' : ''}
                  onClick={() => setSide('wild')}
                >
                  {t('toggle_wild')}
                </button>
              </div>
              <h2>
                {side === 'soft' ? (
                  <>the <em>soft</em> side</>
                ) : (
                  <>the <em>wild</em> side</>
                )}
              </h2>
              <p>{side === 'soft' ? t('soft_sub') : t('wild_sub')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
