import { fetchLiveNews } from '@/lib/liveNews';
import { runIngestion, countArchivedArticles } from '@/lib/ingest';

async function main() {
  console.log('[ingest] fetching live news…');
  const live = await fetchLiveNews(true);
  console.log(`[ingest] fetched ${live.length} live items`);
  const written = await runIngestion(live);
  const total = await countArchivedArticles();
  console.log(`[ingest] written ${written.length}, archived total ${total}`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error('[ingest] failed:', e);
    process.exit(1);
  }
);
