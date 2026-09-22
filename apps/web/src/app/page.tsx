import { Button } from '@/components/button';
import { LiveStatus } from '@/components/live-status';
import { club } from '@/content/club';
import { getPublicStreamStatus } from '@/content/stream';
import styles from './page.module.scss';

export default async function HomePage() {
  const stream = await getPublicStreamStatus();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: club.name,
    parentOrganization: club.parent,
    description: club.summary,
    email: club.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.address.street,
      postalCode: club.address.postalCode,
      addressLocality: club.address.city,
      addressCountry: 'NO',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className={`container section ${styles.hero}`}>
        <div className="split">
          <div>
            <p className="eyebrow">
              {club.parent} · {club.city}
            </p>
            <h1 className="page-title">{club.slogan}</h1>
            <p className="lead">{club.summary}</p>
            <div className={styles.actions}>
              <Button href="/om-oss">Om klubben</Button>
              <Button href="/lag" variant="ghost">
                Se lagene
              </Button>
            </div>
          </div>
          <LiveStatus stream={stream} />
        </div>
      </section>

      <section className="container">
        <dl className="meta-row">
          <div>
            <dt>Etablert</dt>
            <dd>{club.founded}</dd>
          </div>
          <div>
            <dt>Medlemmer</dt>
            <dd>Ca. {club.membersApprox}</dd>
          </div>
          <div>
            <dt>Gren</dt>
            <dd>{club.games.join(', ')}</dd>
          </div>
          <div>
            <dt>Hjemmebane</dt>
            <dd>{club.address.venue}</dd>
          </div>
        </dl>
      </section>

      <section className="container section">
        <p className="eyebrow">Klubben</p>
        <div className={styles.columns}>
          <div>
            <h2>En særidrett i Ranheim Idrettslag</h2>
            <p>
              Ranheim E-sport er ikke en løsrevet gamingklubb. Vi er en del av
              allianseidrettslaget, med samme krav til trygge rammer, trenere og
              inkludering som de andre grenene.
            </p>
          </div>
          <div>
            <h2>Én identitet, flere flater</h2>
            <p>
              Spillere, trenere og styre logger inn én gang. Tilgang styres med
              roller og permissions, ikke med egne kontoer per app.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
