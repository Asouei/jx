import { NextRequest, NextResponse } from 'next/server';
import { getContent, setContent, getPollVoteIp, setPollVoteIp } from '@/lib/kv';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.NEXTAUTH_SECRET || 'salt')).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const { option_id } = await request.json();
    if (!option_id) {
      return NextResponse.json({ error: 'Missing option_id' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const ipHash = hashIp(ip);

    const content = await getContent();
    const { poll } = content;

    if (!poll.active) {
      return NextResponse.json({ error: 'Poll is not active' }, { status: 400 });
    }

    if (new Date(poll.end_date) < new Date()) {
      return NextResponse.json({ error: 'Poll has ended' }, { status: 400 });
    }

    const alreadyVoted = await getPollVoteIp(poll.id, ipHash);
    if (alreadyVoted) {
      return NextResponse.json({ error: 'Already voted' }, { status: 429 });
    }

    const optionIndex = poll.options.findIndex((o) => o.id === option_id);
    if (optionIndex === -1) {
      return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
    }

    content.poll.options[optionIndex].real_votes += 1;
    await setContent(content);
    await setPollVoteIp(poll.id, ipHash);

    const options = content.poll.options.map((o) => ({
      id: o.id,
      name: o.name,
      image_url: o.image_url,
      displayed_votes: Math.max(0, o.real_votes + o.adjustment),
    }));
    const totalDisplayed = options.reduce((s, o) => s + o.displayed_votes, 0);

    return NextResponse.json({ success: true, options, totalDisplayed });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
