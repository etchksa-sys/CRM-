import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials automatically from Vite / Vercel environment variables, runtime injection, or localStorage
export const getSupabaseConfig = () => {
  const meta = import.meta as any;
  const env = meta.env || {};
  const win = typeof window !== 'undefined' ? (window as any) : {};
  const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') : null;
  const lsKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;
  
  const url = lsUrl || win.__SUPABASE_URL__ || (env.VITE_SUPABASE_URL as string) || (env.SUPABASE_URL as string) || '';
  const anonKey = lsKey || win.__SUPABASE_ANON_KEY__ || (env.VITE_SUPABASE_ANON_KEY as string) || (env.SUPABASE_ANON_KEY as string) || '';
  return { url, anonKey };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('supabase_url', url.trim());
    if (anonKey) localStorage.setItem('supabase_anon_key', anonKey.trim());
  }
  cachedClient = null;
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
