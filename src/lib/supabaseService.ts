import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { Contact, Deal, Task, UserAccount, NotificationItem } from '../types';

const toSnakeCase = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  const mapped: any = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    mapped[snakeKey] = obj[key];
  }
  return mapped;
};

const toCamelCase = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  const mapped: any = {};
  for (const key of Object.keys(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    mapped[camelKey] = obj[key];
  }
  return mapped;
};

export const fetchSupabaseData = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const [contactsRes, dealsRes, tasksRes, usersRes, notifsRes] = await Promise.all([
      client.from('contacts').select('*'),
      client.from('deals').select('*'),
      client.from('tasks').select('*'),
      client.from('users').select('*'),
      client.from('notifications').select('*')
    ]);

    return {
      contacts: contactsRes.error || !contactsRes.data ? null : contactsRes.data.map(toCamelCase),
      deals: dealsRes.error || !dealsRes.data ? null : dealsRes.data.map(toCamelCase),
      tasks: tasksRes.error || !tasksRes.data ? null : tasksRes.data.map(toCamelCase),
      users: usersRes.error || !usersRes.data ? null : usersRes.data.map(toCamelCase),
      notifications: notifsRes.error || !notifsRes.data ? null : notifsRes.data.map(toCamelCase),
    };
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
};

export const syncItemToSupabase = async (
  tableName: string, 
  item: any, 
  action: 'upsert' | 'delete', 
  idKey = 'id'
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) return { success: false, error: 'Supabase is not configured' };
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Could not initialize Supabase client' };

  try {
    if (action === 'delete') {
      const { error } = await client.from(tableName).delete().eq(idKey, item[idKey]);
      if (error) {
        console.error(`Supabase delete error in ${tableName}:`, error);
        return { success: false, error: error.message || JSON.stringify(error) };
      }
      return { success: true };
    }

    let snakeItem = toSnakeCase(item);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      attempts++;
      const { error } = await client.from(tableName).upsert(snakeItem);
      if (!error) {
        return { success: true };
      }

      console.error(`Supabase upsert attempt ${attempts} error in ${tableName}:`, error);
      const errMsg = error.message || JSON.stringify(error);

      // Handle missing column errors gracefully by stripping the missing column and retrying
      const missingColumnMatch = errMsg.match(/Could not find the '([^']+)' column/i);
      if (missingColumnMatch && missingColumnMatch[1]) {
        const missingCol = missingColumnMatch[1];
        console.warn(`[Supabase Sync] Table '${tableName}' is missing column '${missingCol}'. Omitting key and retrying...`);
        delete snakeItem[missingCol];
        continue;
      }

      return { success: false, error: errMsg };
    }

    return { success: false, error: 'Max retry attempts reached' };
  } catch (err: any) {
    console.error(`Supabase sync exception in ${tableName}:`, err);
    return { success: false, error: err?.message || 'Unknown network error' };
  }
};

const upsertWithFallback = async (client: any, tableName: string, items: any[]) => {
  if (!items || items.length === 0) return;
  let snakeItems = items.map(toSnakeCase);
  let attempts = 0;
  while (attempts < 10) {
    attempts++;
    const { error } = await client.from(tableName).upsert(snakeItems);
    if (!error) return;
    const errMsg = error.message || JSON.stringify(error);
    const missingColumnMatch = errMsg.match(/Could not find the '([^']+)' column/i);
    if (missingColumnMatch && missingColumnMatch[1]) {
      const missingCol = missingColumnMatch[1];
      console.warn(`[Supabase Seed] Table '${tableName}' is missing column '${missingCol}'. Omitting key and retrying...`);
      snakeItems = snakeItems.map(item => {
        const copy = { ...item };
        delete copy[missingCol];
        return copy;
      });
      continue;
    }
    console.error(`Supabase seed error on ${tableName}:`, error);
    break;
  }
};

export const seedSupabaseData = async (initialData: {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  users: UserAccount[];
  notifications: NotificationItem[];
}) => {
  if (!isSupabaseConfigured()) return false;
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    await upsertWithFallback(client, 'contacts', initialData.contacts);
    await upsertWithFallback(client, 'deals', initialData.deals);
    await upsertWithFallback(client, 'tasks', initialData.tasks);
    await upsertWithFallback(client, 'users', initialData.users);
    await upsertWithFallback(client, 'notifications', initialData.notifications);
    return true;
  } catch (err) {
    console.error('Supabase seeding error:', err);
    return false;
  }
};
