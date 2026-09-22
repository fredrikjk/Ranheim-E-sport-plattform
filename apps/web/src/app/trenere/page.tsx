import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Trenere',
  description: 'Trenere i Ranheim E-sport.',
};

export default function CoachesPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Trenere">
        <p>Trenere får egne publiserte profiler, atskilt fra spillernes.</p>
      </PageHero>
      <EmptyState title="Ingen publiserte trenere ennå">
        <p>Trenerprofiler kobles til samme brukerkonto som hub og trening.</p>
      </EmptyState>
    </article>
  );
}
