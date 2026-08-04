import Link from 'next/link';

export default function TrendingRail({ articles, title = "Most Read" }: { articles: any[], title?: string }) {
  return (
    <div className="bg-[#fffefb] border border-black/10 p-5">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
        <h3 className="font-black uppercase tracking-widest text-[13px]">{title}</h3>
        <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">LIVE</span>
      </div>
      <ol className="space-y-0">
        {articles.map((a, i) => (
          <li key={i} className="flex gap-3 py-3 border-b border-black/[0.06] last:border-0 group">
            <span className="font-black text-3xl leading-none opacity-10 group-hover:opacity-20 tabular-nums">{String(i+1).padStart(2,'0')}</span>
            <div className="flex-1">
              <Link href={`/articles/${a.slug}`} className="font-bold text-[14px] leading-tight group-hover:text-[#c41e1a] transition-colors line-clamp-2">
                {a.title}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wide opacity-50 font-bold">
                <span className="text-[#c41e1a]">{a.category}</span>
                <span>•</span>
                <span>{a.source || 'AI'}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 p-3 bg-[#f6f1e8] border border-black/5 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest">Get the DayToNight Briefing</p>
        <p className="text-[12px] font-serif opacity-70 mt-1">Top 5 stories at 7AM ET, verified by AI.</p>
        <button className="mt-3 bg-black text-white w-full py-2 text-[11px] font-black uppercase tracking-widest">Subscribe $1/week</button>
      </div>
    </div>
  );
}
