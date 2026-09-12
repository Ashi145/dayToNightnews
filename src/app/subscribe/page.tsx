"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, type AccountProfile } from '@/lib/account';

type PaymentStatus = 'idle' | 'loading' | 'pending' | 'success' | 'error';

export default function SubscribePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
    if (saved) {
      try { setProfile(JSON.parse(saved) as AccountProfile); } catch { /* Login remains available in the header. */ }
    }
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();

    if (!profile) {
      setError('Sign in with Google first so we know where to send your news briefing.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your mobile money phone number.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          provider,
          email: profile.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment request failed');
      }

      setTransactionId(data.transactionId);
      setStatus('pending');

      pollSubscriptionStatus(profile.email);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  async function pollSubscriptionStatus(email: string) {
    const maxAttempts = 30;
    const interval = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));

      try {
        const response = await fetch(`/api/subscriptions?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.hasActiveSubscription && data.subscription?.status === 'active') {
          setStatus('success');
          return;
        }
      } catch {
        // Continue polling
      }
    }

    setStatus('pending');
  }

  return (
    <main className="min-h-screen bg-[#fefcf8]">
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">DayToNight News membership</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-black leading-none">News that meets you in your inbox.</h1>
        <p className="mt-6 max-w-2xl text-lg font-serif leading-relaxed opacity-75">Get the verified DayToNight briefing by email, with the day&apos;s essential stories and context.</p>

        <div className="mt-10 border-[3px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_#c41e1a]">
          <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <h2 className="text-2xl font-black">Monthly Briefing</h2>
              <p className="mt-1 text-sm opacity-60">Daily curated news sent to your email.</p>
            </div>
            <p className="text-3xl font-black">$7<span className="text-sm font-bold">/month</span></p>
          </div>
          <ul className="my-6 space-y-3 text-sm">
            <li>✓ The top verified stories, delivered by email</li>
            <li>✓ Cancel anytime through the secure billing portal</li>
            <li>✓ Pay with MTN Mobile Money or Airtel Money</li>
          </ul>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-black">Payment Received!</h3>
              <p className="mt-2 text-sm opacity-70">Your subscription is now active. Check your email for confirmation.</p>
              <Link href="/profile" className="mt-4 inline-block bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-colors">
                View your profile
              </Link>
            </div>
          ) : status === 'pending' ? (
            <div className="text-center py-6">
              <div className="animate-pulse text-5xl mb-4">⏳</div>
              <h3 className="text-xl font-black">Waiting for Payment Confirmation</h3>
              <p className="mt-2 text-sm opacity-70">Please complete the payment on your phone. This page will update automatically.</p>
              <p className="mt-2 text-xs opacity-50">Transaction ID: {transactionId}</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              {!profile && (
                <p className="text-sm text-[#c41e1a] font-bold">Sign in with Google using the button in the header first.</p>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">
                  Mobile Money Provider
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProvider('mtn')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest border-2 transition-colors ${
                      provider === 'mtn'
                        ? 'border-[#c41e1a] bg-[#c41e1a] text-white'
                        : 'border-black/15 bg-white text-black hover:border-black/30'
                    }`}
                  >
                    MTN Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('airtel')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest border-2 transition-colors ${
                      provider === 'airtel'
                        ? 'border-[#c41e1a] bg-[#c41e1a] text-white'
                        : 'border-black/15 bg-white text-black hover:border-black/30'
                    }`}
                  >
                    Airtel Money
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+256 7XX XXX XXX"
                  className="w-full border-2 border-black/15 bg-white px-4 py-3 text-sm font-mono focus:border-[#c41e1a] focus:outline-none transition-colors"
                  required
                />
                <p className="mt-1 text-xs opacity-50">Enter the phone number linked to your mobile money account</p>
              </div>

              <button
                type="submit"
                disabled={!profile || status === 'loading'}
                className="w-full bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Processing...' : 'Pay $7/month with Mobile Money'}
              </button>

              {error && (
                <p role="status" className="text-center text-sm text-[#c41e1a]">{error}</p>
              )}
            </form>
          )}
        </div>
        <p className="mt-10 text-sm opacity-60">Already a member? View your details on <Link href="/profile" className="font-bold underline">your profile</Link>.</p>
      </section>
    </main>
  );
}
