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
  console.log('[content GET] telegram_url:', content.telegram_url,
    'hero1:', content.images?.hero1?.substring(0, 50) || 'EMPTY',
    'isDefault:', content.images?.hero1 === '/img/hero-1.jpg');
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
    console.log('[content PUT] images received:', JSON.stringify(body.images));
    const parsed = ContentSchema.parse(body);
    console.log('[content PUT] parsed OK, saving...');
    await setContent(parsed);
    console.log('[content PUT] saved OK');
    // Verify it was saved
    const verify = await getContent();
    console.log('[content PUT] verify images:', JSON.stringify(verify.images));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[content PUT] ERROR:', e);
    return NextResponse.json({ error: 'Invalid content', details: String(e) }, { status: 400 });
  }
}
