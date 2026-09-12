import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const now = new Date();

    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.email, email),
          eq(subscriptions.status, 'active'),
          gt(subscriptions.expiresAt, now)
        )
      )
      .orderBy(subscriptions.createdAt)
      .limit(1);

    if (userSubscriptions.length === 0) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
      });
    }

    const sub = userSubscriptions[0];
    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: {
        id: sub.id,
        plan: sub.plan,
        amount: sub.amount,
        status: sub.status,
        provider: sub.provider,
        phoneNumber: sub.phoneNumber,
        startedAt: sub.startedAt?.getTime() ?? null,
        expiresAt: sub.expiresAt?.getTime() ?? null,
      },
    });
  } catch (error) {
    console.error('Subscription lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
