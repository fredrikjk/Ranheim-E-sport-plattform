import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { club } from '@/content/club';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `Kontakt ${club.name} i ${club.address.venue}.`,
};

export default function ContactPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Klubben" title="Kontakt">
        <p>
          {club.address.venue}, {club.address.street}, {club.address.postalCode}{' '}
          {club.address.city}
        </p>
      </PageHero>
      <section className="section">
        <dl className="meta-row">
          <div>
            <dt>E-post</dt>
            <dd>
              <a href={`mailto:${club.email}`}>{club.email}</a>
            </dd>
          </div>
          <div>
            <dt>Organisasjon</dt>
            <dd>{club.parent}</dd>
          </div>
          <div>
            <dt>Org.nr.</dt>
            <dd>{club.orgNumber}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
