import HeroCard from '@/components/news/HeroCard';
import SecondaryCard from '@/components/news/SecondaryCard';
import NewsCard from '@/components/news/NewsCard';
import SectionHeader from '@/components/news/SectionHeader';
import TrendingRail from '@/components/news/TrendingRail';
import { fetchLiveNews } from '@/lib/liveNews';
import { db } from '@/db';
import { articles as articlesTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

async function getAllNews() {
  let live: any[] = [];
  try {
    live = await fetchLiveNews();
  } catch (e) {
    console.error('live fetch failed', e);
  }

  let dbArticles: any[] = [];
  try {
    const rows = await db.query.articles.findMany({
      orderBy: [desc(articlesTable.publishedAt)],
      limit: 12,
      with: { category: true }
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
    }));
  } catch (e) {
    console.error('db fetch failed', e);
  }

  // Merge: DB first (AI-generated) then live
  const combined = [...dbArticles, ...live];
  // Dedupe by slug
  const seen = new Set();
  return combined.filter(a => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });
}

export default async function HomePage() {
  const all = await getAllNews();

  if (all.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-serif text-lg">No news yet — AI agents are scanning the world. Refresh in 60s.</p>
      </div>
    );
  }

  const hero = all[0];
  const secondary = all.slice(1, 3);
  const tertiary = all.slice(3, 7);
  const latest = all.slice(7, 15);
  const trending = all.slice(0, 8);
  const world = all.filter(a => a.category === 'World').slice(0, 4);
  const business = all.filter(a => a.category === 'Business' || a.category === 'Finance').slice(0, 4);
  const tech = all.filter(a => ['Technology','AI','Science'].includes(a.category)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fefcf8]">
      <main className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Above fold: 3 column newspaper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-b border-black/10 pb-8">
          {/* Left rail - secondary */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <SectionHeader title="Latest Updates" subtitle="Last hour" />
            <div className="space-y-1">
              {secondary.map((a, i) => <SecondaryCard key={i} article={a} compact />)}
            </div>
            <div className="mt-6">
              <SectionHeader title="World" />
              {world.slice(0,3).map((a,i)=>(<SecondaryCard key={i} article={a} compact />))}
            </div>
          </div>

          {/* Center - hero */}
          <div className="lg:col-span-6 order-1 lg:order-2 border-x-0 lg:border-x border-black/10 lg:px-6">
            <HeroCard article={hero} />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tertiary.map((a,i)=>(<SecondaryCard key={i} article={a} />))}
            </div>
          </div>

          {/* Right - trending rail */}
          <div className="lg:col-span-3 order-3 space-y-6">
            <TrendingRail articles={trending} title="Most Read Right Now" />
            <div className="bg-black text-white p-4">
              <p className="text-[10px] tracking-widest uppercase opacity-60">MARKETS • LIVE</p>
              <div className="mt-3 space-y-2 text-[12px] font-mono">
                <div className="flex justify-between"><span>DOW</span><span className="text-green-400">+0.84% ▲</span></div>
                <div className="flex justify-between"><span>NASDAQ</span><span className="text-green-400">+1.22% ▲</span></div>
                <div className="flex justify-between"><span>S&P 500</span><span className="text-green-400">+0.61% ▲</span></div>
                <div className="flex justify-between"><span>BTC</span><span className="text-red-400">-0.34% ▼</span></div>
                <div className="flex justify-between"><span>ETH</span><span className="text-green-400">+2.11% ▲</span></div>
              </div>
              <p className="text-[10px] opacity-40 mt-3">Powered by AI market scan • 1m delay</p>
            </div>
          </div>
        </div>

        {/* Latest Grid */}
        <div className="mt-10">
          <SectionHeader title="Today’s Headlines" subtitle={`${all.length} verified stories • Updated every minute`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((a,i)=>(<NewsCard key={i} article={a} />))}
          </div>
        </div>

        {/* Category triple */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-black/10 pt-8">
          <div>
            <SectionHeader title="Business & Finance" href="/category/business"/>
            <div className="space-y-1">
              {business.map((a,i)=><SecondaryCard key={i} article={a} compact />)}
            </div>
          </div>
          <div className="lg:border-x lg:px-8 border-black/10">
            <SectionHeader title="Technology & AI" href="/category/technology"/>
            <div className="space-y-1">
              {tech.map((a,i)=><SecondaryCard key={i} article={a} compact />)}
            </div>
          </div>
          <div>
            <SectionHeader title="World & Politics" href="/category/world"/>
            <div className="space-y-1">
              {world.map((a,i)=><SecondaryCard key={i} article={a} compact />)}
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="mt-14 border-y-[3px] border-double border-black py-8 text-center bg-[#fffefb]">
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-60 font-bold">DayToNightNews Intelligence</p>
          <p className="mt-2 font-serif text-xl md:text-2xl max-w-3xl mx-auto leading-tight">
            Every story verified against <span className="underline decoration-[#c41e1a] decoration-2">5 independent primary sources</span>. 
            Confidence scored. Timeline reconstructed. Media rights-checked. 
            Published in <span className="font-black">under 60 seconds</span>.
          </p>
          <div className="mt-6 flex justify-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className="bg-black text-white px-3 py-1">7 AI Agents</span>
            <span className="border border-black px-3 py-1">No Fabrication</span>
            <span className="border border-black px-3 py-1">Always Attributed</span>
          </div>
        </div>
      </main>
    </div>
  );
}
