import { supabase, isSupabaseConfigured } from './supabase';
import { Contact, Deal, Task, UserAccount, NotificationItem } from '../types';

export const fetchSupabaseData = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const [contactsRes, dealsRes, tasksRes, usersRes, notifsRes] = await Promise.all([
      supabase.from('contacts').select('*'),
      supabase.from('deals').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('users').select('*'),
      supabase.from('notifications').select('*')
    ]);

    return {
      contacts: contactsRes.error ? null : contactsRes.data,
      deals: dealsRes.error ? null : dealsRes.data,
      tasks: tasksRes.error ? null : tasksRes.data,
      users: usersRes.error ? null : usersRes.data,
      notifications: notifsRes.error ? null : notifsRes.data,
    };
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
};

export const syncItemToSupabase = async (tableName: string, item: any, action: 'upsert' | 'delete', idKey = 'id') => {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    if (action === 'upsert') {
      const { error } = await supabase.from(tableName).upsert(item);
      if (error) {
        console.error(`Supabase upsert error in ${tableName}:`, error);
        return false;
      }
    } else if (action === 'delete') {
      const { error } = await supabase.from(tableName).delete().eq(idKey, item[idKey]);
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
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    if (initialData.contacts?.length) {
      await supabase.from('contacts').upsert(initialData.contacts);
    }
    if (initialData.deals?.length) {
      await supabase.from('deals').upsert(initialData.deals);
    }
    if (initialData.tasks?.length) {
      await supabase.from('tasks').upsert(initialData.tasks);
    }
    if (initialData.users?.length) {
      await supabase.from('users').upsert(initialData.users);
    }
    if (initialData.notifications?.length) {
      await supabase.from('notifications').upsert(initialData.notifications);
    }
    return true;
  } catch (err) {
    console.error('Supabase seeding error:', err);
    return false;
  }
};
