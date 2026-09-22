import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Lag',
  description: 'Lagene i Ranheim E-sport publiseres når de er klare for offentlig visning.',
};

export default function TeamsPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Lag">
        <p>
          Lag vises her når de er publisert fra klubbhuben. Upubliserte
          barne- og ungdomslag vises ikke automatisk.
        </p>
      </PageHero>
      <EmptyState title="Ingen publiserte lag ennå">
        <p>
          Troppene kommer på plass via trenere og styre, med eget
          publiseringsvalg. Det er bevisst — ikke en manglende side.
        </p>
      </EmptyState>
    </article>
  );
}
