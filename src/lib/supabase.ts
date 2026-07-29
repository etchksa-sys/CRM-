import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or localStorage settings
const getSupabaseConfig = () => {
  const env = (import.meta as any).env || {};
  const url = env.VITE_SUPABASE_URL || localStorage.getItem('crm_supabase_url') || '';
  const anonKey = env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('crm_supabase_key') || '';
  return { url, anonKey };
};

const { url, anonKey } = getSupabaseConfig();

export const supabase = (url && anonKey) ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('crm_supabase_url', url);
  localStorage.setItem('crm_supabase_key', key);
  window.location.reload();
};
