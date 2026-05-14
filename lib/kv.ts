import { SiteContent, DEFAULT_CONTENT } from './content-schema';
import { kv } from '@vercel/kv';

const CONTENT_KEY = 'site_content';

export async function getContent(): Promise<SiteContent> {
  try {
    const data = await kv.get<SiteContent>(CONTENT_KEY);
    console.log('[kv.get] data exists:', !!data, 'hero1:', (data as any)?.images?.hero1?.substring(0, 60) || 'NONE');
    if (data) return data;
  } catch (e) {
    console.error('[kv.get] FAILED:', e);
  }
  console.log('[kv.get] returning DEFAULT');
  return DEFAULT_CONTENT;
}

export async function setContent(content: SiteContent): Promise<void> {
  try {
    await kv.set(CONTENT_KEY, content);
    console.log('[kv.set] saved OK');
  } catch (e) {
    console.error('[kv.set] FAILED:', e);
    throw e;
  }
}

export async function getPollVoteIp(pollId: string, ipHash: string): Promise<boolean> {
  try {
    const val = await kv.get(`poll_vote_ip:${pollId}:${ipHash}`);
    return !!val;
  } catch {
    return false;
  }
}

export async function setPollVoteIp(pollId: string, ipHash: string): Promise<void> {
  try {
    await kv.set(`poll_vote_ip:${pollId}:${ipHash}`, '1', { ex: 86400 });
  } catch (e) {
    console.error('Failed to set poll vote IP:', e);
  }
}
