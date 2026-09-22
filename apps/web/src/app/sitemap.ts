import type { MetadataRoute } from 'next';
import { publicNav, secondaryNav } from '@/content/club';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const routes = [...publicNav, ...secondaryNav].map((item) => item.href);
  const unique = [...new Set(routes)];

  return unique.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
