import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getContent, setContent } from '@/lib/kv';
import { ContentSchema } from '@/lib/content-schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const kvAvailable = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
  console.log('[content GET] KV available:', kvAvailable,
    'KV_REST_API_URL:', !!process.env.KV_REST_API_URL,
    'UPSTASH_REDIS_REST_URL:', !!process.env.UPSTASH_REDIS_REST_URL);
  const content = await getContent();
  console.log('[content GET] telegram_url:', content.telegram_url);
  return NextResponse.json(content, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = ContentSchema.parse(body);
    await setContent(parsed);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid content', details: String(e) }, { status: 400 });
  }
}
