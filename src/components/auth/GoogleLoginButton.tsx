"use client";

import { useEffect, useRef, useState } from 'react';
import { GOOGLE_USER_STORAGE_KEY, type AccountProfile } from '@/lib/account';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '1078755435065-eh3fs36hbitib5bssmd83rf5mp13fkto.apps.googleusercontent.com';
type GoogleUser = AccountProfile;

type GoogleAccounts = {
  id: {
    initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
    renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
    disableAutoSelect: () => void;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

function readGoogleProfile(credential: string): GoogleUser | null {
  try {
    const payload = credential.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const profile = JSON.parse(json) as { name?: string; email?: string; picture?: string };
    if (!profile.email) return null;
    return { name: profile.name || profile.email.split('@')[0], email: profile.email, picture: profile.picture };
  } catch {
    return null;
  }
}

export default function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
    if (saved) {
      try { setUser(JSON.parse(saved) as GoogleUser); } catch { window.localStorage.removeItem(GOOGLE_USER_STORAGE_KEY); }
    }

    const setupGoogle = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => {
          const profile = readGoogleProfile(credential);
          if (!profile) return;
          window.localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(profile));
          setUser(profile);
        },
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard', theme: 'outline', size: 'medium', text: 'signin_with', shape: 'rectangular',
      });
      setReady(true);
    };

    if (window.google) {
      setupGoogle();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = setupGoogle;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  function signOut() {
    window.localStorage.removeItem(GOOGLE_USER_STORAGE_KEY);
    window.google?.accounts.id.disableAutoSelect();
    setUser(null);
  }

  return (
    <>
      {user && (
      <button onClick={signOut} title={`Signed in as ${user.email}. Click to sign out.`} className="flex items-center gap-1.5 border border-white/30 px-2 py-1 rounded-sm hover:bg-white hover:text-black transition-colors">
        {user.picture && <img src={user.picture} alt="" className="h-4 w-4 rounded-full" referrerPolicy="no-referrer" />}
        <span className="max-w-24 truncate font-bold">{user.name}</span>
      </button>
      )}
      <div ref={buttonRef} aria-label="Sign in with Google" className={`${user ? 'hidden' : ''} ${ready ? '' : 'min-h-[28px]'}`} />
    </>
  );
}
