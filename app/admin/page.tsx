'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { SiteContent, MultiLangText, ImageSlots } from '@/lib/content-schema';

const LANGS = ['en', 'es', 'de'] as const;

const IMAGE_LABELS: Record<keyof ImageSlots, string> = {
  hero1: 'Hero photo 1',
  hero2: 'Hero photo 2',
  hero3: 'Hero photo 3',
  letter: 'Letter avatar',
  tg: 'Telegram preview',
  ig: 'Instagram preview',
  fv1: 'Fanvue tile 1',
  fv2: 'Fanvue tile 2',
  fv3: 'Fanvue tile 3',
  fv4: 'Fanvue tile 4',
  fv5: 'Fanvue tile 5',
  fv6: 'Fanvue tile 6',
  soft: 'Soft side photo',
  wild: 'Wild side photo',
};

function MultiLangField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: MultiLangText;
  onChange: (v: MultiLangText) => void;
  textarea?: boolean;
}) {
  const [tab, setTab] = useState<'en' | 'es' | 'de'>('en');
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-1 mb-1">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            className={`px-3 py-1 text-xs rounded-t-lg ${tab === l ? 'bg-rose-600 text-white' : 'bg-gray-200'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      {textarea ? (
        <textarea
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-300 outline-none"
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-300 outline-none"
        />
      )}
    </div>
  );
}

