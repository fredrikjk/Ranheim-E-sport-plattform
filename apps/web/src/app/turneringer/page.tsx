import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Turneringer',
};

export default function TournamentsPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Sesong" title="Turneringer">
        <p>Klubbens turneringer og eksterne påmeldinger samles her.</p>
      </PageHero>
      <EmptyState title="Ingen turneringer er publisert">
        <p>Turneringsmodulen kommer etter MVP-kjernen for lag og kamper.</p>
      </EmptyState>
    </article>
  );
}
