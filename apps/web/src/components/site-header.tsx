'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { publicNav } from '@/content/club';
import { BrandLogo } from './brand-logo';
import styles from './site-header.module.scss';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <BrandLogo className={styles.logo} priority />
        </Link>

        <nav className={styles.desktop} aria-label="Hovedmeny">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? styles.active : undefined}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/innlogging" className={styles.login}>
            Logg inn
          </Link>
          <button
            className={styles.menuButton}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Lukk' : 'Meny'}
          </button>
        </div>
      </div>

      {open ? (
        <nav id={menuId} className={styles.mobile} aria-label="Mobilmeny">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
