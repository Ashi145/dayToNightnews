const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200',
  'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200',
  'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1200',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200',
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function deterministicImage(seed: string): string {
  const base = IMAGE_POOL[hashString(seed) % IMAGE_POOL.length];
  return `${base.split('?')[0]}?q=80&w=1200`;
}

export function extractImageFromHtml(html: string | undefined | null): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  const src = match[1];
  if (src.startsWith('data:')) return null;
  if (/\.(svg|gif)/i.test(src) && !/unsplash|images\./i.test(src)) return null;
  return src;
}
