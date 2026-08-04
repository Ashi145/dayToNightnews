import Parser from 'rss-parser';
import { deterministicImage, extractImageFromHtml, isUsableImageUrl, decodeImageUrl, upgradeImageQuality } from '@/lib/images';

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
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DayToNightNews/1.0)' } as any,
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
  reliability: number;
}

interface FeedSource {
  url: string;
  category: string;
  source: string;
  reliability: number;
}

const RSS_SOURCES: FeedSource[] = [
  // World
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', source: 'BBC News', reliability: 96 },
  { url: 'https://www.theguardian.com/world/rss', category: 'World', source: 'The Guardian', reliability: 94 },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World', source: 'Al Jazeera', reliability: 93 },
  { url: 'https://feeds.skynews.com/feeds/rss/world.xml', category: 'World', source: 'Sky News', reliability: 90 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'World', source: 'NY Times', reliability: 95 },
  { url: 'https://feeds.npr.org/1001/rss.xml', category: 'World', source: 'NPR', reliability: 94 },
  // Politics
  { url: 'https://feeds.bbci.co.uk/news/politics/rss.xml', category: 'Politics', source: 'BBC Politics', reliability: 96 },
  { url: 'https://www.theguardian.com/politics/rss', category: 'Politics', source: 'The Guardian', reliability: 94 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics', source: 'NY Times', reliability: 95 },
  { url: 'https://rss.politico.com/frontpage.xml', category: 'Politics', source: 'Politico', reliability: 92 },
  { url: 'https://thehill.com/rss/syndicated/24hr.xml', category: 'Politics', source: 'The Hill', reliability: 88 },
  { url: 'https://www.pbs.org/rss/14657', category: 'Politics', source: 'PBS NewsHour', reliability: 93 },
  // Business
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business', source: 'BBC Business', reliability: 96 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'Business', source: 'NY Times', reliability: 95 },
  { url: 'https://feeds.reuters.com/reuters/businessNews', category: 'Business', source: 'Reuters', reliability: 97 },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'Business', source: 'CNBC', reliability: 91 },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'Business', source: 'Bloomberg', reliability: 95 },
  { url: 'https://fortune.com/feed/', category: 'Business', source: 'Fortune', reliability: 88 },
  // Finance
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', category: 'Finance', source: 'MarketWatch', reliability: 88 },
  { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'Finance', source: 'WSJ Markets', reliability: 94 },
  { url: 'https://www.ft.com/?format=rss', category: 'Finance', source: 'Financial Times', reliability: 95 },
  { url: 'https://finance.yahoo.com/news/rssindex', category: 'Finance', source: 'Yahoo Finance', reliability: 82 },
  { url: 'https://www.investing.com/rss/news.rss', category: 'Finance', source: 'Investing.com', reliability: 84 },
  { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', category: 'Finance', source: 'CNBC Finance', reliability: 91 },
  // Technology
  { url: 'https://techcrunch.com/feed/', category: 'Technology', source: 'TechCrunch', reliability: 90 },
  { url: 'https://www.theverge.com/rss/index.xml', category: 'Technology', source: 'The Verge', reliability: 91 },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology', source: 'Ars Technica', reliability: 93 },
  { url: 'https://www.wired.com/feed/rss', category: 'Technology', source: 'Wired', reliability: 92 },
  { url: 'https://www.cnet.com/rss/news/', category: 'Technology', source: 'CNET', reliability: 85 },
  { url: 'https://gizmodo.com/rss', category: 'Technology', source: 'Gizmodo', reliability: 86 },
  // AI
  { url: 'https://techcrunch.com/category/artificial-intelligence-2/feed/', category: 'AI', source: 'TechCrunch AI', reliability: 90 },
  { url: 'https://www.technologyreview.com/feed/', category: 'AI', source: 'MIT Technology Review', reliability: 94 },
  { url: 'https://venturebeat.com/category/ai/feed/', category: 'AI', source: 'VentureBeat AI', reliability: 88 },
  // Science
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science', source: 'BBC Science', reliability: 96 },
  { url: 'https://www.nature.com/nature.rss', category: 'Science', source: 'Nature', reliability: 97 },
  { url: 'https://www.newscientist.com/feed/home/', category: 'Science', source: 'New Scientist', reliability: 92 },
  { url: 'https://rss.sciam.com/ScientificAmerican-Global', category: 'Science', source: 'Scientific American', reliability: 95 },
  { url: 'https://www.space.com/feeds/all', category: 'Science', source: 'Space.com', reliability: 90 },
  { url: 'https://phys.org/rss-feed/', category: 'Science', source: 'Phys.org', reliability: 85 },
  // Health
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', category: 'Health', source: 'BBC Health', reliability: 96 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', category: 'Health', source: 'NY Times', reliability: 95 },
  { url: 'https://www.statnews.com/feed/', category: 'Health', source: 'STAT News', reliability: 93 },
  { url: 'https://www.medicalnewstoday.com/rss', category: 'Health', source: 'Medical News Today', reliability: 85 },
  { url: 'https://rss.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC', category: 'Health', source: 'WebMD', reliability: 82 },
  { url: 'https://www.nih.gov/news-events/news-releases/feed', category: 'Health', source: 'NIH News', reliability: 97 },
  // Sports
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports', source: 'BBC Sport', reliability: 96 },
  { url: 'https://www.espn.com/espn/rss/news', category: 'Sports', source: 'ESPN', reliability: 92 },
  { url: 'https://www.skysports.com/rss/12040', category: 'Sports', source: 'Sky Sports', reliability: 90 },
  { url: 'https://www.theguardian.com/sport/rss', category: 'Sports', source: 'The Guardian', reliability: 94 },
  { url: 'https://www.si.com/rss/si_topstories.rss', category: 'Sports', source: 'Sports Illustrated', reliability: 88 },
  { url: 'https://sports.yahoo.com/rss/', category: 'Sports', source: 'Yahoo Sports', reliability: 83 },
  // Entertainment
  { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment', source: 'BBC Culture', reliability: 96 },
  { url: 'https://variety.com/feed/', category: 'Entertainment', source: 'Variety', reliability: 90 },
  { url: 'https://www.hollywoodreporter.com/feed/', category: 'Entertainment', source: 'Hollywood Reporter', reliability: 89 },
  { url: 'https://rollingstone.com/feed/', category: 'Entertainment', source: 'Rolling Stone', reliability: 87 },
  { url: 'https://www.billboard.com/feed/', category: 'Entertainment', source: 'Billboard', reliability: 88 },
  { url: 'https://deadline.com/feed/', category: 'Entertainment', source: 'Deadline', reliability: 86 },
  // Gaming
  { url: 'https://kotaku.com/rss', category: 'Gaming', source: 'Kotaku', reliability: 85 },
  { url: 'https://feeds.feedburner.com/ign/games-all', category: 'Gaming', source: 'IGN', reliability: 86 },
  { url: 'https://www.gamesradar.com/feed/', category: 'Gaming', source: 'GamesRadar+', reliability: 83 },
  { url: 'https://www.pcgamer.com/rss/', category: 'Gaming', source: 'PC Gamer', reliability: 84 },
  { url: 'https://www.polygon.com/rss/index.xml', category: 'Gaming', source: 'Polygon', reliability: 86 },
  { url: 'https://www.eurogamer.net/?format=rss', category: 'Gaming', source: 'Eurogamer', reliability: 84 },
  // Crypto
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'Crypto', source: 'CoinDesk', reliability: 90 },
  { url: 'https://cointelegraph.com/rss', category: 'Crypto', source: 'CoinTelegraph', reliability: 88 },
  { url: 'https://www.theblock.co/rss.xml', category: 'Crypto', source: 'The Block', reliability: 86 },
  { url: 'https://decrypt.co/feed', category: 'Crypto', source: 'Decrypt', reliability: 83 },
  { url: 'https://news.bitcoin.com/feed/', category: 'Crypto', source: 'Bitcoin.com', reliability: 80 },
  { url: 'https://cryptoslate.com/feed/', category: 'Crypto', source: 'CryptoSlate', reliability: 82 },
];

