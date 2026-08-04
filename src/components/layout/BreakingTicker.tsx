"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BreakingTicker({ items }: { items: { title: string, slug: string }[] }) {
  if (!items || items.length === 0) return null;
  // Duplicate for seamless loop
  const duplicated = [...items, ...items];
  return (
    <div className="bg-[#c41e1a] text-white h-9 flex items-center overflow-hidden text-sm">
      <div className="bg-black text-white px-4 h-full flex items-center font-black text-xs tracking-widest uppercase shrink-0 z-10">
        <span className="live-badge mr-2 !bg-white !text-[#c41e1a] before:!bg-[#c41e1a]">LIVE</span>
        BREAKING
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex animate-marquee gap-12 items-center whitespace-nowrap py-2">
          {duplicated.map((it, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="w-1 h-1 bg-white/70 rounded-full" />
              <Link href={`/articles/${it.slug}`} className="hover:underline font-medium tracking-wide">
                {it.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
