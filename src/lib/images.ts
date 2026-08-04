const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  World: [
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600',
    'https://images.unsplash.com/photo-1489514354504-1653aa90e34e?q=80&w=1600',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600',
    'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1600',
  ],
  Business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600',
  ],
  Finance: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600',
    'https://images.unsplash.com/photo-1565375123421-02011a47a9ad?q=80&w=1600',
  ],
  Crypto: [
    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1600',
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1600',
    'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1600',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1600',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600',
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600',
  ],
  Science: [
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1600',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1600',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600',
  ],
  Health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1600',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1600',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1600',
  ],
  Politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1600',
    'https://images.unsplash.com/photo-1577968897966-aa40e2b80e2a?q=80&w=1600',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600',
    'https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?q=80&w=1600',
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1600',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600',
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600',
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1600',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1600',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600',
  ],
  General: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600',
    'https://images.unsplash.com/photo-1444427169197-702a3dd9d3b7?q=80&w=1600',
    'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1600',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600',
    'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?q=80&w=1600',
  ],
};

const GENERIC_POOL = CATEGORY_IMAGE_POOLS.General;

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function deterministicImage(categoryOrSeed?: string, seed?: string): string {
  const category = seed === undefined ? 'General' : categoryOrSeed;
  const seedKey = seed === undefined ? (categoryOrSeed || '') : seed;
  const pool = CATEGORY_IMAGE_POOLS[category || 'General'] || GENERIC_POOL;
  return pool[hashString(seedKey) % pool.length];
}

const JUNK_RE = /1x1|pixel|\.svg|spacer|icon|logo|avatar|placeholder|blank/i;

export function isUsableImageUrl(url: string): boolean {
  if (!url || url.startsWith('data:')) return false;
  if (JUNK_RE.test(url)) return false;
  return true;
}

export function decodeImageUrl(url: string): string {
  return url.replace(/&#0*38;|&amp;/g, '&');
}

export function upgradeImageQuality(url: string): string {
  if (url.includes('images.unsplash.com')) return url;
  if (url.includes('bbci.co.uk') || url.includes('bbc.com')) {
    return url.replace(/\/ace\/standard\/240\//, '/ace/standard/976/');
  }
  if (url.includes('static01.nyt.com') || url.includes('static02.nyt.com')) {
    return url.replace(/-mediumSquareAt3X/, '-videoSixteenByNine1050').replace(/-square640/, '-videoSixteenByNine1050').replace(/-thumbStandard/, '-videoSixteenByNine1050');
  }
  if (url.includes('i.guim.co.uk')) {
    return url;
  }
  if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(url) && !url.includes('quality=') && (url.includes('techcrunch.com') || url.includes('wp.com') || url.includes('theverge.com') || url.includes('wpengine') || url.includes('kinsta') || url.includes('arstechnica'))) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}quality=85`;
  }
  return url;
}

export function extractImageFromHtml(html: string | undefined | null): string | null {
  if (!html) return null;
  const matches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  for (const tag of matches) {
    const srcMatch = tag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;
    const src = decodeImageUrl(srcMatch[1]);
    if (isUsableImageUrl(src)) return upgradeImageQuality(src);
  }
  return null;
}
