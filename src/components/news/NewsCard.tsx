import Link from 'next/link';

export default function NewsCard({ article }: { article: any }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="overflow-hidden bg-white border border-black/5">
        <img src={article.imageUrl} alt={article.title} className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-[#c41e1a]">{article.category}</span>
          <span className="text-[10px] opacity-40">• {new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h3 className="font-bold text-[16px] leading-[1.15] group-hover:text-[#c41e1a] transition-colors line-clamp-3">{article.title}</h3>
        <p className="mt-2 text-[13px] font-serif opacity-60 line-clamp-2">{article.summary}</p>
      </div>
    </Link>
  );
}
