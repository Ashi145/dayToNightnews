import crypto from 'node:crypto';

const PESAJET_API_URL = 'https://pay.pesajet.com/api';

export type PesaJetPaymentParams = {
  amount: number;
  currency?: string;
  phoneNumber: string;
  provider: 'mtn' | 'airtel';
  reference: string;
  description?: string;
};

export type PesaJetPaymentResponse = {
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
};

export type PesaJetWebhookEvent = {
  event: 'payment.completed' | 'payment.failed' | 'payment.pending';
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  phoneNumber: string;
  provider: string;
  timestamp: string;
};

export class PesaJetClient {
  private apiKey: string;
  private webhookSecret: string;

  constructor({ apiKey, webhookSecret }: { apiKey: string; webhookSecret: string }) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  async createPayment(params: PesaJetPaymentParams): Promise<PesaJetPaymentResponse> {
    const response = await fetch(`${PESAJET_API_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || 'USD',
        phoneNumber: params.phoneNumber,
        provider: params.provider,
        reference: params.reference,
        description: params.description || 'DayToNight News Subscription',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment request failed' }));
      throw new Error(error.message || `PesaJet API error: ${response.status}`);
    }

    return response.json();
  }

  verifyWebhookSignature(body: string | object, signature: string): boolean {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  constructWebhookEvent(body: string, signature: string): PesaJetWebhookEvent {
    if (!this.verifyWebhookSignature(body, signature)) {
      throw new Error('Invalid webhook signature');
    }
    return JSON.parse(body) as PesaJetWebhookEvent;
  }
}

let clientInstance: PesaJetClient | null = null;

export function getPesaJetClient(): PesaJetClient {
  if (!clientInstance) {
    const apiKey = process.env.PESAJET_API_KEY;
    const webhookSecret = process.env.PESAJET_WEBHOOK_SECRET;
    if (!apiKey || !webhookSecret) {
      throw new Error('PESAJET_API_KEY and PESAJET_WEBHOOK_SECRET must be set');
    }
    clientInstance = new PesaJetClient({ apiKey, webhookSecret });
  }
  return clientInstance;
}
