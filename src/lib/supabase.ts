import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from literal Vite env or localStorage settings
export const getSupabaseConfig = () => {
  const meta = import.meta as any;
  const env = meta.env || {};
  const url = (env.VITE_SUPABASE_URL as string) || localStorage.getItem('crm_supabase_url') || '';
  const anonKey = (env.VITE_SUPABASE_ANON_KEY as string) || localStorage.getItem('crm_supabase_key') || '';
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

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('crm_supabase_url', url.trim());
  localStorage.setItem('crm_supabase_key', key.trim());
  window.location.reload();
};
