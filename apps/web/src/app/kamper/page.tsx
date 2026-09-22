import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Kamper',
  description: 'Kampoppsett for Ranheim E-sport.',
};

export default function MatchesPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Sesong" title="Kamper">
        <p>Kommende kamper vises når de er registrert i plattformen.</p>
      </PageHero>
      <EmptyState title="Ingen kamper er satt opp">
        <p>
          Kampdata modelleres spill-agnostisk, slik at CS2 og senere grener
          kan bruke samme struktur.
        </p>
      </EmptyState>
    </article>
  );
}
