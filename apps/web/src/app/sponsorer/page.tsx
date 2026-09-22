import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Sponsorer',
  description: 'Samarbeidspartnere for Ranheim E-sport.',
};

export default function SponsorsPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Samarbeid" title="Sponsorer">
        <p>
          Sponsorprofiler og assets skal kunne brukes på nettside, stream og
          overlays fra samme kilde.
        </p>
      </PageHero>
      <EmptyState title="Ingen aktive sponsorer er publisert">
        <p>Når avtaler er på plass, vises navn, nivå og periode her.</p>
      </EmptyState>
    </article>
  );
}
