export const GOOGLE_USER_STORAGE_KEY = 'daytonight-google-user';
export const SUBSCRIPTION_STORAGE_KEY = 'daytonight-subscription';

export type AccountProfile = {
  name: string;
  email: string;
  picture?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type SubscriptionRecord = {
  status: 'pending_checkout' | 'active';
  plan: 'Monthly Briefing';
  amount: 2;
  email: string;
  startedAt: string;
};
