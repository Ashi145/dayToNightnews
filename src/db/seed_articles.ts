import { db } from './index';
import { articles, categories } from './schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

async function seedArticles() {
  const techCat = await db.query.categories.findFirst({ where: eq(categories.slug, 'technology') });
  const worldCat = await db.query.categories.findFirst({ where: eq(categories.slug, 'world') });
  const businessCat = await db.query.categories.findFirst({ where: eq(categories.slug, 'business') });
  const aiCat = await db.query.categories.findFirst({ where: eq(categories.slug, 'ai') });

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

Industry analysts note that the autonomous loop directly mirrors the DayToNightNews pipeline — discover, verify, research, write — suggesting foundation models are converging on agent architectures.

We verified this announcement against the official OpenAI blog, AP coverage, and TechCrunch live blog. Confidence: 98%.`,
      categoryId: aiCat?.id || techCat?.id,
      confidenceScore: 98,
      readingTime: 4,
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
      categoryId: businessCat?.id,
      confidenceScore: 97,
      readingTime: 3,
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
      categoryId: worldCat?.id,
      confidenceScore: 95,
      readingTime: 5,
    },
  ];

  for (const s of samples) {
    const exists = await db.query.articles.findFirst({ where: eq(articles.slug, s.slug) });
    if (!exists) {
      await db.insert(articles).values({
        id: nanoid(),
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        content: s.content,
        categoryId: s.categoryId || null,
        status: 'published',
        confidenceScore: s.confidenceScore,
        readingTime: s.readingTime,
        publishedAt: new Date(),
        metaDescription: s.summary.slice(0, 150),
      });
      console.log(`Seeded ${s.slug}`);
    }
  }
}

seedArticles().then(()=>{ console.log('Done'); process.exit(0); }).catch(e=>{ console.error(e); process.exit(1); });
