import Link from 'next/link';
import { getLiveArticles } from '@/lib/newsData';
import { deterministicImage, imageFromStoredContent } from '@/lib/images';
import { db } from '@/db';
import { articles as articlesTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const metadata = {
  title: 'Blog | DayToNight News — AI-Powered News Insights & Analysis',
  description: 'Read the latest news analysis, breaking stories, and in-depth reporting from DayToNight News. AI-verified articles across technology, business, world politics, science, and more.',
  openGraph: {
    title: 'Blog | DayToNight News',
    description: 'AI-verified news analysis and breaking stories updated every minute.',
    url: 'https://daytonightnews.com/blog',
    siteName: 'DayToNight News',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

async function getBlogArticles() {
  let dbArticles: any[] = [];
  try {
    const rows = await db.query.articles.findMany({
      orderBy: [desc(articlesTable.publishedAt)],
      limit: 30,
      with: { category: true },
    });
    dbArticles = rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      summary: r.summary || '',
      content: r.content,
      category: r.category?.name || 'General',
      source: 'DayToNight AI',
      publishedAt: r.publishedAt || new Date(),
      imageUrl: imageFromStoredContent(r.content) || deterministicImage(r.category?.name || 'General', r.slug),
      readingTime: r.readingTime || 4,
      confidenceScore: r.confidenceScore || 95,
    }));
  } catch (e) {
    console.error('blog db fetch failed', e);
  }

  let live: any[] = [];
  try {
    live = await getLiveArticles();
  } catch (e) {
    console.error('blog live fetch failed', e);
  }

  const combined = [...dbArticles, ...live];
  const seen = new Set();
  return combined.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPage() {
  const articles = await getBlogArticles();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'DayToNight News Blog',
    description: 'AI-powered news analysis and breaking stories.',
    url: 'https://daytonightnews.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'DayToNight News',
      logo: { '@type': 'ImageObject', url: 'https://daytonightnews.com/favicon.png' },
    },
    blogPost: articles.slice(0, 20).map((a: any) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `https://daytonightnews.com/articles/${a.slug}`,
      datePublished: a.publishedAt?.toISOString?.() || new Date(a.publishedAt).toISOString(),
      description: a.summary,
      author: { '@type': 'Organization', name: 'DayToNight Newsroom' },
    })),
  };

  const [featured, ...rest] = articles;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <main className="bg-[#fefcf8] min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-[1200px]">
          {/* Blog Header */}
          <header className="mb-10 border-b-2 border-black/10 pb-6">
            <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl md:text-5xl font-black tracking-tight text-[#121212]">
              The DayToNight Blog
            </h1>
            <p className="mt-3 text-[#6b6b6b] text-lg max-w-2xl">
              AI-verified news analysis, breaking stories, and in-depth reporting — updated every minute across 12 categories.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs tracking-widest uppercase font-bold text-[#6b6b6b]">
              <span className="h-px w-8 bg-black/20" />
              <span>{articles.length} articles</span>
              <span className="h-px w-4 bg-black/10" />
              <span>Updated {formatDate(new Date())}</span>
              <span className="h-px w-8 bg-black/20" />
            </div>
          </header>

          {/* Featured Article */}
          {featured && (
            <article className="mb-12">
              <Link href={`/articles/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {featured.imageUrl && (
                    <div className="overflow-hidden rounded-sm">
                      <img
                        src={featured.imageUrl}
                        alt={featured.title}
                        className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div>
                    <span className="inline-block bg-[#c41e1a] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 mb-3">
                      {featured.category}
                    </span>
                    <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl md:text-3xl font-bold tracking-tight group-hover:text-[#c41e1a] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-[#6b6b6b] leading-relaxed line-clamp-3">{featured.summary}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-[#6b6b6b]">
                      <time dateTime={new Date(featured.publishedAt).toISOString()}>
                        {formatDate(new Date(featured.publishedAt))}
                      </time>
                      <span className="h-px w-3 bg-black/10" />
                      <span>{featured.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Article Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article: any) => (
              <article key={article.slug} className="group">
                <Link href={`/articles/${article.slug}`} className="block">
                  {article.imageUrl && (
                    <div className="overflow-hidden rounded-sm mb-3">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c41e1a]">
                    {article.category}
                  </span>
                  <h3 className="font-['Playfair_Display',Georgia,serif] text-lg font-bold tracking-tight mt-1 group-hover:text-[#c41e1a] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6b6b6b] leading-relaxed line-clamp-2">{article.summary}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6b6b6b]">
                    <time dateTime={new Date(article.publishedAt).toISOString()}>
                      {formatDate(new Date(article.publishedAt))}
                    </time>
                    <span className="h-px w-3 bg-black/10" />
                    <span>{article.readingTime} min</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* SEO Footer Content */}
          <section className="mt-16 border-t border-black/10 pt-10">
            <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl font-bold mb-4">About DayToNight News</h2>
            <p className="text-[#6b6b6b] leading-relaxed max-w-3xl">
              DayToNight News is an AI-powered newsroom that discovers breaking stories every minute, verifies them across
              5 independent sources, and publishes in under 60 seconds. Our blog features in-depth analysis and
              commentary on the stories that matter most — from global politics and finance to technology, science, and culture.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {['World', 'Business', 'Technology', 'AI', 'Science', 'Health', 'Sports', 'Culture'].map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-[#c41e1a] hover:underline font-semibold"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
