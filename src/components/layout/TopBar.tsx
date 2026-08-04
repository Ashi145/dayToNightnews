"use client";
import { useEffect, useState } from 'react';
import { CloudSun, Search } from 'lucide-react';

export default function TopBar() {
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);
  return (
    <div className="bg-[#111] text-[#f5f2ec] text-[11px] tracking-wide border-b border-black">
      <div className="container mx-auto px-4 h-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="hidden md:flex items-center gap-2 opacity-80">
            <CloudSun className="h-3 w-3" />
            NY 24°C
          </span>
          <span className="font-medium">{dateStr || 'Loading...'}</span>
          <span className="hidden lg:inline opacity-50">| Today's Paper | AI Verified Edition</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors hidden sm:block">Newsletter</a>
          <a href="#" className="hover:text-white transition-colors hidden sm:block">Podcasts</a>
          <span className="bg-[#c41e1a] text-white px-2.5 py-1 rounded-sm font-black tracking-widest uppercase text-[10px]">Subscribe for $1/week</span>
          <a href="/admin" className="border border-white/20 px-2.5 py-1 rounded-sm hover:bg-white hover:text-black transition-colors uppercase font-bold">AI Control</a>
        </div>
      </div>
    </div>
  );
}
