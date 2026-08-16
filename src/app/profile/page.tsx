"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, SUBSCRIPTION_STORAGE_KEY, type AccountProfile, type SubscriptionRecord } from '@/lib/account';

export default function ProfilePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
      const savedSubscription = window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (savedProfile) setProfile(JSON.parse(savedProfile) as AccountProfile);
      if (savedSubscription) setSubscription(JSON.parse(savedSubscription) as SubscriptionRecord);
    } catch { /* An invalid local record is treated as signed out. */ }
  }, []);

  if (!profile) {
    return <main className="container mx-auto min-h-screen max-w-3xl px-4 py-20"><h1 className="text-4xl font-black">Your profile</h1><p className="mt-4 text-lg font-serif opacity-70">Sign in with Google using the button in the header to view your account details.</p><Link href="/subscribe" className="mt-8 inline-block bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white">View membership</Link></main>;
  }

  return (
    <main className="min-h-screen bg-[#fefcf8]"><section className="container mx-auto max-w-3xl px-4 py-16 md:py-20">
      <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">Account</p><h1 className="mt-2 text-4xl md:text-5xl font-black">Your profile</h1>
      <div className="mt-8 border border-black/15 bg-white p-6">
        <div className="flex items-center gap-4">{profile.picture && <img src={profile.picture} alt="" className="h-14 w-14 rounded-full" referrerPolicy="no-referrer" />}<div><h2 className="text-xl font-black">{profile.name}</h2><p className="text-sm opacity-65">{profile.email}</p></div></div>
      </div>
      <div className="mt-6 border border-black/15 bg-white p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold tracking-widest uppercase opacity-50">Membership</p><h2 className="mt-1 text-xl font-black">{subscription?.status === 'active' ? 'Active — Monthly Briefing' : subscription ? 'Checkout awaiting completion' : 'No active membership'}</h2></div><span className="border border-black px-3 py-1 text-xs font-bold">{subscription?.status === 'active' ? '$2 / month' : 'Free'}</span></div>
        {subscription ? <p className="mt-4 text-sm opacity-65">Briefing email: {subscription.email}</p> : <Link href="/subscribe" className="mt-5 inline-block bg-[#c41e1a] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Start subscription</Link>}
      </div>
      <p className="mt-8 text-xs leading-relaxed opacity-55">Billing status is confirmed after Stripe sends a secure payment notification to the site’s subscription service.</p>
    </section></main>
  );
}
