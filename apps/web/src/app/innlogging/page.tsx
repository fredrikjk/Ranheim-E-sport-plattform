import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Logg inn',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <article className="container">
      <PageHero eyebrow="Medlem" title="Logg inn">
        <p>
          Én konto for nettside, hub, trening og senere Stream Manager.
          Tilgang styres av roller og permissions.
        </p>
      </PageHero>
      <section className="section">
        <LoginForm />
      </section>
    </article>
  );
}
