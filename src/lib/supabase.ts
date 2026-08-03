import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ufgjpnsxkyrgfzdspyei.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2pwbnN4a3lyZ2Z6ZHNweWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTQwNjAsImV4cCI6MjEwMDczMDA2MH0.JzKyM0sS95t6nFe3qaU03NQa_NAewFcrfwzxkon_41w';

// Get Supabase credentials automatically from Vite / Vercel environment variables, runtime injection, localStorage or default fallback
export const getSupabaseConfig = () => {
  const meta = import.meta as any;
  const env = meta.env || {};
  const win = typeof window !== 'undefined' ? (window as any) : {};
  const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') : null;
  const lsKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;
  
  const url = lsUrl || win.__SUPABASE_URL__ || (env.VITE_SUPABASE_URL as string) || (env.SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
  const anonKey = lsKey || win.__SUPABASE_ANON_KEY__ || (env.VITE_SUPABASE_ANON_KEY as string) || (env.SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;
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
