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

export const syncItemToSupabase = async (tableName: string, item: any, action: 'upsert' | 'delete', idKey = 'id') => {
  if (!isSupabaseConfigured()) return false;
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    if (action === 'upsert') {
      const snakeItem = toSnakeCase(item);
      const { error } = await client.from(tableName).upsert(snakeItem);
      if (error) {
        console.error(`Supabase upsert error in ${tableName}:`, error);
        return false;
      }
    } else if (action === 'delete') {
      const { error } = await client.from(tableName).delete().eq(idKey, item[idKey]);
      if (error) {
        console.error(`Supabase delete error in ${tableName}:`, error);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`Supabase sync exception in ${tableName}:`, err);
    return false;
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
    if (initialData.contacts?.length) {
      await client.from('contacts').upsert(initialData.contacts.map(toSnakeCase));
    }
    if (initialData.deals?.length) {
      await client.from('deals').upsert(initialData.deals.map(toSnakeCase));
    }
    if (initialData.tasks?.length) {
      await client.from('tasks').upsert(initialData.tasks.map(toSnakeCase));
    }
    if (initialData.users?.length) {
      await client.from('users').upsert(initialData.users.map(toSnakeCase));
    }
    if (initialData.notifications?.length) {
      await client.from('notifications').upsert(initialData.notifications.map(toSnakeCase));
    }
    return true;
  } catch (err) {
    console.error('Supabase seeding error:', err);
    return false;
  }
};