// Category override priority (highest first) — spec section 3.2
const KEYWORD_TO_CATEGORY: Array<[string, string[]]> = [
  ['Health', ['vaccine', 'FDA', 'CDC', 'hospital', 'disease', 'cancer', 'COVID', 'pandemic', 'mental health', 'drug trial', 'clinical', 'diagnosis', 'treatment', 'medical', 'healthcare', 'patient']],
  ['Sports', ['goal', 'score', 'match', 'player', 'team', 'league', 'championship', 'transfer', 'injury', 'coach', 'draft', 'trade deadline', 'tournament', 'Olympics', 'World Cup', 'Premier League', 'NFL', 'NBA', 'MLB', 'tennis', 'golf', 'NHL', 'penalty', 'half-time']],
  ['Gaming', ['video game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'esports', 'twitch', 'game release', 'patch notes', 'dlc']],
  ['Crypto', ['bitcoin', 'ethereum', 'crypto', 'blockchain', 'defi', 'nft', 'wallet', 'exchange', 'binance', 'coinbase', 'solana', 'ripple', 'stablecoin', 'web3', 'token', 'satoshi', 'mining', 'halving']],
  ['AI', ['AI', 'artificial intelligence', 'machine learning', 'LLM', 'large language model', 'GPT', 'ChatGPT', 'OpenAI', 'Anthropic', 'Claude', 'Gemini', 'deepmind', 'neural network', 'robotics', 'automation', 'model training']],
  ['Science', ['space', 'NASA', 'cosmos', 'planet', 'telescope', 'DNA', 'genome', 'quantum', 'physics', 'chemistry', 'biology', 'evolution', 'climate change', 'archaeology', 'research paper', 'study published']],
  ['Politics', ['election', 'vote', 'parliament', 'congress', 'senate', 'president', 'prime minister', 'government', 'law', 'legislation', 'bill', 'campaign', 'democrat', 'republican', 'partisan']],
  ['Finance', ['stock', 'shares', 'market', 'S&P', 'Dow Jones', 'Nasdaq', 'interest rate', 'Fed', 'Federal Reserve', 'inflation', 'CPI', 'GDP', 'bond', 'yield', 'treasury', 'hedge fund', 'investment', 'portfolio', 'trader', 'bear market', 'bull market', 'recession', 'economy', 'bank rate']],
  ['Entertainment', ['movie', 'film', 'oscars', 'grammy', 'album', 'song', 'streaming', 'netflix', 'disney+', 'hollywood', 'celebrity', 'actor', 'actress', 'premiere', 'box office', 'tv show', 'series finale']],
];

function kwRegex(kw: string): RegExp {
  const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const isAcronym = /^[A-Z&.]{1,5}$/.test(kw);
  if (isAcronym || kw.length <= 3) return new RegExp(`\\b${esc}\\b`, 'i');
  return new RegExp(esc, 'i');
}

export function assignCategory(feedCategory: string, title: string, contentSnippet?: string): string {
  const haystack = `${title} ${(contentSnippet || '').slice(0, 200)}`;
  for (const [category, keywords] of KEYWORD_TO_CATEGORY) {
    if (keywords.some(kw => kwRegex(kw).test(haystack))) return category;
  }
  return feedCategory;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 220));
}

