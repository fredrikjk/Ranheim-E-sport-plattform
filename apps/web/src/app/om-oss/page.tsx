import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { club } from '@/content/club';

export const metadata: Metadata = {
  title: 'Om oss',
  description: club.summary,
};

export default function AboutPage() {
  return (
    <article className="container">
      <PageHero eyebrow={club.parent} title="Om Ranheim E-sport">
        <p>{club.summary}</p>
      </PageHero>
      <section className="section">
        <h2 className="eyebrow">Oppdrag</h2>
        <p className="lead">
          Vi skal holde barn og unge i idretten så lenge som mulig. Gaming er
          aktiviteten. Trygghet, trenere og klubbfellesskap er rammen.
        </p>
        <hr className="rule" />
        <p>
          Klubben ble etablert {club.founded.toLowerCase()} og er en særidrett i
          Ranheim Idrettslag. Medlemmene kommer fra Ranheim og flere andre
          bydeler i Trondheim. Offisiell klubbidentitet følger allianseidrettslaget:
          blå og hvit, ikke et generisk esport-uttrykk.
        </p>
      </section>
    </article>
  );
}
