import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Juli 🖤 — your favorite bad decision',
  description: 'Juli — your favorite bad decision. 5+ exclusive posts per week, personal DMs, custom requests.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