function extractFeedImage(item: CustomItem): string | null {
  const media: any = item.mediaContent || item.mediaThumbnail;
  if (media) {
    const list = Array.isArray(media) ? media : [media];
    const candidates: string[] = [];
    for (const m of list) {
      const url = m?.$?.url || m?.url;
      if (typeof url === 'string') candidates.push(decodeImageUrl(url));
    }
    candidates.sort((a, b) => b.length - a.length);
    for (const url of candidates) {
      if (isUsableImageUrl(url)) return upgradeImageQuality(url);
    }
  }
  const enc = item.enclosure as any;
  if (enc) {
    const url = typeof enc === 'string' ? enc : enc?.url;
    if (typeof url === 'string' && /\.(jpe?g|png|webp|avif)/i.test(url) && isUsableImageUrl(url)) return upgradeImageQuality(url);
  }
  const fromHtml = extractImageFromHtml(item.content);
  if (fromHtml) return fromHtml;
  return null;
}

let cachedNews: { data: LiveArticle[]; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5;
const SIX_HOURS = 1000 * 60 * 60 * 6;

export async function fetchLiveNews(force = false): Promise<LiveArticle[]> {
  if (!force && cachedNews && Date.now() - cachedNews.timestamp < CACHE_TTL) {
    return cachedNews.data;
  }

  const results: LiveArticle[] = [];

  const rssPromises = RSS_SOURCES.map(async (src) => {
    try {
      const feed = await parser.parseURL(src.url);
      return feed.items.slice(0, 6).map((item): LiveArticle | null => {
        if (!item.title || !item.link) return null;
        let pubDate: Date;
        try {
          pubDate = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : new Date();
        } catch {
          pubDate = new Date();
          console.warn(`Unparseable date for ${item.title}`);
        }
        const snippet = item.contentSnippet || '';
        const feedImage = extractFeedImage(item);
        const category = assignCategory(src.category, item.title, snippet);
        const summary = snippet.slice(0, 280) || item.content?.slice(0, 280) || `Latest update from ${src.source} on ${src.category}.`;
        const content = item.content || item.contentSnippet || '';

        return {
          id: `live-${slugify(item.title)}-${pubDate.getTime()}`,
          title: item.title,
          slug: slugify(item.title),
          summary,
          content,
          category,
          source: src.source,
          sourceUrl: item.link!,
          publishedAt: pubDate,
          imageUrl: feedImage || deterministicImage(category, item.title),
          confidenceScore: src.reliability,
          readingTime: estimateReadingTime(content || summary),
          reliability: src.reliability,
          isBreaking: Date.now() - pubDate.getTime() < SIX_HOURS,
          isTrending: Math.random() > 0.7,
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
      return (json.hits as any[]).slice(0, 6).map((hit): LiveArticle | null => {
        if (!hit.title) return null;
        const pubDate = new Date(hit.created_at);
        const category = assignCategory('Technology', hit.title, hit.story_text || '');
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
          imageUrl: deterministicImage(category, hit.title),
          confidenceScore: 85,
          readingTime: 4,
          reliability: 85,
          isBreaking: Date.now() - pubDate.getTime() < SIX_HOURS,
          isTrending: (hit.points || 0) > 150,
        };
      }).filter(Boolean) as LiveArticle[];
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

  cachedNews = { data: deduped, timestamp: Date.now() };
  return deduped;
}

export async function getBreakingNews(): Promise<LiveArticle[]> {
  const all = await fetchLiveNews();
  const now = Date.now();
  return all.filter(a => a.isBreaking && (now - new Date(a.publishedAt).getTime()) < SIX_HOURS).slice(0, 8);
}

export async function getTrendingNews(): Promise<LiveArticle[]> {
  const all = await fetchLiveNews();
  return all.filter(a => a.isTrending).slice(0, 10);
}
