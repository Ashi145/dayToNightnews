"use client";

import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import Masthead from './Masthead';
import CategoryNav from './CategoryNav';
import BreakingTicker from './BreakingTicker';

export default function Navbar() {
  const [breaking, setBreaking] = useState<{title:string, slug:string}[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/live?breaking=1');
        if (!res.ok) {
          const res2 = await fetch('/api/articles');
          if (res2.ok) {
            const data = await res2.json();
            setBreaking(data.slice(0,6).map((a:any)=>({title:a.title, slug:a.slug})));
          }
          return;
        }
        const data = await res.json();
        const items = (data.breaking || data).slice(0,8).map((a:any)=>({title:a.title, slug:a.slug || a.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}));
        setBreaking(items);
      } catch {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <header className="w-full">
      <TopBar />
      <Masthead />
      <CategoryNav />
      <BreakingTicker items={breaking} />
    </header>
  );
}
