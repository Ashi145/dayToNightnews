import { db } from '@/db';
import { aiJobs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const jobs = await db.query.aiJobs.findMany({
      orderBy: [desc(aiJobs.completedAt)],
      limit: 20,
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
