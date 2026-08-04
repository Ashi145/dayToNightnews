import Link from 'next/link';

interface Props {
  article: {
    title: string;
    slug: string;
    summary: string;
    category: string;
    publishedAt: Date | string;
    confidenceScore?: number;
    imageUrl?: string;
    source?: string;
    readingTime?: number;
  };
}

export default function HeroCard({ article }: Props) {
  const date = typeof article.publishedAt === 'string' ? new Date(article.publishedAt) : article.publishedAt;
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="relative overflow-hidden bg-black">
        <img src={article.imageUrl} alt={article.title} className="w-full h-[420px] md:h-[520px] object-cover opacity-95 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-6 md:p-8 text-white max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#c41e1a] px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-sm">{article.category}</span>
            <span className="text-[11px] tracking-wide opacity-80">{article.source} • {date ? new Date(date).toLocaleDateString() : ''}</span>
            {article.confidenceScore && article.confidenceScore > 90 && (
              <span className="ml-2 bg-white/15 backdrop-blur border border-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">✓ {article.confidenceScore}% VERIFIED</span>
            )}
          </div>
          <h1 className="text-[28px] md:text-[40px] font-black leading-[0.95] tracking-tight group-hover:text-[#ffe9e8] transition-colors">
            {article.title}
          </h1>
          <p className="mt-4 text-[15px] leading-snug opacity-85 line-clamp-3 font-serif max-w-2xl">
            {article.summary}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] tracking-wide uppercase font-bold opacity-60">
        <span className="live-badge">BREAKING</span>
        <span>{article.readingTime || 5} MIN READ</span>
        <span>•</span>
        <span>AI analyzed 5 sources</span>
      </div>
    </Link>
  );
}
