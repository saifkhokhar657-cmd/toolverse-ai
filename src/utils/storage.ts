import { UserAccount, UserUsage, SavedItem } from '../types';
import { TOOLS_CONFIG } from '../data/tools';

const STORAGE_KEYS = {
  USER: 'toolverse_user',
  USAGE: 'toolverse_usage',
  SAVED_ITEMS: 'toolverse_saved_items',
  HISTORY: 'toolverse_history',
};

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUsage(): UserUsage {
  const user = getStoredUser();
  const plan = user?.plan || 'guest';
  const limit = TOOLS_CONFIG.limits[plan];
  const today = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USAGE);
    if (raw) {
      const data: UserUsage = JSON.parse(raw);
      if (data.lastResetDate === today) {
        return {
          ...data,
          plan,
          dailyGenerationsLimit: limit,
        };
      }
    }
  } catch {
    // fallback
  }

  const fresh: UserUsage = {
    plan,
    dailyGenerationsUsed: 0,
    dailyGenerationsLimit: limit,
    lastResetDate: today,
  };
  saveStoredUsage(fresh);
  return fresh;
}

export const getUserUsage = getStoredUsage;

export function saveStoredUsage(usage: UserUsage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
  } catch (e) {
    console.error(e);
  }
}

export const saveUserUsage = saveStoredUsage;

export function incrementGenerationsUsed(): UserUsage {
  const current = getStoredUsage();
  const updated: UserUsage = {
    ...current,
    dailyGenerationsUsed: current.dailyGenerationsUsed + 1,
  };
  saveStoredUsage(updated);
  return updated;
}

export function getSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSavedItem(item: Omit<SavedItem, 'id' | 'createdAt'>): SavedItem {
  const items = getSavedItems();
  const newItem: SavedItem = {
    ...item,
    id: `saved_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...items].slice(0, 100);
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return newItem;
}

export function removeSavedItem(id: string): void {
  const items = getSavedItems();
  const filtered = items.filter(it => it.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

export interface HistoryEntry {
  id: string;
  toolName: string;
  toolPath: string;
  timestamp: string;
  action: string;
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logToolHistory(toolName: string, toolPath: string, action: string): void {
  const current = getHistory();
  const entry: HistoryEntry = {
    id: `hist_${Date.now()}`,
    toolName,
    toolPath,
    timestamp: new Date().toISOString(),
    action,
  };
  const updated = [entry, ...current].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}
