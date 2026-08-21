"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, SUBSCRIPTION_STORAGE_KEY, type AccountProfile, type SubscriptionRecord } from '@/lib/account';

const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: 'United States' },
  { code: '+1', country: 'CA', label: 'Canada' },
  { code: '+44', country: 'GB', label: 'United Kingdom' },
  { code: '+61', country: 'AU', label: 'Australia' },
  { code: '+81', country: 'JP', label: 'Japan' },
  { code: '+49', country: 'DE', label: 'Germany' },
  { code: '+33', country: 'FR', label: 'France' },
  { code: '+39', country: 'IT', label: 'Italy' },
  { code: '+34', country: 'ES', label: 'Spain' },
  { code: '+55', country: 'BR', label: 'Brazil' },
  { code: '+52', country: 'MX', label: 'Mexico' },
  { code: '+91', country: 'IN', label: 'India' },
  { code: '+86', country: 'CN', label: 'China' },
  { code: '+82', country: 'KR', label: 'South Korea' },
  { code: '+31', country: 'NL', label: 'Netherlands' },
  { code: '+46', country: 'SE', label: 'Sweden' },
  { code: '+47', country: 'NO', label: 'Norway' },
  { code: '+45', country: 'DK', label: 'Denmark' },
  { code: '+358', country: 'FI', label: 'Finland' },
  { code: '+41', country: 'CH', label: 'Switzerland' },
  { code: '+43', country: 'AT', label: 'Austria' },
  { code: '+32', country: 'BE', label: 'Belgium' },
  { code: '+351', country: 'PT', label: 'Portugal' },
  { code: '+48', country: 'PL', label: 'Poland' },
  { code: '+420', country: 'CZ', label: 'Czech Republic' },
  { code: '+36', country: 'HU', label: 'Hungary' },
  { code: '+40', country: 'RO', label: 'Romania' },
  { code: '+359', country: 'BG', label: 'Bulgaria' },
  { code: '+385', country: 'HR', label: 'Croatia' },
  { code: '+386', country: 'SI', label: 'Slovenia' },
  { code: '+421', country: 'SK', label: 'Slovakia' },
  { code: '+370', country: 'LT', label: 'Lithuania' },
  { code: '+371', country: 'LV', label: 'Latvia' },
  { code: '+372', country: 'EE', label: 'Estonia' },
  { code: '+353', country: 'IE', label: 'Ireland' },
  { code: '+64', country: 'NZ', label: 'New Zealand' },
  { code: '+65', country: 'SG', label: 'Singapore' },
  { code: '+852', country: 'HK', label: 'Hong Kong' },
  { code: '+886', country: 'TW', label: 'Taiwan' },
  { code: '+66', country: 'TH', label: 'Thailand' },
  { code: '+60', country: 'MY', label: 'Malaysia' },
  { code: '+63', country: 'PH', label: 'Philippines' },
  { code: '+62', country: 'ID', label: 'Indonesia' },
  { code: '+84', country: 'VN', label: 'Vietnam' },
  { code: '+27', country: 'ZA', label: 'South Africa' },
  { code: '+20', country: 'EG', label: 'Egypt' },
  { code: '+234', country: 'NG', label: 'Nigeria' },
  { code: '+254', country: 'KE', label: 'Kenya' },
  { code: '+972', country: 'IL', label: 'Israel' },
  { code: '+971', country: 'AE', label: 'United Arab Emirates' },
  { code: '+966', country: 'SA', label: 'Saudi Arabia' },
  { code: '+974', country: 'QA', label: 'Qatar' },
  { code: '+965', country: 'KW', label: 'Kuwait' },
  { code: '+968', country: 'OM', label: 'Oman' },
  { code: '+973', country: 'BH', label: 'Bahrain' },
  { code: '+54', country: 'AR', label: 'Argentina' },
  { code: '+56', country: 'CL', label: 'Chile' },
  { code: '+57', country: 'CO', label: 'Colombia' },
  { code: '+51', country: 'PE', label: 'Peru' },
  { code: '+593', country: 'EC', label: 'Ecuador' },
  { code: '+598', country: 'UY', label: 'Uruguay' },
  { code: '+595', country: 'PY', label: 'Paraguay' },
  { code: '+689', country: 'PF', label: 'French Polynesia' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    countryCode: '+1',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
      const savedSubscription = window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as AccountProfile;
        setProfile(parsed);
        setForm({
          phone: parsed.phone || '',
          countryCode: parsed.countryCode || '+1',
          address: parsed.address || '',
          city: parsed.city || '',
          state: parsed.state || '',
          postalCode: parsed.postalCode || '',
          country: parsed.country || '',
        });
      }
      if (savedSubscription) setSubscription(JSON.parse(savedSubscription) as SubscriptionRecord);
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

  return (
    <main className="min-h-screen bg-[#fefcf8]">
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#c41e1a]">Account</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black">Your profile</h1>

        {/* Profile card — email hidden for safety */}
        <div className="mt-8 border border-black/15 bg-white p-6">
          <div className="flex items-center gap-4">
            {profile.picture && <img src={profile.picture} alt="" className="h-14 w-14 rounded-full" referrerPolicy="no-referrer" />}
            <div>
              <h2 className="text-xl font-black">{profile.name}</h2>
              <p className="text-xs opacity-40 mt-0.5">Signed in with Google</p>
            </div>
          </div>
        </div>

        {/* Contact & Shipping Information */}
        <div className="mt-6 border border-black/15 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-50">Contact & Shipping</p>
              <h2 className="mt-1 text-xl font-black">Delivery details</h2>
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
                  {profile.phone ? `${profile.countryCode || '+1'} ${profile.phone}` : '—'}
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
              {/* Phone with country code */}
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

              {/* Address */}
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

              {/* City + State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="New York"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">State / Region</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="NY"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Postal code + Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Postal code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    placeholder="10001"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    placeholder="United States"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} className="bg-[#c41e1a] text-white px-5 py-2 text-xs font-black uppercase tracking-widest">
                  Save
                </button>
                <button onClick={() => { setEditing(false); setForm({ phone: profile.phone || '', countryCode: profile.countryCode || '+1', address: profile.address || '', city: profile.city || '', state: profile.state || '', postalCode: profile.postalCode || '', country: profile.country || '' }); }} className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-75">
                  Cancel
                </button>
                {saved && <span className="text-xs text-green-600 font-bold">Saved</span>}
              </div>
            </div>
          )}
        </div>

        {/* Membership */}
        <div className="mt-6 border border-black/15 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase opacity-50">Membership</p>
              <h2 className="mt-1 text-xl font-black">{subscription?.status === 'active' ? 'Active — Monthly Briefing' : subscription ? 'Checkout awaiting completion' : 'No active membership'}</h2>
            </div>
            <span className="border border-black px-3 py-1 text-xs font-bold">{subscription?.status === 'active' ? '$2 / month' : 'Free'}</span>
          </div>
          {subscription && <p className="mt-4 text-sm opacity-65">Briefing email: {subscription.email}</p>}
          {!subscription && (
            <Link href="/subscribe" className="mt-5 inline-block bg-[#c41e1a] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Start subscription</Link>
          )}
        </div>

        <p className="mt-8 text-xs leading-relaxed opacity-55">Billing status is confirmed after Stripe sends a secure payment notification to the site&apos;s subscription service.</p>
      </section>
    </main>
  );
}
