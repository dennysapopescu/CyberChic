import AsyncStorage from '@react-native-async-storage/async-storage';
import { Garment, LookbookOutfit, UserAccount } from '../types/wardrobe';
import { STARTER_GARMENTS } from '../data/starterPack';

const KEYS = {
  USERS: '@cyberchic_users_v2',
  ACTIVE_USER_ID: '@cyberchic_active_user_id_v2',
  SETTINGS: '@cyberchic_settings_v1',
  GARMENTS_PREFIX: '@cyberchic_garments_user_',
  LOOKBOOK_PREFIX: '@cyberchic_lookbook_user_',
};

// On a fresh install from the App Store, no users exist yet.
export const INITIAL_ACCOUNTS: UserAccount[] = [];

export interface AppSettings {
  isMuted: boolean;
  isCrtEnabled: boolean;
}

export const StorageService = {
  // --- USER ACCOUNTS MANAGEMENT ---
  async getUsers(): Promise<UserAccount[]> {
    try {
      const stored = await AsyncStorage.getItem(KEYS.USERS);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  async getActiveUser(): Promise<UserAccount | null> {
    try {
      const users = await this.getUsers();
      if (users.length === 0) return null;

      const activeId = await AsyncStorage.getItem(KEYS.ACTIVE_USER_ID);
      if (activeId) {
        const found = users.find((u) => u.id === activeId);
        if (found) return found;
      }
      // If activeId not set or not found, pick first
      const defaultUser = users[0];
      await AsyncStorage.setItem(KEYS.ACTIVE_USER_ID, defaultUser.id);
      return defaultUser;
    } catch (e) {
      return null;
    }
  },

  async setActiveUser(userId: string): Promise<UserAccount> {
    const users = await this.getUsers();
    const found = users.find((u) => u.id === userId);
    if (!found) throw new Error('User not found');
    await AsyncStorage.setItem(KEYS.ACTIVE_USER_ID, found.id);
    return found;
  },

  async createUser(
    name: string,
    tagline = 'Fashion Icon',
    avatarIcon = '✨',
    email?: string,
    authProvider: 'local' | 'google' = 'local',
    avatarImageUri?: string
  ): Promise<UserAccount> {
    const users = await this.getUsers();
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email,
      authProvider,
      tagline: tagline.trim() || 'Fashion Icon',
      avatarIcon,
      avatarImageUri,
      themeColor: authProvider === 'google' ? '#ea4335' : '#ff1493',
      createdAt: Date.now(),
    };
    const updated = [...users, newUser];
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    await AsyncStorage.setItem(KEYS.ACTIVE_USER_ID, newUser.id);
    return newUser;
  },

  async updateUser(updatedUser: UserAccount): Promise<UserAccount> {
    const users = await this.getUsers();
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    return updatedUser;
  },

  async deleteUser(userId: string): Promise<UserAccount[]> {
    const users = await this.getUsers();
    if (users.length <= 1) {
      throw new Error('Cannot delete the last remaining account');
    }
    const filtered = users.filter((u) => u.id !== userId);
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
    const activeId = await AsyncStorage.getItem(KEYS.ACTIVE_USER_ID);
    if (activeId === userId) {
      await AsyncStorage.setItem(KEYS.ACTIVE_USER_ID, filtered[0].id);
    }
    return filtered;
  },

  // --- WARDROBE PER USER ---
  async getGarments(userId?: string): Promise<Garment[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.GARMENTS_PREFIX}${uid}`;
      const stored = await AsyncStorage.getItem(key);
      if (!stored) {
        // Seed new user with starter pack
        await AsyncStorage.setItem(key, JSON.stringify(STARTER_GARMENTS));
        return STARTER_GARMENTS;
      }
      const parsed: Garment[] = JSON.parse(stored);
      // Ensure starter pack items are included
      const existingIds = new Set(parsed.map((g) => g.id));
      const missing = STARTER_GARMENTS.filter((g) => !existingIds.has(g.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        await AsyncStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      return STARTER_GARMENTS;
    }
  },

  async saveGarment(garment: Garment, userId?: string): Promise<Garment[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.GARMENTS_PREFIX}${uid}`;
      const current = await this.getGarments(uid);
      const updated = [garment, ...current.filter((g) => g.id !== garment.id)];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('StorageService.saveGarment error:', e);
      throw e;
    }
  },

  async deleteGarment(id: string, userId?: string): Promise<Garment[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.GARMENTS_PREFIX}${uid}`;
      const current = await this.getGarments(uid);
      const updated = current.filter((g) => g.id !== id);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('StorageService.deleteGarment error:', e);
      throw e;
    }
  },

  async resetToStarterPack(userId?: string): Promise<Garment[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.GARMENTS_PREFIX}${uid}`;
      await AsyncStorage.setItem(key, JSON.stringify(STARTER_GARMENTS));
      return STARTER_GARMENTS;
    } catch (e) {
      return STARTER_GARMENTS;
    }
  },

  // --- LOOKBOOK PER USER ---
  async getLookbook(userId?: string): Promise<LookbookOutfit[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.LOOKBOOK_PREFIX}${uid}`;
      const stored = await AsyncStorage.getItem(key);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  async saveOutfitToLookbook(outfit: LookbookOutfit, userId?: string): Promise<LookbookOutfit[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.LOOKBOOK_PREFIX}${uid}`;
      const current = await this.getLookbook(uid);
      const updated = [outfit, ...current.filter((o) => o.id !== outfit.id)];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('StorageService.saveOutfitToLookbook error:', e);
      throw e;
    }
  },

  async deleteOutfitFromLookbook(id: string, userId?: string): Promise<LookbookOutfit[]> {
    try {
      const active = await this.getActiveUser();
      const uid = userId || active?.id || 'guest';
      const key = `${KEYS.LOOKBOOK_PREFIX}${uid}`;
      const current = await this.getLookbook(uid);
      const updated = current.filter((o) => o.id !== id);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('StorageService.deleteOutfitFromLookbook error:', e);
      throw e;
    }
  },

  // --- SETTINGS ---
  async getSettings(): Promise<AppSettings> {
    try {
      const stored = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (!stored) return { isMuted: false, isCrtEnabled: true };
      return JSON.parse(stored);
    } catch (e) {
      return { isMuted: false, isCrtEnabled: true };
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return { isMuted: false, isCrtEnabled: true };
    }
  },
};
