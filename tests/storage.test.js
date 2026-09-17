const test = require('node:test');
const { describe, it, beforeEach } = test;
const assert = require('node:assert/strict');

// In-memory AsyncStorage mock
const store = new Map();
const AsyncStorageMock = {
  getItem: async (key) => store.get(key) || null,
  setItem: async (key, val) => { store.set(key, String(val)); },
  removeItem: async (key) => { store.delete(key); },
  clear: async () => { store.clear(); },
  getAllKeys: async () => Array.from(store.keys()),
};

// Create a standalone instance of the storage logic using the mock
const KEYS = {
  USERS: '@cyberchic_users',
  ACTIVE_USER_ID: '@cyberchic_active_user_id',
  GARMENTS_PREFIX: '@cyberchic_garments_user_',
  LOOKBOOK_PREFIX: '@cyberchic_lookbook_user_',
};

const STARTER_GARMENTS = [
  { id: 'top-yellow-plaid', name: 'Yellow Plaid Blazer', category: 'top' },
  { id: 'bottom-yellow-plaid', name: 'Yellow Plaid Skirt', category: 'bottom' },
];

const MockStorageService = {
  async getGarments(userId = 'guest') {
    const key = `${KEYS.GARMENTS_PREFIX}${userId}`;
    const stored = await AsyncStorageMock.getItem(key);
    if (!stored) {
      await AsyncStorageMock.setItem(key, JSON.stringify(STARTER_GARMENTS));
      return STARTER_GARMENTS;
    }
    return JSON.parse(stored);
  },

  async saveGarment(garment, userId = 'guest') {
    const key = `${KEYS.GARMENTS_PREFIX}${userId}`;
    const current = await this.getGarments(userId);
    const exists = current.some((g) => g.id === garment.id);
    const updated = exists
      ? current.map((g) => (g.id === garment.id ? garment : g))
      : [garment, ...current];
    await AsyncStorageMock.setItem(key, JSON.stringify(updated));
    return updated;
  },

  async deleteGarment(id, userId = 'guest') {
    const key = `${KEYS.GARMENTS_PREFIX}${userId}`;
    const current = await this.getGarments(userId);
    const updated = current.filter((g) => g.id !== id);
    await AsyncStorageMock.setItem(key, JSON.stringify(updated));
    return updated;
  },

  async deleteUser(userId) {
    const usersRaw = await AsyncStorageMock.getItem(KEYS.USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const filtered = users.filter((u) => u.id !== userId);
    await AsyncStorageMock.setItem(KEYS.USERS, JSON.stringify(filtered));
    await AsyncStorageMock.removeItem(`${KEYS.GARMENTS_PREFIX}${userId}`);
    await AsyncStorageMock.removeItem(`${KEYS.LOOKBOOK_PREFIX}${userId}`);
    return filtered;
  },
};

describe('Storage Service Persistence Integrity', () => {
  beforeEach(async () => {
    await AsyncStorageMock.clear();
  });

  it('seeds starter garments once on initial access', async () => {
    const garments = await MockStorageService.getGarments('user-cher');
    assert.equal(garments.length, 2);
    assert.equal(garments[0].id, 'top-yellow-plaid');
  });

  it('permanently deletes a garment without resurrecting starter garments on re-load', async () => {
    // Initial seed
    await MockStorageService.getGarments('user-cher');
    // Delete top-yellow-plaid
    const updated = await MockStorageService.deleteGarment('top-yellow-plaid', 'user-cher');
    assert.equal(updated.length, 1);
    assert.equal(updated[0].id, 'bottom-yellow-plaid');

    // Re-access garments (simulating app reload)
    const reloaded = await MockStorageService.getGarments('user-cher');
    assert.equal(reloaded.length, 1);
    assert.equal(reloaded[0].id, 'bottom-yellow-plaid', 'Deleted starter item must NOT resurrect');
  });

  it('updates an existing garment in place', async () => {
    await MockStorageService.getGarments('user-cher');
    const modified = { id: 'top-yellow-plaid', name: 'Customized Blazer', category: 'top' };
    const saved = await MockStorageService.saveGarment(modified, 'user-cher');

    assert.equal(saved.length, 2);
    const item = saved.find((g) => g.id === 'top-yellow-plaid');
    assert.equal(item.name, 'Customized Blazer');
  });

  it('cascade deletes all user garments and lookbook records when a user is deleted', async () => {
    const uid = 'user-dionne';
    await AsyncStorageMock.setItem(KEYS.USERS, JSON.stringify([{ id: uid, name: 'Dionne' }]));
    await MockStorageService.getGarments(uid);
    await AsyncStorageMock.setItem(`${KEYS.LOOKBOOK_PREFIX}${uid}`, JSON.stringify([{ id: 'look-1' }]));

    assert.ok(await AsyncStorageMock.getItem(`${KEYS.GARMENTS_PREFIX}${uid}`));
    assert.ok(await AsyncStorageMock.getItem(`${KEYS.LOOKBOOK_PREFIX}${uid}`));

    await MockStorageService.deleteUser(uid);

    assert.equal(await AsyncStorageMock.getItem(`${KEYS.GARMENTS_PREFIX}${uid}`), null, 'Garments key must be deleted');
    assert.equal(await AsyncStorageMock.getItem(`${KEYS.LOOKBOOK_PREFIX}${uid}`), null, 'Lookbook key must be deleted');
  });
});
