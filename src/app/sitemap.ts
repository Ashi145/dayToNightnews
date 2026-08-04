import { MetadataRoute } from 'next';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://daytonightnews.com';
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    { url: `${base}/admin`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.3 },
  ];

  try {
    const rows = await db.query.articles.findMany({ orderBy: [desc(articles.publishedAt)], limit: 100 });
    for (const a of rows) {
      urls.push({
        url: `${base}/articles/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'hourly',
        priority: 0.8,
      });
    }
  } catch {}

  const categories = ['world','business','technology','ai','science','politics','finance','crypto'];
  for (const c of categories) {
    urls.push({ url: `${base}/category/${c}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.6 });
  }

  return urls;
}
