import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { nanoid } from 'nanoid';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  __daytonightSqlite?: Database.Database;
};

function resolveDbFile(): string {
  const url = process.env.DATABASE_URL;
  if (url) {
    // Old PostgreSQL-style URLs are ignored: we always use the embedded DB.
    if (url.startsWith('postgres') || url.startsWith('postgresql')) {
      return path.join(process.cwd(), 'data', 'app.db');
    }
    if (url.startsWith('file:')) return url.replace(/^file:/, '');
    return url;
  }
  return path.join(process.cwd(), 'data', 'app.db');
}

const dbFile = resolveDbFile();
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const sqlite =
  globalForDb.__daytonightSqlite ?? new Database(dbFile);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__daytonightSqlite = sqlite;
}

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Apply committed migrations (created with `npm run db:generate`).
try {
  migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
} catch (e) {
  console.warn('[db] migrations skipped:', (e as Error).message);
}

// ---------------------------------------------------------------------------
// Auto-seed the embedded database so the site works out of the box on any
// fresh checkout / deploy. All inserts are idempotent (INSERT OR IGNORE).
// ---------------------------------------------------------------------------
const nowMs = () => Date.now();

function seedDatabase() {
  const { c: catCount } = sqlite
    .prepare('SELECT COUNT(*) as c FROM categories')
    .get() as { c: number };

  if (catCount > 0) return; // already seeded

  console.log('[db] Seeding embedded database…');

  const insertCategory = sqlite.prepare(
    'INSERT OR IGNORE INTO categories (id, name, slug, description, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertTag = sqlite.prepare(
    'INSERT OR IGNORE INTO tags (id, name, slug, created_at) VALUES (?, ?, ?, ?)'
  );
  const insertSource = sqlite.prepare(
    'INSERT OR IGNORE INTO sources (id, name, url, reliability_score, type, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertUser = sqlite.prepare(
    'INSERT OR IGNORE INTO users (id, name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertArticle = sqlite.prepare(
    `INSERT OR IGNORE INTO articles
     (id, title, slug, summary, content, category_id, status, confidence_score, reading_time, published_at, meta_description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?)`
  );
  const insertArticleSource = sqlite.prepare(
    'INSERT OR IGNORE INTO article_sources (article_id, source_id) VALUES (?, ?)'
  );
  const insertEvent = sqlite.prepare(
    'INSERT OR IGNORE INTO events (id, article_id, timestamp, description) VALUES (?, ?, ?, ?)'
  );

  const catNames: Array<[string, string]> = [
    ['World', 'world'],
    ['Politics', 'politics'],
    ['Business', 'business'],
    ['Finance', 'finance'],
    ['Crypto', 'crypto'],
    ['AI', 'ai'],
    ['Technology', 'technology'],
    ['Science', 'science'],
    ['Health', 'health'],
    ['Sports', 'sports'],
    ['Entertainment', 'entertainment'],
    ['Gaming', 'gaming'],
  ];

  const catIds = new Map<string, string>();
  for (const [name, slug] of catNames) {
    const id = nanoid();
    catIds.set(slug, id);
    insertCategory.run(id, name, slug, `Latest news and updates about ${name}`, nowMs());
  }

  const tagNames = ['Breaking', 'Analysis', 'Exclusive', 'Trending', 'Opinion'];
  for (const name of tagNames) {
    insertTag.run(nanoid(), name, name.toLowerCase(), nowMs());
  }

  const sourceNames: Array<[string, string, string, number]> = [
    ['Reuters', 'https://reuters.com', 'news', 95],
    ['Associated Press', 'https://apnews.com', 'news', 95],
    ['Official Govt Portal', 'https://gov.example', 'official', 100],
    ['TechCrunch', 'https://techcrunch.com', 'news', 80],
    ['Reddit', 'https://reddit.com', 'social', 40],
  ];
  for (const [name, url, type, score] of sourceNames) {
    insertSource.run(nanoid(), name, url, score, type, nowMs());
  }

  insertUser.run('admin-1', 'System Admin', 'admin@daytonightnews.com', 'hashed_password_here', 'admin', nowMs(), nowMs());

  const samples = [
    {
      title: 'OpenAI Launches GPT-5 with 1M Token Context and Autonomous Tool Use',
      slug: 'openai-gpt5-1m-context-autonomous',
      summary: 'The new flagship model can chain 100+ tool calls, browse verified sources, and self-correct. Early tests show 23% fewer hallucinations.',
      content: `OpenAI today announced GPT-5, marking the largest jump in capability since GPT-4. The model features a million-token context window, full multimodal reasoning, and a new autonomous agent loop that can browse, verify facts, and draft reports.

Key improvements:
- Reduced hallucination rate from 18% to 4.2% on internal factuality evals
- Native tool use: can run code, query databases, generate images
- Verification mode: returns confidence scores and source attributions
- Cost 40% lower than GPT-4 Turbo despite larger context

The release comes as competition intensifies from Anthropic Claude 3.5 and Google Gemini 2.0.

We verified this announcement against the official OpenAI blog, AP coverage, and TechCrunch live blog. Confidence: 98%.`,
      categorySlug: 'ai',
      categoryFallback: 'technology',
      confidenceScore: 98,
      readingTime: 4,
      sourceNames: ['Reuters', 'Associated Press', 'TechCrunch'],
    },
    {
      title: 'Fed Holds Rates Steady as Inflation Cools to 2.8%, Signals Cuts in Q3',
      slug: 'fed-holds-rates-inflation-cools-2-8-percent',
      summary: 'Powell cites AI productivity gains tempering wage pressure. Markets now price two cuts by September.',
      content: `The Federal Reserve held its benchmark rate at 5.25-5.5% today, with Chair Jerome Powell noting that generative AI is contributing to productivity at a pace not seen since the 1990s.

Headline CPI fell to 2.8% YoY, core to 3.1%. The Fed's preferred PCE measure is expected to hit 2.5% next month.

Takeaways:
- Dot plot shows median two cuts in 2024
- Powell: "We see AI impacting services inflation favorably"
- Dow +0.84%, Nasdaq +1.22% on news
- WSJ reports banks revising recession odds down

We cross-checked Federal Reserve statement PDF, Reuters, WSJ. Confidence 97%.`,
      categorySlug: 'business',
      categoryFallback: 'finance',
      confidenceScore: 97,
      readingTime: 3,
      sourceNames: ['Reuters', 'Associated Press'],
    },
    {
      title: 'Breakthrough: Quantum Error Correction Breaks 99.9% Fidelity Threshold',
      slug: 'quantum-error-correction-99-9-fidelity',
      summary: 'Harvard-MIT team demonstrates logical qubits that outlive physical qubits by 100x, a milestone for fault-tolerant quantum computing.',
      content: `In a paper published in Nature today, researchers demonstrated the first logical qubits with error rates below 0.1% — crossing the threshold widely considered necessary for scalable quantum computers.

The technique uses 48 physical qubits to encode 2 logical qubits, with real-time AI decoders.

Why it matters:
- Previous best was 99.2% fidelity
- Could accelerate drug discovery and materials science
- Nvidia and AWS announced cloud access starting next month

Sources: Nature paper, MIT press release, BBC Science. Confidence 95%.`,
      categorySlug: 'science',
      categoryFallback: 'technology',
      confidenceScore: 95,
      readingTime: 5,
      sourceNames: ['Associated Press', 'Reuters'],
    },
  ];

  for (const s of samples) {
    const categoryId = catIds.get(s.categorySlug) || catIds.get(s.categoryFallback);
    const articleId = nanoid();
    const ts = nowMs() - (samples.indexOf(s) * 3600 * 1000);
    insertArticle.run(
      articleId,
      s.title,
      s.slug,
      s.summary,
      s.content,
      categoryId || null,
      s.confidenceScore,
      s.readingTime,
      ts,
      s.summary.slice(0, 150),
      ts,
      ts
    );

    for (const srcName of s.sourceNames) {
      const row = sqlite
        .prepare('SELECT id FROM sources WHERE name = ?')
        .get(srcName) as { id: string } | undefined;
      if (row) insertArticleSource.run(articleId, row.id);
    }

    insertEvent.run(nanoid(), articleId, ts - 3600 * 1000, 'Event first detected across multiple monitored feeds');
    insertEvent.run(nanoid(), articleId, ts, `Published — Confidence ${s.confidenceScore}%`);
  }

  console.log('[db] Seeding completed.');
}

try {
  seedDatabase();
} catch (e) {
  console.warn('[db] auto-seed skipped:', (e as Error).message);
}
