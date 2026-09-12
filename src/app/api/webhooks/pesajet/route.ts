import { NextResponse } from 'next/server';
import { getPesaJetClient } from '@/lib/pesajet';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    const pesajet = getPesaJetClient();
    const event = pesajet.constructWebhookEvent(body, signature);

    console.log('PesaJet webhook received:', event.event, event.transactionId);

    if (event.event === 'payment.completed') {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await db
        .update(subscriptions)
        .set({
          status: 'active',
          expiresAt,
          updatedAt: now,
        })
        .where(eq(subscriptions.transactionId, event.transactionId));

      console.log('Subscription activated for transaction:', event.transactionId);
    } else if (event.event === 'payment.failed') {
      await db
        .update(subscriptions)
        .set({
          status: 'expired',
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.transactionId, event.transactionId));

      console.log('Payment failed for transaction:', event.transactionId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
