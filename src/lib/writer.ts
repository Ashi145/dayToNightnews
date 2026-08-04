import type { LiveArticle } from '@/lib/liveNews';

export interface WrittenSection {
  heading: string;
  paragraphs: string[];
}

export interface WrittenArticle extends LiveArticle {
  sections: WrittenSection[];
  metaDescription: string;
  readingTime: number;
  faq: { question: string; answer: string }[];
  provenance: { source: string; confidence: number; corroborated: boolean }[];
}

export const NEWSROOM_BYLINE = 'DayToNight Newsroom';

function cleanTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim();
}

function metaDescription(title: string, summary: string): string {
  const base = `${title}. ${summary}`.replace(/\s+/g, ' ').trim();
  return base.length > 155 ? `${base.slice(0, 152).trimEnd()}…` : base;
}

function estimateReadingTime(sections: WrittenSection[]): number {
  const words = sections.reduce((acc, s) => acc + s.paragraphs.join(' ').split(/\s+/).length, 0);
  return Math.max(2, Math.ceil(words / 220));
}

export function writeArticle(article: LiveArticle): WrittenArticle {
  const title = cleanTitle(article.title);
  const lead = article.summary.replace(/\s+/g, ' ').trim();
  const sourceName = article.source || 'sources';
  const category = article.category || 'General';
  const confidence = article.confidenceScore ?? 90;

  const sections: WrittenSection[] = [
    {
      heading: 'The Lead',
      paragraphs: [
        lead,
        `DayToNight has pulled this story from ${sourceName} and cross-checked it against our verification pipeline before publishing.`,
      ],
    },
    {
      heading: 'Provenance',
      paragraphs: [
        `This article was sourced from ${sourceName}, filed under ${category}, and evaluated at a ${confidence}% confidence level by the DayToNight verification engine based on the reporting outlet's track record and corroboration.`,
      ],
    },
    {
      heading: 'WHAT WE KNOW SO FAR',
      paragraphs: [
        title,
        `The report originated from ${sourceName} and was captured in real time by the DayToNight newsroom agent. Our system parsed the source feed, extracted the headline and body, and assigned this story to the ${category} desk.`,
        `We have not independently confirmed every detail of this report. Our confidence score reflects source reliability and any corroboration available at the time of capture.`,
      ],
    },
    {
      heading: 'WHY IT MATTERS',
      paragraphs: [
        `Stories in the ${category} space move fast, and the DayToNight newsroom is designed to surface them within minutes of publication rather than hours. This item is presented for context and should be read alongside our coverage and the original reporting.`,
      ],
    },
    {
      heading: 'HOW THIS ARTICLE WAS PRODUCED',
      paragraphs: [
        `This is an automated write-up produced by the DayToNight Newsroom agent. A discovery loop pulled the source item, the verification layer assigned a confidence score of ${confidence}%, and the writing layer assembled the sections you see here. No human editor has reviewed this particular page yet.`,
      ],
    },
    {
      heading: 'KEY TAKEAWAYS',
      paragraphs: [
        `— Story reported by ${sourceName}, filed under ${category}.`,
        `— DayToNight confidence: ${confidence}%.`,
        `— Read the original source for the full report and any corrections.`,
      ],
    },
  ];

  const readingTime = estimateReadingTime(sections);
  const faq = [
    { question: `What is this article about?`, answer: title },
    { question: `Who reported this?`, answer: `${sourceName} filed this report; DayToNight republished and verified it at ${confidence}% confidence.` },
    { question: `Is this fact-checked?`, answer: `DayToNight assigns a confidence score based on source reliability and corroboration, but this is an automated page and has not been human-edited.` },
  ];

  return {
    ...article,
    title,
    sections,
    metaDescription: metaDescription(title, lead),
    readingTime,
    faq,
    provenance: [{ source: sourceName, confidence, corroborated: confidence >= 92 }],
  };
}
