import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getContent, setContent } from '@/lib/kv';
import { ContentSchema } from '@/lib/content-schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content, {
    headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' },
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
