import { SiteContent, DEFAULT_CONTENT } from './content-schema';

const CONTENT_KEY = 'site_content';

async function redisCommand(...args: string[]): Promise<any> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error('[redis] KV_REST_API_URL or KV_REST_API_TOKEN not set');
    return null;
  }
  const res = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[redis] HTTP error:', res.status, text.substring(0, 200));
    return null;
  }
  const json = await res.json();
  return json.result;
}

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await redisCommand('GET', CONTENT_KEY);
    console.log('[kv.get] raw type:', typeof raw, 'length:', raw?.length || 0);
    if (raw) {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return data as SiteContent;
    }
  } catch (e) {
    console.error('[kv.get] FAILED:', e);
  }
  console.log('[kv.get] returning DEFAULT');
  return DEFAULT_CONTENT;
}

export async function setContent(content: SiteContent): Promise<void> {
  try {
    const result = await redisCommand('SET', CONTENT_KEY, JSON.stringify(content));
    console.log('[kv.set] result:', result);
  } catch (e) {
    console.error('[kv.set] FAILED:', e);
    throw e;
  }
}

export async function getPollVoteIp(pollId: string, ipHash: string): Promise<boolean> {
  try {
    const val = await redisCommand('GET', `poll_vote_ip:${pollId}:${ipHash}`);
    return !!val;
  } catch {
    return false;
  }
}

export async function setPollVoteIp(pollId: string, ipHash: string): Promise<void> {
  try {
    await redisCommand('SET', `poll_vote_ip:${pollId}:${ipHash}`, '1', 'EX', '86400');
  } catch (e) {
    console.error('Failed to set poll vote IP:', e);
  }
}
