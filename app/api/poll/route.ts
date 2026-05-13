import { NextResponse } from 'next/server';
import { getContent } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await getContent();
  const { poll } = content;
  const options = poll.options.map((o) => ({
    id: o.id,
    name: o.name,
    image_url: o.image_url,
    displayed_votes: Math.max(0, o.real_votes + o.adjustment),
  }));
  const totalDisplayed = options.reduce((s, o) => s + o.displayed_votes, 0);
  return NextResponse.json({
    active: poll.active,
    id: poll.id,
    title: poll.title,
    subtitle: poll.subtitle,
    end_date: poll.end_date,
    options,
    totalDisplayed,
  });
}
