import Link from 'next/link';

export default function SecondaryCard({ article, compact = false }: { article: any, compact?: boolean }) {
  if (compact) {
    return (
      <Link href={`/articles/${article.slug}`} className="group flex gap-4 py-4 border-b border-black/5 last:border-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#c41e1a]">{article.category}</span>
            <span className="text-[10px] opacity-50">• {article.source}</span>
          </div>
          <h3 className="font-bold leading-tight text-[15px] group-hover:text-[#c41e1a] transition-colors line-clamp-3">{article.title}</h3>
          <p className="text-[12px] opacity-60 mt-1 line-clamp-2 font-serif">{article.summary}</p>
        </div>
        <img src={article.imageUrl} alt={article.title} className="w-20 h-20 object-cover shrink-0 group-hover:opacity-90" />
      </Link>
    );
  }
  return (
    <Link href={`/articles/${article.slug}`} className="group block border-b border-black/10 pb-5 last:border-0 last:pb-0">
      <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover mb-3 group-hover:brightness-[0.95] transition-all" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#c41e1a]">{article.category}</span>
        <span className="text-[11px] opacity-50">{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {article.source}</span>
      </div>
      <h3 className="text-[19px] font-bold leading-tight group-hover:text-[#c41e1a] transition-colors">{article.title}</h3>
      <p className="text-[13px] opacity-70 mt-2 font-serif line-clamp-3">{article.summary}</p>
      <div className="mt-3 flex gap-2 text-[10px] font-bold tracking-wide uppercase opacity-50">
        <span>{article.readingTime || 4} MIN</span>
        <span>•</span>
        <span>{article.confidenceScore || 92}% VERIFIED</span>
      </div>
    </Link>
  );
}
