import Link from 'next/link';

export default function SectionHeader({ title, subtitle, href }: { title: string, subtitle?: string, href?: string }) {
  return (
    <div className="flex items-end justify-between border-b-[2.5px] border-black pb-2 mb-5 mt-2">
      <h2 className="text-[22px] font-black tracking-tight uppercase">{title}</h2>
      {subtitle && <span className="text-xs font-serif italic opacity-60 hidden md:block">{subtitle}</span>}
      {href && <Link href={href} className="text-[11px] font-bold uppercase tracking-widest text-[#c41e1a] hover:underline">View All →</Link>}
    </div>
  );
}
