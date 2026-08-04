import fs from 'node:fs';
import path from 'node:path';
import { fetchLiveNews, type LiveArticle } from '@/lib/liveNews';

const SNAPSHOT_PATH = path.join(process.cwd(), '.next', 'live-snapshot.json');

function revive(rows: any[]): LiveArticle[] {
  return rows.map(r => ({ ...r, publishedAt: new Date(r.publishedAt) }));
}

export async function getLiveArticles(): Promise<LiveArticle[]> {
  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
      if (Array.isArray(parsed) && parsed.length > 0) return revive(parsed);
    }
  } catch {
    // ignore
  }

  const fetched = await fetchLiveNews();
  try {
    fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
    fs.writeFileSync(
      SNAPSHOT_PATH,
      JSON.stringify(fetched.map(a => ({ ...a, publishedAt: a.publishedAt.toISOString() })))
    );
  } catch {
    // ignore
  }
  return fetched;
}

export function getSnapshotPath() {
  return SNAPSHOT_PATH;
}
