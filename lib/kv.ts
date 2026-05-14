import { SiteContent, DEFAULT_CONTENT } from './content-schema';

const CONTENT_KEY = 'site_content';

const memoryStore: Record<string, string> = {};

function isKvAvailable(): boolean {
  return !!(getKvUrl() && getKvToken());
}

function getKvUrl(): string | undefined {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
}

function getKvToken(): string | undefined {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
}

async function getKvClient() {
  if (!isKvAvailable()) return null;
  const { createClient } = await import('@vercel/kv');
  return createClient({
    url: getKvUrl()!,
    token: getKvToken()!,
  });
}

export async function getContent(): Promise<SiteContent> {
  try {
    const kv = await getKvClient();
    if (kv) {
      const data = await kv.get<SiteContent>(CONTENT_KEY);
      if (data) return data;
    } else {
      const raw = memoryStore[CONTENT_KEY];
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get content from KV:', e);
  }
  return DEFAULT_CONTENT;
}

export async function setContent(content: SiteContent): Promise<void> {
  try {
    const kv = await getKvClient();
    if (kv) {
      await kv.set(CONTENT_KEY, content);
    } else {
      memoryStore[CONTENT_KEY] = JSON.stringify(content);
    }
  } catch (e) {
    console.error('Failed to set content in KV:', e);
    memoryStore[CONTENT_KEY] = JSON.stringify(content);
  }
}

export async function getPollVoteIp(pollId: string, ipHash: string): Promise<boolean> {
  try {
    const kv = await getKvClient();
    if (kv) {
      const val = await kv.get(`poll_vote_ip:${pollId}:${ipHash}`);
      return !!val;
    } else {
      return !!memoryStore[`poll_vote_ip:${pollId}:${ipHash}`];
    }
  } catch {
    return false;
  }
}

export async function setPollVoteIp(pollId: string, ipHash: string): Promise<void> {
  try {
    const kv = await getKvClient();
    if (kv) {
      await kv.set(`poll_vote_ip:${pollId}:${ipHash}`, '1', { ex: 86400 });
    } else {
      memoryStore[`poll_vote_ip:${pollId}:${ipHash}`] = '1';
    }
  } catch (e) {
    console.error('Failed to set poll vote IP:', e);
  }
}
