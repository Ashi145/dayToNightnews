import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getPesaJetClient } from '@/lib/pesajet';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, provider, email } = body;

    if (!phoneNumber || !provider || !email) {
      return NextResponse.json(
        { error: 'Phone number, provider, and email are required' },
        { status: 400 }
      );
    }

    if (!['mtn', 'airtel'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider must be either "mtn" or "airtel"' },
        { status: 400 }
      );
    }

    const reference = `DTN-${nanoid(10)}`;
    const pesajet = getPesaJetClient();

    const payment = await pesajet.createPayment({
      amount: 7,
      currency: 'USD',
      phoneNumber,
      provider,
      reference,
      description: 'DayToNight News - Monthly Briefing Subscription',
    });

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await db.insert(subscriptions).values({
      id: nanoid(),
      email,
      phoneNumber,
      provider,
      transactionId: payment.transactionId,
      status: 'pending',
      plan: 'Monthly Briefing',
      amount: 7,
      startedAt: now,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      transactionId: payment.transactionId,
      status: payment.status,
      reference,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment request failed' },
      { status: 500 }
    );
  }
}
