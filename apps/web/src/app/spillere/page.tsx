import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Spillere',
  description: 'Offentlige spillerprofiler i Ranheim E-sport.',
};

export default function PlayersPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Spillere">
        <p>
          Offentlige profiler viser bare samtykket og publisert informasjon.
          Telefon, fødselsdato og upubliserte profiler hører hjemme i huben.
        </p>
      </PageHero>
      <EmptyState title="Ingen offentlige spillerprofiler">
        <p>
          Når spillere og foresatte har gitt samtykke, og en trener eller
          styret publiserer profilen, vises den her.
        </p>
      </EmptyState>
    </article>
  );
}
