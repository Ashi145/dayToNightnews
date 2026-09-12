"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, type AccountProfile } from '@/lib/account';

const SUBSCRIPTION_KEY = 'daytonight-subscription';

type SubscriptionData = {
  status: string;
  plan: string;
  amount: number;
  email: string;
  subscriptionId?: string;
  startedAt: string;
};

const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: 'United States' },
  { code: '+1', country: 'CA', label: 'Canada' },
  { code: '+44', country: 'GB', label: 'United Kingdom' },
  { code: '+61', country: 'AU', label: 'Australia' },
  { code: '+256', country: 'UG', label: 'Uganda' },
  { code: '+254', country: 'KE', label: 'Kenya' },
  { code: '+234', country: 'NG', label: 'Nigeria' },
  { code: '+27', country: 'ZA', label: 'South Africa' },
  { code: '+91', country: 'IN', label: 'India' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    countryCode: '+256',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as AccountProfile;
        setProfile(parsed);
        setForm({
          phone: parsed.phone || '',
          countryCode: parsed.countryCode || '+256',
          address: parsed.address || '',
          city: parsed.city || '',
          state: parsed.state || '',
          postalCode: parsed.postalCode || '',
          country: parsed.country || '',
        });
      }

      const savedSub = window.localStorage.getItem(SUBSCRIPTION_KEY);
      if (savedSub) {
        const parsed = JSON.parse(savedSub) as SubscriptionData;
        if (parsed.status === 'active') {
          setSubscription(parsed);
        }
      }
    } catch { /* An invalid local record is treated as signed out. */ }
  }, []);

  if (!profile) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-black">Your profile</h1>
        <p className="mt-4 text-lg font-serif opacity-70">Sign in with Google using the button in the header to view your account details.</p>
        <Link href="/subscribe" className="mt-8 inline-block bg-[#c41e1a] px-5 py-3 text-sm font-black uppercase tracking-widest text-white">View membership</Link>
      </main>
    );
  }

  function handleSave() {
    const updated = { ...profile, ...form } as AccountProfile;
    setProfile(updated);
    localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setEditing(false);
    setForm({
      phone: profile?.phone || '',
      countryCode: profile?.countryCode || '+256',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postalCode: profile?.postalCode || '',
      country: profile?.country || '',
    });
  }

  return (
    <main className="min-h-screen bg-[#fefcf8]">
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">Account</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black">Your profile</h1>

        <div className="mt-8 border border-black/15 bg-white p-6">
          <div className="flex items-center gap-4">
            {profile.picture && <img src={profile.picture} alt="" className="h-14 w-14 rounded-full" referrerPolicy="no-referrer" />}
            <div>
              <h2 className="text-xl font-black">{profile.name}</h2>
              <p className="text-xs opacity-40 mt-0.5">Signed in with Google</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-black/15 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-50">Contact</p>
              <h2 className="mt-1 text-xl font-black">Details</h2>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs font-bold uppercase tracking-widest text-[#c41e1a] hover:underline">
                Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="opacity-50 w-20 shrink-0">Phone</span>
                <span className="font-medium">
                  {profile.phone ? `${profile.countryCode || '+256'} ${profile.phone}` : '—'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="opacity-50 w-20 shrink-0">Address</span>
                <span className="font-medium">
                  {profile.address
                    ? <>{profile.address}{profile.city ? `, ${profile.city}` : ''}{profile.state ? `, ${profile.state}` : ''}{profile.postalCode ? ` ${profile.postalCode}` : ''}{profile.country ? ` ${profile.country}` : ''}</>
                    : '—'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Phone number</label>
                <div className="flex gap-2">
                  <select
                    value={form.countryCode}
                    onChange={e => setForm(f => ({ ...f, countryCode: e.target.value }))}
                    className="w-[130px] shrink-0 border border-black/15 bg-white px-3 py-2 text-sm font-mono"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={`${c.code}-${c.country}`} value={c.code}>
                        {c.code} {c.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="555 123 4567"
                    className="flex-1 border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Street address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St"
                  className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Kampala"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">State / Region</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="Region"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Postal code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    placeholder="00256"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    placeholder="Uganda"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} className="bg-[#c41e1a] text-white px-5 py-2 text-xs font-black uppercase tracking-widest">
                  Save
                </button>
                <button onClick={handleCancel} className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-75">
                  Cancel
                </button>
                {saved && <span className="text-xs text-green-600 font-bold">Saved</span>}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 border border-black/15 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-50">Membership</p>
              <h2 className="mt-1 text-xl font-black">
                {subscription ? 'Active — Monthly Briefing' : 'No active membership'}
              </h2>
            </div>
            <span className="border border-black px-3 py-1 text-xs font-bold">
              {subscription ? '$7 / month' : 'Free'}
            </span>
          </div>

          {subscription && (
            <div className="mt-4 space-y-1 text-sm opacity-65">
              <p>Briefing email: {subscription.email}</p>
              {subscription.startedAt && <p>Member since: {new Date(subscription.startedAt).toLocaleDateString()}</p>}
            </div>
          )}

          {!subscription && (
            <Link href="/subscribe" className="mt-5 inline-block bg-[#c41e1a] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Start subscription</Link>
          )}
        </div>

        <p className="mt-8 text-xs leading-relaxed opacity-55">Payment is processed securely via PayPal. Cancel anytime from your PayPal account.</p>
      </section>
    </main>
  );
}
