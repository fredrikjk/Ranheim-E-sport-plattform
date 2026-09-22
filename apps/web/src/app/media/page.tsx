import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Media',
};

export default function MediaPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Media">
        <p>Bilder og video lagres i objektlagring, ikke i databasen.</p>
      </PageHero>
      <EmptyState title="Ingen media er publisert">
        <p>
          Bilder av mindreårige krever samtykke. Innhold uten samtykke blir
          ikke liggende i et åpent galleri.
        </p>
      </EmptyState>
    </article>
  );
}
