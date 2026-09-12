import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getPesaJetClient } from '@/lib/pesajet';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 100);
}

function validatePhoneNumber(phone: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

    if (typeof phoneNumber !== 'string' || typeof provider !== 'string' || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input types' },
        { status: 400 }
      );
    }

    const cleanPhone = sanitizeInput(phoneNumber);
    const cleanEmail = sanitizeInput(email);

    if (!validatePhoneNumber(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!['mtn', 'airtel'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider must be either "mtn" or "airtel"' },
        { status: 400 }
      );
    }

    const validProvider = provider as 'mtn' | 'airtel';
    const reference = `DTN-${nanoid(10)}`;
    const pesajet = getPesaJetClient();

    const payment = await pesajet.createPayment({
      amount: 7,
      currency: 'USD',
      phoneNumber: cleanPhone,
      provider: validProvider,
      reference,
      description: 'DayToNight News - Monthly Briefing Subscription',
    });

    const txnId = payment.transactionId || payment.id || '';
    if (!txnId) {
      console.error('No transaction ID in PesaJet response:', payment);
      throw new Error('Payment gateway did not return a transaction ID');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await db.insert(subscriptions).values({
      id: nanoid(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      provider: validProvider,
      transactionId: txnId,
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
      transactionId: txnId,
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