function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const doUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch {
        alert('Upload failed (server error): ' + text.substring(0, 200));
        return;
      }
      if (data.url) {
        onChange(data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) doUpload(file);
  };

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1 text-gray-600">{label}</label>
      <div
        className={`flex items-center gap-3 p-2 border-2 border-dashed rounded-xl transition-colors ${
          dragOver ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 text-xl">+</div>
        )}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-300 outline-none"
            placeholder="URL or drag & drop image"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <label className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs cursor-pointer hover:bg-rose-200 font-medium whitespace-nowrap">
              {uploading ? 'Uploading...' : '📷 Choose file'}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            <span className="text-[10px] text-gray-400">or drag here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left font-semibold text-sm flex justify-between items-center bg-white hover:bg-gray-50"
      >
        {title}
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-6 py-4 bg-white border-t border-gray-100">{children}</div>}
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {});
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setMessage('Saved!');
      } else {
        const data = await res.json();
        setMessage('Error: ' + (data.error || 'Unknown'));
      }
    } catch (e) {
      setMessage('Error: ' + String(e));
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (status === 'loading' || !content) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }
  if (!session) return null;

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((c) => c ? { ...c, [key]: value } : c);
  };

  const updateImage = (key: keyof ImageSlots, url: string) => {
    setContent((c) => c ? { ...c, images: { ...c.images, [key]: url } } : c);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">xojuli.com Admin</h1>
          <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700">
            Sign out
          </button>
        </div>

        {/* Links */}
        <Section title="Links & Settings" defaultOpen>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fanvue URL</label>
            <input type="url" value={content.fanvue_url} onChange={(e) => update('fanvue_url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Telegram URL</label>
            <input type="url" value={content.telegram_url} onChange={(e) => update('telegram_url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input type="url" value={content.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Handle</label>
            <input type="text" value={content.handle} onChange={(e) => update('handle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </Section>

        {/* Next Drop Countdown */}
        <Section title="Fanvue / Next Drop">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Next post drops in (hours)</label>
            <input
              type="number"
              value={content.next_drop_hours}
              onChange={(e) => update('next_drop_hours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              min={0}
              max={720}
              step={1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Posts count</label>
            <input
              type="number"
              value={content.posts_count}
              onChange={(e) => update('posts_count', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              min={0}
            />
          </div>
        </Section>

        {/* Photos */}
        <Section title="Photos (all image slots)">
          <p className="text-xs text-gray-500 mb-4">
            Upload or set URLs for all photos on the site. Changes appear live after saving.
          </p>
          <div className="space-y-1">
            {(Object.keys(IMAGE_LABELS) as (keyof ImageSlots)[]).map((key) => (
              <ImageUploader
                key={key}
                label={IMAGE_LABELS[key]}
                value={content.images[key]}
                onChange={(url) => updateImage(key, url)}
              />
            ))}
          </div>
        </Section>

        {/* Marquee */}
        <Section title="Marquee / Ticker Items">
          <p className="text-xs text-gray-500 mb-3">
            Texts that scroll across the marquee strip. Each item is shown in all languages.
          </p>
          {content.marquee_items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <MultiLangField
                  label={`Item ${i + 1}`}
                  value={item}
                  onChange={(v) => {
                    const items = [...content.marquee_items];
                    items[i] = v;
                    update('marquee_items', items);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => update('marquee_items', content.marquee_items.filter((_, j) => j !== i))}
                className="mt-7 px-2 py-1 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('marquee_items', [...content.marquee_items, { en: '', es: '', de: '' }])}
            className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200"
          >
            + Add item
          </button>
        </Section>

        {/* Hero Slogans */}
        <Section title="Hero Slogans">
          {content.hero_slogans.map((slogan, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <MultiLangField
                  label={`Slogan ${i + 1}`}
                  value={slogan}
                  onChange={(v) => {
                    const slogans = [...content.hero_slogans];
                    slogans[i] = v;
                    update('hero_slogans', slogans);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => update('hero_slogans', content.hero_slogans.filter((_, j) => j !== i))}
                className="mt-7 px-2 py-1 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('hero_slogans', [...content.hero_slogans, { en: '', es: '', de: '' }])}
            className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200"
          >
            + Add slogan
          </button>
        </Section>

        {/* Letter */}
        <Section title="Letter from me">
          <MultiLangField label="Letter text" value={content.letter_text} onChange={(v) => update('letter_text', v)} textarea />
          <MultiLangField label="Signature" value={content.letter_sign} onChange={(v) => update('letter_sign', v)} />
        </Section>

        {/* Poll */}
        <Section title="Cosplay Poll">
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.poll.active}
              onChange={(e) => update('poll', { ...content.poll, active: e.target.checked })}
              className="w-4 h-4 accent-rose-600"
            />
            <label className="text-sm font-medium">Poll active</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Poll ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.poll.id}
                onChange={(e) => update('poll', { ...content.poll, id: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => update('poll', {
                  ...content.poll,
                  id: `poll-${Date.now()}`,
                  options: content.poll.options.map((o) => ({ ...o, real_votes: 0 })),
                })}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 whitespace-nowrap"
              >
                New poll (reset)
              </button>
            </div>
          </div>
          <MultiLangField label="Poll title" value={content.poll.title} onChange={(v) => update('poll', { ...content.poll, title: v })} />
          <MultiLangField label="Poll subtitle" value={content.poll.subtitle} onChange={(v) => update('poll', { ...content.poll, subtitle: v })} />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End date</label>
            <input
              type="datetime-local"
              value={content.poll.end_date.slice(0, 16)}
              onChange={(e) => update('poll', { ...content.poll, end_date: new Date(e.target.value).toISOString() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <h4 className="font-semibold text-sm mb-3">Options</h4>
          {content.poll.options.map((opt, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400">ID: {opt.id}</span>
                <button
                  type="button"
                  onClick={() => update('poll', { ...content.poll, options: content.poll.options.filter((_, j) => j !== i) })}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Character name</label>
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => {
                    const options = [...content.poll.options];
                    options[i] = { ...options[i], name: e.target.value };
                    update('poll', { ...content.poll, options });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-300 outline-none"
                  placeholder="e.g. Dark Elf"
                />
              </div>
              <MultiLangField
                label="Tag (subtitle)"
                value={opt.tag}
                onChange={(v) => {
                  const options = [...content.poll.options];
                  options[i] = { ...options[i], tag: v };
                  update('poll', { ...content.poll, options });
                }}
              />
              <ImageUploader
                label="Image"
                value={opt.image_url}
                onChange={(v) => {
                  const options = [...content.poll.options];
                  options[i] = { ...options[i], image_url: v };
                  update('poll', { ...content.poll, options });
                }}
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Real votes</label>
                  <input
                    type="number"
                    value={opt.real_votes}
                    onChange={(e) => {
                      const options = [...content.poll.options];
                      options[i] = { ...options[i], real_votes: parseInt(e.target.value) || 0 };
                      update('poll', { ...content.poll, options });
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Adjustment</label>
                  <input
                    type="number"
                    value={opt.adjustment}
                    onChange={(e) => {
                      const options = [...content.poll.options];
                      options[i] = { ...options[i], adjustment: parseInt(e.target.value) || 0 };
                      update('poll', { ...content.poll, options });
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Displayed</label>
                  <div className="px-2 py-1 bg-gray-100 rounded text-sm font-bold text-center">
                    {Math.max(0, opt.real_votes + opt.adjustment)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newOpt = {
                id: `opt-${Date.now()}`,
                name: '',
                tag: { en: '', es: '', de: '' },
                image_url: '',
                real_votes: 0,
                adjustment: 0,
              };
              update('poll', { ...content.poll, options: [...content.poll.options, newOpt] });
            }}
            className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200"
          >
            + Add option
          </button>
        </Section>

        {/* Giveaway */}
        <Section title="Giveaway Banner">
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.giveaway_active}
              onChange={(e) => update('giveaway_active', e.target.checked)}
              className="w-4 h-4 accent-rose-600"
            />
            <label className="text-sm font-medium">Giveaway active</label>
          </div>
          <MultiLangField label="Giveaway title" value={content.giveaway_title} onChange={(v) => update('giveaway_title', v)} />
          <MultiLangField label="CTA text" value={content.giveaway_cta_text} onChange={(v) => update('giveaway_cta_text', v)} />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">CTA URL</label>
            <input type="url" value={content.giveaway_cta_url} onChange={(e) => update('giveaway_cta_url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO">
          <MultiLangField label="SEO Description" value={content.seo_description} onChange={(v) => update('seo_description', v)} textarea />
        </Section>

        {/* Save button */}
        <div className="sticky bottom-4 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-lg"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          {message && (
            <span className={`text-sm font-medium ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
