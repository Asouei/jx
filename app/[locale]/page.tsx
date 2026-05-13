import { getContent } from '@/lib/kv';
import LandingPage from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getContent();
  return <LandingPage content={content} />;
}
