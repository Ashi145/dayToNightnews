const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  World: [
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=85&w=1600',
    'https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=85&w=1600',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=85&w=1600',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=85&w=1600',
    'https://images.unsplash.com/photo-1531271340494-a712ea6b1028?q=85&w=1600',
    'https://images.unsplash.com/photo-1444664597500-035db93e2323?q=85&w=1600',
  ],
  Politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=85&w=1600',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=85&w=1600',
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?q=85&w=1600',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=85&w=1600',
    'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=85&w=1600',
    'https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=85&w=1600',
  ],
  Business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1600',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=85&w=1600',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1600',
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=85&w=1600',
    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=85&w=1600',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=85&w=1600',
  ],
  Finance: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=85&w=1600',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=85&w=1600',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=85&w=1600',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=85&w=1600',
    'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=85&w=1600',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=85&w=1600',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=85&w=1600',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=85&w=1600',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=85&w=1600',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=85&w=1600',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=85&w=1600',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=85&w=1600',
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=85&w=1600',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=85&w=1600',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=85&w=1600',
    'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=85&w=1600',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=85&w=1600',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=85&w=1600',
  ],
  Science: [
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=85&w=1600',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=85&w=1600',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=85&w=1600',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=85&w=1600',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=85&w=1600',
    'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?q=85&w=1600',
  ],
  Health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=85&w=1600',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=85&w=1600',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=85&w=1600',
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=85&w=1600',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=85&w=1600',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=85&w=1600',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=85&w=1600',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=85&w=1600',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=85&w=1600',
    'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=85&w=1600',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=85&w=1600',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=85&w=1600',
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=85&w=1600',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=85&w=1600',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=85&w=1600',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=1600',
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=85&w=1600',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=85&w=1600',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=85&w=1600',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=85&w=1600',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=85&w=1600',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=85&w=1600',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=85&w=1600',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?q=85&w=1600',
  ],
  Crypto: [
    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=85&w=1600',
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=85&w=1600',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=85&w=1600',
    'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=85&w=1600',
    'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=85&w=1600',
    'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=85&w=1600',
  ],
  General: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=85&w=1600',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=85&w=1600',
    'https://images.unsplash.com/photo-1444427169197-702a3dd9d3b7?q=85&w=1600',
    'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=85&w=1600',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=85&w=1600',
    'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?q=85&w=1600',
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

const JUNK_RE = /1x1|pixel|\.svg|spacer|icon|logo|avatar|placeholder|blank|\/transparent|emoji|favicon|shim|badge|loading|spinner/i;

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
    return url.replace(/-mediumSquareAt3X/, '-videoSixteenByNine1050').replace(/-fourByThreeLargeAt3X/, '-videoSixteenByNine1050').replace(/-square640/, '-videoSixteenByNine1050').replace(/-thumbStandard/, '-videoSixteenByNine1050');
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

function largestSrcset(srcset: string): string | null {
  const candidates: Array<{ url: string; width: number }> = [];
  for (const part of srcset.split(',')) {
    const [url, size] = part.trim().split(/\s+/);
    if (!url || /^data:/i.test(url)) continue;
    const width = size?.endsWith('w') ? parseInt(size, 10) : 0;
    candidates.push({ url: decodeImageUrl(url), width: width || 0 });
  }
  candidates.sort((a, b) => b.width - a.width || b.url.length - a.url.length);
  for (const c of candidates) {
    if (isUsableImageUrl(c.url)) return c.url;
  }
  return null;
}

export function extractImageFromHtml(html: string | undefined | null): string | null {
  if (!html) return null;
  const matches = html.match(/<img[^>]*>/gi) || [];
  for (const tag of matches) {
    const attr = (name: string): string | null => {
      const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
      return m ? m[1] : null;
    };
    const width = parseInt(attr('width') || '', 10);
    const height = parseInt(attr('height') || '', 10);
    if ((width && width < 250) || (height && height < 140)) continue;

    let src = attr('src') || attr('data-src') || attr('data-lazy-src') || attr('data-original') || attr('data-large-src');
    const srcset = attr('srcset') || attr('data-srcset');
    if (srcset) {
      const large = largestSrcset(srcset);
      if (large) src = large;
    }
    if (!src || /^data:/i.test(src)) continue;
    if (!isUsableImageUrl(src)) continue;
    return upgradeImageQuality(src);
  }
  return null;
}

export function imageFromStoredContent(content: string | null | undefined): string | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    const url = parsed && parsed.imageUrl;
    return typeof url === 'string' && isUsableImageUrl(url) ? url : null;
  } catch {
    return null;
  }
}
