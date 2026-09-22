import type { Metadata } from 'next';
import { Button } from '@/components/button';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Klubbhub',
  robots: { index: false, follow: false },
};

export default function HubPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Intern" title="Klubbhub">
        <p>
          Huben åpnes når innlogging og RBAC er koblet på. Innholdet her blir
          aldri indeksert.
        </p>
      </PageHero>
      <section className="section">
        <Button href="/innlogging">Gå til innlogging</Button>
      </section>
    </article>
  );
}
