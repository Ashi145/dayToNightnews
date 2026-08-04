import Parser from 'rss-parser';
import { deterministicImage, extractImageFromHtml } from '@/lib/images';

type CustomFeed = { title: string; description: string; link: string; pubDate?: string };
type CustomItem = {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
  enclosure?: any;
  mediaContent?: any;
  mediaThumbnail?: any;
  categories?: string[];
  creator?: string;
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  } as any,
  timeout: 12000,
});

export interface LiveArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  imageUrl: string;
  confidenceScore: number;
  readingTime: number;
  isBreaking?: boolean;
  isTrending?: boolean;
}

const RSS_SOURCES = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', source: 'BBC News' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business', source: 'BBC Business' },
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science', source: 'BBC Science' },
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', category: 'Health', source: 'BBC Health' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'World', source: 'NY Times' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', category: 'Technology', source: 'NY Times Tech' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics', source: 'NY Times Politics' },
  { url: 'https://www.theguardian.com/world/rss', category: 'World', source: 'The Guardian' },
  { url: 'https://www.theguardian.com/uk-news/rss', category: 'World', source: 'The Guardian' },
  { url: 'https://www.theguardian.com/business/rss', category: 'Business', source: 'The Guardian' },
  { url: 'https://www.theguardian.com/technology/rss', category: 'Technology', source: 'The Guardian' },
  { url: 'https://techcrunch.com/feed/', category: 'Technology', source: 'TechCrunch' },
  { url: 'https://www.wired.com/feed/rss', category: 'Technology', source: 'Wired' },
  { url: 'https://www.theverge.com/rss/index.xml', category: 'Technology', source: 'The Verge' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology', source: 'Ars Technica' },
];

const IMAGE_FALLBACKS: Record<string, string> = {
  World: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200',
  Business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200',
  AI: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
  Science: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200',
  Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200',
  Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200',
  Finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
  Crypto: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200',
  Entertainment: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200',
  Gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200',
  General: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 220));
}

function extractFeedImage(item: CustomItem): string | null {
  const media: any = item.mediaContent || item.mediaThumbnail;
  if (media) {
    const list = Array.isArray(media) ? media : [media];
    for (const m of list) {
      const url = m?.$?.url || m?.url;
      if (typeof url === 'string' && !url.startsWith('data:')) return url;
    }
  }
  const enc = item.enclosure as any;
  if (enc) {
    const url = typeof enc === 'string' ? enc : enc?.url;
    if (typeof url === 'string' && /\.(jpe?g|png|webp|avif)/i.test(url)) return url;
  }
  const fromHtml = extractImageFromHtml(item.content);
  if (fromHtml) return fromHtml;
  return null;
}

let cachedNews: { data: LiveArticle[]; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5;

export async function fetchLiveNews(force = false): Promise<LiveArticle[]> {
  if (!force && cachedNews && Date.now() - cachedNews.timestamp < CACHE_TTL) {
    return cachedNews.data;
  }

  const results: LiveArticle[] = [];

  const rssPromises = RSS_SOURCES.slice(0, 12).map(async (src) => {
    try {
      const feed = await parser.parseURL(src.url);
      return feed.items.slice(0, 4).map((item): LiveArticle | null => {
        if (!item.title || !item.link) return null;
        const pubDate = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : new Date();
        const feedImage = extractFeedImage(item);
        const summary = item.contentSnippet?.slice(0, 250) || item.content?.slice(0, 250) || `Latest update from ${src.source} on ${src.category}.`;
        const content = item.content || item.contentSnippet || '';

        return {
          id: `live-${slugify(item.title)}-${pubDate.getTime()}`,
          title: item.title,
          slug: slugify(item.title),
          summary,
          content,
          category: src.category,
          source: src.source,
          sourceUrl: item.link!,
          publishedAt: pubDate,
          imageUrl: feedImage || deterministicImage(item.title) || IMAGE_FALLBACKS[src.category] || IMAGE_FALLBACKS.General,
          confidenceScore: 92 + Math.floor(Math.random() * 7),
          readingTime: estimateReadingTime(summary),
          isBreaking: Math.random() > 0.85,
          isTrending: Math.random() > 0.5,
        };
      }).filter(Boolean) as LiveArticle[];
    } catch (e) {
      console.warn(`Failed RSS ${src.url}:`, (e as Error).message);
      return [];
    }
  });

  const hnPromise = (async () => {
    try {
      const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page', { next: { revalidate: 300 } });
      if (!res.ok) return [];
      const json = await res.json();
      return (json.hits as any[]).slice(0, 6).map((hit): LiveArticle => {
        const pubDate = new Date(hit.created_at);
        const category = hit.title?.toLowerCase().includes('ai') ? 'AI' : 'Technology';
        return {
          id: `hn-${hit.objectID}`,
          title: hit.title,
          slug: slugify(hit.title),
          summary: `Discussion and analysis: ${hit.title}. ${hit.points || 0} points, ${hit.num_comments || 0} comments on Hacker News.`,
          content: hit.story_text || hit.title,
          category,
          source: 'Hacker News',
          sourceUrl: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          publishedAt: pubDate,
          imageUrl: deterministicImage(hit.title),
          confidenceScore: 88,
          readingTime: 4,
          isTrending: (hit.points || 0) > 150,
        };
      });
    } catch {
      return [];
    }
  })();

  try {
    const [rssResults, hnResults] = await Promise.all([Promise.all(rssPromises), hnPromise]);
    results.push(...rssResults.flat(), ...hnResults);
  } catch (e) {
    console.error('Live news aggregation failed', e);
  }

  const seen = new Set<string>();
  const deduped = results.filter(a => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });

  deduped.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  deduped.slice(0, 3).forEach(a => { if (!a.isBreaking) a.isBreaking = true; });

  cachedNews = { data: deduped, timestamp: Date.now() };
  return deduped;
}

export async function getBreakingNews(): Promise<LiveArticle[]> {
  const all = await fetchLiveNews();
  return all.filter(a => a.isBreaking).slice(0, 8);
}

export async function getTrendingNews(): Promise<LiveArticle[]> {
  const all = await fetchLiveNews();
  return all.filter(a => a.isTrending).slice(0, 10);
}
