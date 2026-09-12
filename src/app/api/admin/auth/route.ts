import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    if (!secret) {
      return NextResponse.json({ error: 'Secret is required' }, { status: 400 });
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: 'Admin authentication not configured' }, { status: 500 });
    }

    if (secret !== adminSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
