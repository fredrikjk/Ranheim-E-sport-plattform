import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Nyheter',
  description: 'Nyheter fra Ranheim E-sport.',
};

export default function NewsPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Nyheter">
        <p>Kunngjøringer fra styre og trenere, ikke et åpent kommentarfelt.</p>
      </PageHero>
      <EmptyState title="Ingen saker ennå">
        <p>
          Vi publiserer ikke oppdiktede nyheter. Når klubben har noe å si,
          ligger det her.
        </p>
      </EmptyState>
    </article>
  );
}
