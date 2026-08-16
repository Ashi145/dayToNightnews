"use client";

import { FormEvent, useEffect, useState } from 'react';

const SUBSCRIBER_EMAIL = process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL || 'newsletter@ashiraf.cc';
const SUBSCRIPTION_STORAGE_KEY = 'daytonight-newsletter-email';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = window.localStorage.getItem('daytonight-google-user');
    if (savedUser) {
      try { setEmail((JSON.parse(savedUser) as { email?: string }).email || ''); } catch { /* leave empty */ }
    }
  }, []);

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setMessage('Enter a valid email address.');
      return;
    }
    window.localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, normalizedEmail);
    setMessage('Your email app will open to confirm your subscription.');
    const subject = encodeURIComponent('DayToNight News briefing subscription');
    const body = encodeURIComponent(`Please subscribe ${normalizedEmail} to the DayToNight News briefing.`);
    window.location.href = `mailto:${SUBSCRIBER_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={subscribe}>
      <div className="flex gap-2">
        <input type="email" value={email} onChange={event => setEmail(event.target.value)} required placeholder="your@email.com" aria-label="Email address" className="bg-white/10 border border-white/10 px-3 py-2 text-sm w-full rounded-sm placeholder:opacity-50" />
        <button type="submit" className="bg-[#c41e1a] text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm">Join</button>
      </div>
      {message && <p role="status" className="text-[10px] text-white/70 mt-2">{message}</p>}
    </form>
  );
}
