import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Resultater',
  robots: { index: true, follow: true },
};

export default function ResultsPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Sesong" title="Resultater">
        <p>Resultater og kampstatistikk publiseres her når kampene er ferdigregistrert.</p>
      </PageHero>
      <EmptyState title="Ingen resultater å vise">
        <p>Statistikkfelter hardkodes ikke mot ett spill.</p>
      </EmptyState>
    </article>
  );
}
