import { runAIPipeline } from '@/lib/ai/pipeline';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Run pipeline asynchronously to avoid timeout
    runAIPipeline(topic).catch(console.error);

    return NextResponse.json({ message: 'Pipeline triggered successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to trigger pipeline' }, { status: 500 });
  }
}
