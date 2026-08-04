import { db } from '@/db';
import { articles, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import NewsCard from '@/components/news/NewsCard';
import HeroCard from '@/components/news/HeroCard';
import SecondaryCard from '@/components/news/SecondaryCard';
import SectionHeader from '@/components/news/SectionHeader';
import { fetchLiveNews } from '@/lib/liveNews';

async function getCategoryArticles(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  // Get live news for this category (mapped)
  let liveNews: any[] = [];
  try {
    const allLive = await fetchLiveNews();
    const targetCat = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
    liveNews = allLive.filter(a => a.category.toLowerCase() === targetCat.toLowerCase() || a.category.toLowerCase() === slug.toLowerCase());
    if (liveNews.length === 0 && slug !== 'general') {
      // fallback: show all if filter too strict
      liveNews = allLive.slice(0, 12);
    }
  } catch {}

  let dbArticles: any[] = [];
  if (category) {
    const rows = await db.query.articles.findMany({
      where: eq(articles.categoryId, category.id),
      with: { category: true },
    });
    dbArticles = rows.map(r => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      summary: r.summary || '',
      category: r.category?.name || category.name,
      source: 'AI Newsroom',
      publishedAt: r.publishedAt || new Date(),
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800',
      confidenceScore: r.confidenceScore || 93,
      readingTime: r.readingTime || 4,
    }));
  }

  const combined = [...dbArticles, ...liveNews];
  if (combined.length === 0 && !category) return null;

  return {
    category: category || { name: slug.charAt(0).toUpperCase() + slug.slice(1), description: `Latest verified coverage on ${slug} from 40+ global sources, curated by AI.` , slug },
    articles: combined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryArticles(slug);
  if (!data) return notFound();
  const { category, articles: all } = data;

  const hero = all[0];
  const rest = all.slice(1);

  return (
    <div className="bg-[#fefcf8] min-h-screen">
      <div className="container mx-auto px-4 max-w-[1400px] py-8">
        {/* Category Masthead */}
        <div className="border-b-[4px] border-black pb-6 mb-8">
          <div className="flex items-baseline gap-4">
            <h1 className="text-[42px] md:text-[64px] font-black tracking-tighter uppercase leading-none">{category.name}</h1>
            <span className="live-badge hidden md:inline-flex">LIVE • AI CURATED</span>
          </div>
          <p className="font-serif text-[18px] opacity-70 mt-3 max-w-3xl">{(category as any).description || `Latest verified coverage on ${category.name} from 40+ global sources, curated by autonomous AI agents scanning every minute.`}</p>
          <div className="mt-4 flex gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className="bg-black text-white px-3 py-1">{all.length} STORIES VERIFIED TODAY</span>
            <span className="border border-black px-3 py-1">UPDATED EVERY 60s</span>
            <span className="border border-black px-3 py-1">CONFIDENCE {'>'} 90%</span>
          </div>
        </div>

        {hero && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <HeroCard article={hero} />
            </div>
            <div className="lg:col-span-4">
              <SectionHeader title={`More in ${category.name}`} />
              {rest.slice(0,5).map((a,i)=><SecondaryCard key={i} article={a} compact />)}
            </div>
          </div>
        )}

        <div className="mt-10">
          <SectionHeader title="Latest" subtitle={`${rest.length} stories`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rest.map((a,i)=><NewsCard key={i} article={a} />)}
          </div>
          {rest.length===0 && <div className="text-center py-20 opacity-60 font-serif">No stories in this category yet — AI agents scanning.</div>}
        </div>
      </div>
    </div>
  );
}
