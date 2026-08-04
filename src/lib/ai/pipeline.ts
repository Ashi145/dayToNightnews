import { db } from '@/db';
import { aiJobs, articles, aiAgentTypeEnum, aiJobStatusEnum } from '@/db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

type AgentType = (typeof aiAgentTypeEnum)[number];
type JobStatus = (typeof aiJobStatusEnum)[number];

export interface AIJobContext {
  jobId: string;
  agentType: AgentType;
  input: any;
  output?: any;
  status: JobStatus;
}

export async function createAIJob(agentType: AgentType, input: any) {
  const id = nanoid();
  await db.insert(aiJobs).values({
    id,
    agentType,
    status: 'pending',
    inputData: input,
  });
  return id;
}

export async function updateAIJob(id: string, status: JobStatus, output: any) {
  await db.update(aiJobs)
    .set({ status, outputData: output, completedAt: new Date() })
    .where(eq(aiJobs.id, id));
}

export async function runAIPipeline(initialTopic: string) {
  console.log(`Starting AI Pipeline for topic: ${initialTopic}`);

  // 1. Breaking News Agent
  const breakingJobId = await createAIJob('breaking', { topic: initialTopic });
  await updateAIJob(breakingJobId, 'processing', {});
  const discoveredData = {
    headline: `Breaking: ${initialTopic} reaches critical mass`,
    keyFacts: [`Something happened with ${initialTopic}`, `Experts are surprised`],
    sources: ['Reuters', 'AP'],
    timestamp: new Date(),
  };
  await updateAIJob(breakingJobId, 'completed', discoveredData);

  // 2. Verification Agent
  const verifyJobId = await createAIJob('verification', discoveredData);
  await updateAIJob(verifyJobId, 'processing', {});
  const verificationData = {
    ...discoveredData,
    confidenceScore: 85,
    verifiedFacts: discoveredData.keyFacts,
    status: 'verified',
  };
  await updateAIJob(verifyJobId, 'completed', verificationData);

  // 3. Research Agent
  const researchJobId = await createAIJob('research', verificationData);
  await updateAIJob(researchJobId, 'processing', {});
  const researchData = {
    ...verificationData,
    background: `Deep dive into ${initialTopic} history...`,
    timeline: [
      { timestamp: new Date(Date.now() - 86400000), description: 'Event started' },
      { timestamp: new Date(), description: 'Current peak' },
    ],
  };
  await updateAIJob(researchJobId, 'completed', researchData);

  // 4. Writing Agent
  const writeJobId = await createAIJob('writing', researchData);
  await updateAIJob(writeJobId, 'processing', {});
  const articleData = {
    title: `The Evolution of ${initialTopic}: A Comprehensive Look`,
    slug: `evolution-of-${initialTopic.toLowerCase().replace(/\s+/g, '-')}`,
    summary: `An in-depth analysis of ${initialTopic} and its implications.`,
    content: `Full article content about ${initialTopic} based on research and verification...`,
    metaDescription: `Learn everything about ${initialTopic} in our latest report.`,
  };
  await updateAIJob(writeJobId, 'completed', articleData);

  // 5. Editor Agent
  const editorJobId = await createAIJob('editor', articleData);
  await updateAIJob(editorJobId, 'processing', {});
  const polishedData = {
    ...articleData,
    content: `${articleData.content}\n\n(Edited for clarity and bias check by AI Editor)`,
  };
  await updateAIJob(editorJobId, 'completed', polishedData);

  // 6. Media Agent
  const mediaJobId = await createAIJob('media', polishedData);
  await updateAIJob(mediaJobId, 'processing', {});
  const mediaData = {
    imageUrl: 'https://images.unsplash.com/photo-1504711432869-efd597cbe06d',
    ogImage: 'https://images.unsplash.com/photo-1504711432869-efd597cbe06d',
  };
  await updateAIJob(mediaJobId, 'completed', mediaData);

  // 7. SEO Agent
  const seoJobId = await createAIJob('seo', { ...polishedData, ...mediaData });
  await updateAIJob(seoJobId, 'processing', {});
  const seoData = {
    canonicalUrl: `/articles/${articleData.slug}`,
    schemaJson: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": articleData.title,
    },
  };
  await updateAIJob(seoJobId, 'completed', seoData);

  // Final Step: Publish
  const articleId = nanoid();
  await db.insert(articles).values({
    id: articleId,
    title: polishedData.title,
    slug: polishedData.slug,
    summary: polishedData.summary,
    content: polishedData.content,
    status: 'published',
    confidenceScore: verificationData.confidenceScore,
    metaDescription: polishedData.metaDescription,
    schemaJson: seoData.schemaJson,
    publishedAt: new Date(),
  });

  return articleId;
}
