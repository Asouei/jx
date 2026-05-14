import { z } from 'zod/v4';

const MultiLangText = z.object({
  en: z.string(),
  es: z.string(),
  de: z.string(),
});

export type MultiLangText = z.infer<typeof MultiLangText>;

const PollOption = z.object({
  id: z.string(),
  name: z.string(),
  tag: MultiLangText,
  image_url: z.string(),
  real_votes: z.number().int().min(0),
  adjustment: z.number().int(),
});

export type PollOption = z.infer<typeof PollOption>;

const Poll = z.object({
  active: z.boolean(),
  id: z.string(),
  title: MultiLangText,
  subtitle: MultiLangText,
  end_date: z.string(),
  options: z.array(PollOption).min(2).max(6),
});

export type Poll = z.infer<typeof Poll>;

const ImageSlots = z.object({
  hero1: z.string(),
  hero2: z.string(),
  hero3: z.string(),
  letter: z.string(),
  tg: z.string(),
  ig: z.string(),
  fv1: z.string(),
  fv2: z.string(),
  fv3: z.string(),
  fv4: z.string(),
  fv5: z.string(),
  fv6: z.string(),
  soft: z.string(),
  wild: z.string(),
});

export type ImageSlots = z.infer<typeof ImageSlots>;

export const ContentSchema = z.object({
  fanvue_url: z.string().url(),
  telegram_url: z.string().url(),
  instagram_url: z.string().url(),
  next_drop_hours: z.number().min(0),
  force_locked: z.boolean(),
  posts_count: z.number().int().min(0),
  handle: z.string(),
  images: ImageSlots,
  marquee_items: z.array(MultiLangText).min(1).max(10),
  hero_slogans: z.array(MultiLangText),
  letter_text: MultiLangText,
  letter_sign: MultiLangText,
  poll: Poll,
  giveaway_active: z.boolean(),
  giveaway_title: MultiLangText,
  giveaway_cta_text: MultiLangText,
  giveaway_cta_url: z.string(),
  seo_description: MultiLangText,
});

export type SiteContent = z.infer<typeof ContentSchema>;

export const DEFAULT_IMAGES: ImageSlots = {
  hero1: '/img/hero-1.jpg',
  hero2: '/img/hero-2.jpg',
  hero3: '/img/hero-3.jpg',
  letter: '/img/letter.jpg',
  tg: '/img/tg-preview.jpg',
  ig: '/img/ig-preview.jpg',
  fv1: '/img/g1.jpg',
  fv2: '/img/g2.jpg',
  fv3: '/img/g3.jpg',
  fv4: '/img/g4.jpg',
  fv5: '/img/g5.jpg',
  fv6: '/img/g6.jpg',
  soft: '/img/soft-1.jpg',
  wild: '/img/wild-1.jpg',
};

export const DEFAULT_CONTENT: SiteContent = {
  fanvue_url: 'https://www.fanvue.com/julisergova',
  telegram_url: 'https://t.me/juliasergova',
  instagram_url: 'https://instagram.com/julisergova',
  next_drop_hours: 62,
  force_locked: false,
  posts_count: 247,
  handle: '@julisergova',
  images: DEFAULT_IMAGES,
  marquee_items: [
    { en: 'new drop tonight', es: 'drop nuevo esta noche', de: 'neuer drop heute nacht' },
    { en: 'juli ♥', es: 'juli ♥', de: 'juli ♥' },
    { en: 'fanvue opens soon', es: 'fanvue abre pronto', de: 'fanvue öffnet bald' },
    { en: 'be the first one in', es: 'sé el primero', de: 'sei der erste' },
    { en: 'kisses 💋', es: 'besos 💋', de: 'küsse 💋' },
  ],
  hero_slogans: [
    { en: 'your favorite bad decision', es: 'tu peor decisión favorita', de: 'deine liebste schlechte entscheidung' },
    { en: "the one you'll regret tomorrow", es: 'a la que dirás sí mañana', de: 'die, die du morgen bereust' },
    { en: 'too cute to be real', es: 'demasiado linda para ser real', de: 'zu süß um wahr zu sein' },
  ],
  letter_text: {
    en: "hey baby. so glad you found me. i made this little corner of the internet just for the ones who actually pay attention. you'll see why i'm worth it.",
    es: "hola baby. me alegra que me encontraras. hice este rinconcito de internet solo para los que de verdad prestan atención. vas a ver por qué valgo la pena.",
    de: "hey baby. schön dass du mich gefunden hast. ich hab diesen kleinen ort gemacht — nur für die, die wirklich hinschauen. du wirst sehen warum ich es wert bin.",
  },
  letter_sign: {
    en: '— yours, juli',
    es: '— tuya, juli',
    de: '— deine juli',
  },
  poll: {
    active: true,
    id: 'cosplay-2026-05',
    title: {
      en: 'vote for my next cosplay',
      es: 'vota mi próximo cosplay',
      de: 'wähl mein nächstes cosplay',
    },
    subtitle: {
      en: "the one with the most votes goes on Fanvue this week. you pick — I wear it.",
      es: "el más votado lo subo a Fanvue esta semana. tú eliges — yo lo llevo.",
      de: "das mit den meisten stimmen kommt diese woche auf Fanvue. du wählst — ich trag's.",
    },
    end_date: '2026-06-15T00:00:00Z',
    options: [
      {
        id: 'knight',
        name: 'Holy Knight',
        tag: { en: 'soft & sleepy', es: 'dulce y soñolienta', de: 'sanft & verschlafen' },
        image_url: '/img/cos-knight.jpg',
        real_votes: 187,
        adjustment: 0,
      },
      {
        id: 'elf',
        name: 'Dark Elf',
        tag: { en: 'armor + ears', es: 'armadura + orejas', de: 'rüstung + ohren' },
        image_url: '/img/cos-elf.jpg',
        real_votes: 234,
        adjustment: 0,
      },
      {
        id: 'demon',
        name: 'Demon Girl',
        tag: { en: 'face paint', es: 'face paint', de: 'face paint' },
        image_url: '/img/cos-demon.jpg',
        real_votes: 156,
        adjustment: 0,
      },
      {
        id: 'fg',
        name: 'Final Girl',
        tag: { en: 'horror chic', es: 'horror chic', de: 'horror chic' },
        image_url: '/img/cos-final-girl.jpg',
        real_votes: 121,
        adjustment: 0,
      },
    ],
  },
  giveaway_active: false,
  giveaway_title: { en: 'free month on Fanvue — ends in 3 days', es: 'mes gratis en Fanvue — quedan 3 días', de: 'gratis monat auf Fanvue — endet in 3 tagen' },
  giveaway_cta_text: { en: 'enter →', es: 'participar →', de: 'mitmachen →' },
  giveaway_cta_url: 'https://www.fanvue.com/julisergova',
  seo_description: {
    en: 'Juli — your favorite bad decision. exclusive posts, personal DMs, custom requests.',
    es: 'Juli — tu peor decisión favorita. posts exclusivos, DMs personales.',
    de: 'Juli — deine liebste schlechte entscheidung. exklusive posts, persönliche DMs.',
  },
};
