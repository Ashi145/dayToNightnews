"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { GOOGLE_USER_STORAGE_KEY, type AccountProfile } from '@/lib/account';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;
const SUBSCRIPTION_KEY = 'daytonight-subscription';

type SubStatus = 'idle' | 'loading' | 'success' | 'error';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function SubscribePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [status, setStatus] = useState<SubStatus>('idle');
  const [error, setError] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
    if (saved) {
      try { setProfile(JSON.parse(saved) as AccountProfile); } catch {}
    }

    const sub = window.localStorage.getItem(SUBSCRIPTION_KEY);
    if (sub) {
      try {
        const parsed = JSON.parse(sub);
        if (parsed.status === 'active') setHasSubscription(true);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!profile || hasSubscription || paypalLoaded) return;
    if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'your-paypal-client-id-here') {
      setError('PayPal is not configured yet. Add your Client ID to .env');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => setError('Failed to load PayPal. Check your connection.');
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, [profile, hasSubscription, paypalLoaded]);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalRef.current || hasSubscription) return;

    paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'subscribe' },
      createSubscription: (_data: any, actions: any) => {
        if (!PAYPAL_PLAN_ID || PAYPAL_PLAN_ID === 'your-paypal-plan-id-here') {
          setError('PayPal Plan ID not configured. Add it to .env');
          return Promise.reject(new Error('Plan ID not configured'));
        }
        return actions.subscription.create({ plan_id: PAYPAL_PLAN_ID });
      },
      onApprove: async (data: any, _actions: any) => {
        const subscription = {
          status: 'active',
          plan: 'Monthly Briefing',
          amount: 7,
          email: profile?.email || '',
          subscriptionId: data.subscriptionID,
          startedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
        setHasSubscription(true);
        setStatus('success');
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        setStatus('error');
        setError('Payment failed. Please try again.');
      },
      onCancel: () => {
        setStatus('idle');
      },
    }).render(paypalRef.current);
  }, [paypalLoaded, profile, hasSubscription]);

  if (hasSubscription) {
    return (
      <main className="min-h-screen bg-[#fefcf8]">
        <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">DayToNight News membership</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black leading-none">You&apos;re already a member.</h1>
          <p className="mt-6 max-w-2xl text-lg font-serif leading-relaxed opacity-75">Your Monthly Briefing subscription is active.</p>
          <Link href="/profile" className="mt-8 inline-block bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-colors">
            View your profile
          </Link>
        </section>
      </main>
    );
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
            <li>✓ Cancel anytime through PayPal</li>
            <li>✓ Secure payment powered by PayPal</li>
          </ul>

          {!profile && (
            <p className="mb-4 text-sm text-[#c41e1a] font-bold">Sign in with Google using the button in the header first.</p>
          )}

          <div ref={paypalRef} className="w-full min-h-[50px]"></div>

          {status === 'success' && (
            <div className="mt-4 text-center">
              <p className="text-green-600 font-bold">Subscription active! Redirecting...</p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-center text-sm text-[#c41e1a]">{error}</p>
          )}
        </div>
        <p className="mt-10 text-sm opacity-60">Already a member? View your details on <Link href="/profile" className="font-bold underline">your profile</Link>.</p>
      </section>
    </main>
  );
}
