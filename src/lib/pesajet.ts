import crypto from 'node:crypto';

const PESAJET_BASE_URL = 'https://payments.pesajet.com/api/v1';

export type PesaJetPaymentParams = {
  amount: number;
  currency?: string;
  phoneNumber: string;
  provider: 'mtn' | 'airtel';
  reference: string;
  description?: string;
  type?: 'COLLECTION' | 'DISBURSEMENT';
};

export type PesaJetPaymentResponse = {
  transactionId: string;
  id?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  amount: number;
  currency: string;
  reference: string;
  phoneNumber: string;
  provider: string;
  message?: string;
};

export type PesaJetWebhookEvent = {
  event: string;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  phoneNumber: string;
  provider: string;
  timestamp: string;
  signature?: string;
};

export class PesaJetClient {
  private apiKey: string;
  private webhookSecret: string;

  constructor({ apiKey, webhookSecret }: { apiKey: string; webhookSecret: string }) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  async createPayment(params: PesaJetPaymentParams): Promise<PesaJetPaymentResponse> {
    const payload = {
      type: params.type || 'COLLECTION',
      amount: params.amount,
      currency: params.currency || 'USD',
      phoneNumber: params.phoneNumber,
      provider: params.provider,
      reference: params.reference,
      description: params.description || 'DayToNight News Subscription',
    };

    const response = await fetch(`${PESAJET_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      const errorMsg = (data.message as string) || (data.error as string) || `PesaJet API error: ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as unknown as PesaJetPaymentResponse;
  }

  async getPayment(transactionId: string): Promise<PesaJetPaymentResponse> {
    const response = await fetch(`${PESAJET_BASE_URL}/payments/${transactionId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.status}`);
    }

    return response.json();
  }

  verifyWebhookSignature(rawBody: string, receivedSignature: string): boolean {
    let payloadString = rawBody;
    let signatureToMatch = receivedSignature;

    try {
      const parsed = JSON.parse(rawBody);
      if (parsed.signature && !receivedSignature) {
        signatureToMatch = parsed.signature;
      }
      const { signature: _omitted, ...cleanPayload } = parsed;
      payloadString = JSON.stringify(cleanPayload);
    } catch {
      // Use raw body as-is
    }

    if (!signatureToMatch) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payloadString)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(signatureToMatch, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
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
