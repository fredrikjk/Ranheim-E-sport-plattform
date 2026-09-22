import type { Metadata } from 'next';
import { LiveStatus } from '@/components/live-status';
import { PageHero } from '@/components/page-hero';
import { getPublicStreamStatus } from '@/content/stream';

export const metadata: Metadata = {
  title: 'Streaming',
  description: 'Live-status for Ranheim E-sport.',
};

export default async function StreamingPage() {
  const stream = await getPublicStreamStatus();

  return (
    <article className="container">
      <PageHero eyebrow="Kanal" title="Streaming">
        <p>
          Live-status hentes server-side. Twitch-nøkler ligger aldri i
          nettleseren.
        </p>
      </PageHero>
      <section className="section">
        <LiveStatus stream={stream} />
      </section>
    </article>
  );
}
