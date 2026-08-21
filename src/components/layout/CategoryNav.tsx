"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATS = [
  { label: 'World', slug: 'world' },
  { label: 'U.S.', slug: 'politics' },
  { label: 'Business', slug: 'business' },
  { label: 'Finance', slug: 'finance' },
  { label: 'Technology', slug: 'technology' },
  { label: 'AI', slug: 'ai' },
  { label: 'Science', slug: 'science' },
  { label: 'Health', slug: 'health' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Culture', slug: 'entertainment' },
  { label: 'Crypto', slug: 'crypto' },
  { label: 'Gaming', slug: 'gaming' },
];

export default function CategoryNav() {
  const pathname = usePathname();
  return (
    <div className="border-y border-black/10 bg-white sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      {/* Double border top like newspaper */}
      <div className="h-[3px] bg-black w-full" />
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-6 md:gap-7 overflow-x-auto scrollbar-hide py-3 text-[12.5px] font-bold uppercase tracking-widest">
          <Link href="/" className={`whitespace-nowrap hover:text-[#c41e1a] transition-colors ${pathname==='/'?'text-[#c41e1a] border-b-2 border-[#c41e1a] pb-0.5':''}`}>Home</Link>
          {CATS.map(c => {
            const isActive = pathname?.includes(`/category/${c.slug}`);
            return (
              <Link key={c.slug} href={`/category/${c.slug}`} className={`whitespace-nowrap hover:text-[#c41e1a] transition-colors ${isActive?'text-[#c41e1a] border-b-2 border-[#c41e1a] pb-0.5':''}`}>
                {c.label}
              </Link>
            );
          })}
          <span className="w-px h-4 bg-black/10 mx-1" />
          <Link href="/blog" className={`whitespace-nowrap hover:text-[#c41e1a] transition-colors ${pathname==='/blog'?'text-[#c41e1a] border-b-2 border-[#c41e1a] pb-0.5':''}`}>Blog</Link>
          <Link href="/admin" className="whitespace-nowrap text-[#c41e1a]">Live</Link>
          <Link href="#" className="whitespace-nowrap opacity-60">Video</Link>
          <Link href="#" className="whitespace-nowrap opacity-60">Podcasts</Link>
        </nav>
      </div>
      <div className="h-[1px] bg-black w-full" />
    </div>
  );
}
