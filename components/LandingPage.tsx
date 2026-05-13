'use client';

import TopBar from './TopBar';
import AgeGate from './AgeGate';
import Hero from './Hero';
import MarqueeStrip from './MarqueeStrip';
import StatsBar from './StatsBar';
import PollTeaser from './PollTeaser';
import FanvueCard from './FanvueCard';
import ChannelCards from './ChannelCards';
import CosplayPoll from './CosplayPoll';
import LetterFromMe from './LetterFromMe';
import WhatYouGet from './WhatYouGet';
import GiveawayBanner from './GiveawayBanner';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import RevealObserver from './AnimatedSection';
import type { SiteContent } from '@/lib/content-schema';

export default function LandingPage({ content }: { content: SiteContent }) {
  return (
    <>
      <RevealObserver />
      <AgeGate />
      <TopBar />
      <main>
        <Hero content={content} />
        <MarqueeStrip items={content.marquee_items} />
        <StatsBar content={content} />
        <PollTeaser content={content} />
        <FanvueCard content={content} />
        <ChannelCards content={content} />
        <CosplayPoll content={content} />
        <LetterFromMe content={content} />
        <WhatYouGet content={content} />
        <GiveawayBanner content={content} />
      </main>
      <Footer />
      <StickyMobileCTA content={content} />
    </>
  );
}
