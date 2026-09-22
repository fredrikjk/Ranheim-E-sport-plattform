import Link from 'next/link';
import { club, publicNav, secondaryNav } from '@/content/club';
import styles from './site-footer.module.scss';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">{club.parent}</p>
          <p className={styles.name}>{club.name}</p>
          <p>
            {club.address.venue}, {club.address.street}
            <br />
            {club.address.postalCode} {club.address.city}
          </p>
          <p>
            Org.nr. {club.orgNumber}
            <br />
            <a href={`mailto:${club.email}`}>{club.email}</a>
          </p>
        </div>
        <nav aria-label="Bunnmeny">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Flere sider">
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/innlogging">Medlemsinnlogging</Link>
        </nav>
      </div>
    </footer>
  );
}
