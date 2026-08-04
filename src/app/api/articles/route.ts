import { db } from '@/db';
import { articles, categories } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { fetchLiveNews } from '@/lib/liveNews';

export const revalidate = 60;

export async function GET() {
  try {
    let dbArticles: any[] = [];
    try {
      const rows = await db.query.articles.findMany({
        with: { category: true },
        orderBy: [desc(articles.publishedAt)],
        limit: 20,
      });
      dbArticles = rows.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        summary: r.summary || '',
        content: r.content,
        category: r.category?.name || 'General',
        source: 'DayToNight AI',
        sourceUrl: `/articles/${r.slug}`,
        publishedAt: r.publishedAt || new Date(),
        imageUrl: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800`,
        confidenceScore: r.confidenceScore || 95,
        readingTime: r.readingTime || 4,
        isBreaking: true,
        isTrending: true,
      }));
    } catch (e) {
      console.error('db fetch failed', e);
    }

    let live: any[] = [];
    try {
      live = await fetchLiveNews();
    } catch (e) {
      console.error('live fetch failed', e);
    }

    const combined = [...dbArticles, ...live];
    const seen = new Set<string>();
    const deduped = combined.filter(a => {
      if (seen.has(a.slug)) return false;
      seen.add(a.slug);
      return true;
    });

    if (deduped.length === 0) {
      // ultimate fallback
      return NextResponse.json([
        {
          title: 'AI Newsroom Initializing - Scanning Global Sources',
          slug: 'ai-newsroom-initializing',
          summary: 'Our 7 AI agents are currently scanning 40+ trusted sources worldwide.',
          category: 'Technology',
          publishedAt: new Date(),
          confidenceScore: 100,
          imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800',
        }
      ]);
    }

    return NextResponse.json(deduped);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
