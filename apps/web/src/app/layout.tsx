import type { Metadata } from 'next';
import { Barlow_Condensed, IBM_Plex_Mono, Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { club } from '@/content/club';
import '@ranheim/ui/styles/reset.css';
import '@ranheim/ui/styles/tokens.css';
import './globals.scss';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display-src',
  display: 'swap',
});

const body = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body-src',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: club.name,
    template: `%s · ${club.name}`,
  },
  description: club.summary,
  applicationName: club.name,
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: club.name,
    title: club.name,
    description: club.summary,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nb">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a className="skip-link" href="#innhold">
          Hopp til innhold
        </a>
        <div className="site-shell">
          <SiteHeader />
          <main id="innhold" className="site-main">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
