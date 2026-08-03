import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials automatically from Vite / Vercel environment variables
export const getSupabaseConfig = () => {
  const meta = import.meta as any;
  const env = meta.env || {};
  const url = (env.VITE_SUPABASE_URL as string) || '';
  const anonKey = (env.VITE_SUPABASE_ANON_KEY as string) || '';
  return { url, anonKey };
};

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    cachedClient = null;
    return null;
  }
  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }
  try {
    cachedClient = createClient(url, anonKey);
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const supabase = getSupabaseClient();

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
};
