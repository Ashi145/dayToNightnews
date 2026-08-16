"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, SUBSCRIPTION_STORAGE_KEY, type AccountProfile, type SubscriptionRecord } from '@/lib/account';

const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export default function SubscribePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
    if (saved) {
      try { setProfile(JSON.parse(saved) as AccountProfile); } catch { /* Login remains available in the header. */ }
    }
  }, []);

  function startCheckout() {
    if (!profile) {
      setNotice('Sign in with Google first so we know where to send your news briefing.');
      return;
    }
    if (!paymentLink) {
      setNotice('Checkout is being configured. Please try again shortly.');
      return;
    }
    const subscription: SubscriptionRecord = {
      status: 'pending_checkout', plan: 'Monthly Briefing', amount: 2, email: profile.email, startedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
    window.location.assign(paymentLink);
  }

  return (
    <main className="min-h-screen bg-[#fefcf8]">
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">DayToNight News membership</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-black leading-none">News that meets you in your inbox.</h1>
        <p className="mt-6 max-w-2xl text-lg font-serif leading-relaxed opacity-75">Get the verified DayToNight briefing by email, with the day’s essential stories and context.</p>

        <div className="mt-10 border-[3px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_#c41e1a]">
          <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <h2 className="text-2xl font-black">Monthly Briefing</h2>
              <p className="mt-1 text-sm opacity-60">Daily curated news sent to your email.</p>
            </div>
            <p className="text-3xl font-black">$2<span className="text-sm font-bold">/month</span></p>
          </div>
          <ul className="my-6 space-y-3 text-sm">
            <li>✓ The top verified stories, delivered by email</li>
            <li>✓ Cancel anytime through the secure billing portal</li>
            <li>✓ Your card information is handled only by Stripe</li>
          </ul>
          <button onClick={startCheckout} className="w-full bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-colors">Continue to secure checkout</button>
          {notice && <p role="status" className="mt-3 text-center text-sm text-[#c41e1a]">{notice}</p>}
        </div>
        <p className="mt-10 text-sm opacity-60">Already a member? View your details on <Link href="/profile" className="font-bold underline">your profile</Link>.</p>
      </section>
    </main>
  );
}
