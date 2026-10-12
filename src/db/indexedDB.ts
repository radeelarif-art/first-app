import {
  Account,
  Category,
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  UdharRecord,
  BillReminder,
  AppSettings,
  AppExportData,
} from '../types/finance';
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_CATEGORIES,
  DEFAULT_TRANSACTIONS,
  DEFAULT_BUDGETS,
  DEFAULT_SAVINGS_GOALS,
  DEFAULT_RECURRING,
  DEFAULT_UDHARS,
  DEFAULT_BILLS,
  DEFAULT_SETTINGS,
} from './initialData';

const DB_NAME = 'MyFinancePK_DB';
const DB_VERSION = 1;

class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('date', 'date', { unique: false });
          txStore.createIndex('type', 'type', { unique: false });
          txStore.createIndex('accountId', 'accountId', { unique: false });
          txStore.createIndex('categoryId', 'categoryId', { unique: false });
        }
        if (!db.objectStoreNames.contains('budgets')) {
          db.createObjectStore('budgets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('savingsGoals')) {
          db.createObjectStore('savingsGoals', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('recurring')) {
          db.createObjectStore('recurring', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('udhars')) {
          db.createObjectStore('udhars', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('bills')) {
          db.createObjectStore('bills', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = async () => {
        const db = request.result;
        // Verify if initial seed is needed
        await this.seedInitialDataIfEmpty(db);
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  private async seedInitialDataIfEmpty(db: IDBDatabase): Promise<void> {
    return new Promise((resolve) => {
      const tx = db.transaction(['accounts'], 'readonly');
      const store = tx.objectStore('accounts');
      const countReq = store.count();

      countReq.onsuccess = async () => {
        if (countReq.result === 0) {
          // Empty DB, seed initial Pakistani data
          await this.populateDefaults(db);
        }
        resolve();
      };
      countReq.onerror = () => resolve();
    });
  }

  private async populateDefaults(db: IDBDatabase): Promise<void> {
    const storeNames = [
      'accounts',
      'categories',
      'transactions',
      'budgets',
      'savingsGoals',
      'recurring',
      'udhars',
      'bills',
      'settings',
    ];

    const tx = db.transaction(storeNames, 'readwrite');

    DEFAULT_ACCOUNTS.forEach((item) => tx.objectStore('accounts').put(item));
    DEFAULT_CATEGORIES.forEach((item) => tx.objectStore('categories').put(item));
    DEFAULT_TRANSACTIONS.forEach((item) => tx.objectStore('transactions').put(item));
    DEFAULT_BUDGETS.forEach((item) => tx.objectStore('budgets').put(item));
    DEFAULT_SAVINGS_GOALS.forEach((item) => tx.objectStore('savingsGoals').put(item));
    DEFAULT_RECURRING.forEach((item) => tx.objectStore('recurring').put(item));
    DEFAULT_UDHARS.forEach((item) => tx.objectStore('udhars').put(item));
    DEFAULT_BILLS.forEach((item) => tx.objectStore('bills').put(item));
    tx.objectStore('settings').put({ key: 'appSettings', value: DEFAULT_SETTINGS });

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }

  // Generic methods
  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async put<T>(storeName: string, item: T): Promise<T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  public async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async clearStore(storeName: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Settings
  public async getSettings(): Promise<AppSettings> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get('appSettings');
      req.onsuccess = () => {
        resolve(req.result?.value || DEFAULT_SETTINGS);
      };
      req.onerror = () => resolve(DEFAULT_SETTINGS);
    });
  }

  public async saveSettings(settings: AppSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key: 'appSettings', value: settings });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Transaction processing with Account balance updates
  public async addTransaction(txData: Transaction): Promise<{ transaction: Transaction; accounts: Account[] }> {
    const db = await this.getDB();
    const accounts = await this.getAll<Account>('accounts');

    // Update account balances
    if (txData.type === 'income') {
      const acc = accounts.find((a) => a.id === txData.accountId);
      if (acc) acc.balance += txData.amount;
    } else if (txData.type === 'expense') {
      const acc = accounts.find((a) => a.id === txData.accountId);
      if (acc) acc.balance -= txData.amount;
    } else if (txData.type === 'transfer' && txData.targetAccountId) {
      const sourceAcc = accounts.find((a) => a.id === txData.accountId);
      const targetAcc = accounts.find((a) => a.id === txData.targetAccountId);
      if (sourceAcc) sourceAcc.balance -= txData.amount;
      if (targetAcc) targetAcc.balance += txData.amount;
    }

    // Save transaction and updated accounts in one IndexedDB transaction
    const dbTx = db.transaction(['transactions', 'accounts'], 'readwrite');
    dbTx.objectStore('transactions').put(txData);
    const accStore = dbTx.objectStore('accounts');
    accounts.forEach((acc) => accStore.put(acc));

    await new Promise<void>((resolve, reject) => {
      dbTx.oncomplete = () => resolve();
      dbTx.onerror = () => reject(dbTx.error);
    });

    return { transaction: txData, accounts };
  }

  public async updateTransaction(
    oldTx: Transaction,
    newTx: Transaction
  ): Promise<{ transaction: Transaction; accounts: Account[] }> {
    const db = await this.getDB();
    const accounts = await this.getAll<Account>('accounts');

    // Revert old transaction
    if (oldTx.type === 'income') {
      const acc = accounts.find((a) => a.id === oldTx.accountId);
      if (acc) acc.balance -= oldTx.amount;
    } else if (oldTx.type === 'expense') {
      const acc = accounts.find((a) => a.id === oldTx.accountId);
      if (acc) acc.balance += oldTx.amount;
    } else if (oldTx.type === 'transfer' && oldTx.targetAccountId) {
      const src = accounts.find((a) => a.id === oldTx.accountId);
      const tgt = accounts.find((a) => a.id === oldTx.targetAccountId);
      if (src) src.balance += oldTx.amount;
      if (tgt) tgt.balance -= oldTx.amount;
    }

    // Apply new transaction
    if (newTx.type === 'income') {
      const acc = accounts.find((a) => a.id === newTx.accountId);
      if (acc) acc.balance += newTx.amount;
    } else if (newTx.type === 'expense') {
      const acc = accounts.find((a) => a.id === newTx.accountId);
      if (acc) acc.balance -= newTx.amount;
    } else if (newTx.type === 'transfer' && newTx.targetAccountId) {
      const src = accounts.find((a) => a.id === newTx.accountId);
      const tgt = accounts.find((a) => a.id === newTx.targetAccountId);
      if (src) src.balance -= newTx.amount;
      if (tgt) tgt.balance += newTx.amount;
    }

    const dbTx = db.transaction(['transactions', 'accounts'], 'readwrite');
    dbTx.objectStore('transactions').put(newTx);
    const accStore = dbTx.objectStore('accounts');
    accounts.forEach((acc) => accStore.put(acc));

    await new Promise<void>((resolve, reject) => {
      dbTx.oncomplete = () => resolve();
      dbTx.onerror = () => reject(dbTx.error);
    });

    return { transaction: newTx, accounts };
  }

  public async deleteTransaction(oldTx: Transaction): Promise<{ accounts: Account[] }> {
    const db = await this.getDB();
    const accounts = await this.getAll<Account>('accounts');

    // Revert balance impact
    if (oldTx.type === 'income') {
      const acc = accounts.find((a) => a.id === oldTx.accountId);
      if (acc) acc.balance -= oldTx.amount;
    } else if (oldTx.type === 'expense') {
      const acc = accounts.find((a) => a.id === oldTx.accountId);
      if (acc) acc.balance += oldTx.amount;
    } else if (oldTx.type === 'transfer' && oldTx.targetAccountId) {
      const src = accounts.find((a) => a.id === oldTx.accountId);
      const tgt = accounts.find((a) => a.id === oldTx.targetAccountId);
      if (src) src.balance += oldTx.amount;
      if (tgt) tgt.balance -= oldTx.amount;
    }

    const dbTx = db.transaction(['transactions', 'accounts'], 'readwrite');
    dbTx.objectStore('transactions').delete(oldTx.id);
    const accStore = dbTx.objectStore('accounts');
    accounts.forEach((acc) => accStore.put(acc));

    await new Promise<void>((resolve, reject) => {
      dbTx.oncomplete = () => resolve();
      dbTx.onerror = () => reject(dbTx.error);
    });

    return { accounts };
  }

  // Backup & Restore
  public async exportAllData(): Promise<AppExportData> {
    const [accounts, categories, transactions, budgets, savingsGoals, recurring, udhars, bills, settings] =
      await Promise.all([
        this.getAll<Account>('accounts'),
        this.getAll<Category>('categories'),
        this.getAll<Transaction>('transactions'),
        this.getAll<Budget>('budgets'),
        this.getAll<SavingsGoal>('savingsGoals'),
        this.getAll<RecurringTransaction>('recurring'),
        this.getAll<UdharRecord>('udhars'),
        this.getAll<BillReminder>('bills'),
        this.getSettings(),
      ]);

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      accounts,
      categories,
      transactions,
      budgets,
      savingsGoals,
      recurring,
      udhars,
      bills,
      settings,
    };
  }

  public async importAllData(data: AppExportData): Promise<void> {
    if (!data || !Array.isArray(data.accounts) || !Array.isArray(data.transactions)) {
      throw new Error('Invalid backup file format.');
    }

    const db = await this.getDB();
    const storeNames = [
      'accounts',
      'categories',
      'transactions',
      'budgets',
      'savingsGoals',
      'recurring',
      'udhars',
      'bills',
      'settings',
    ];

    const tx = db.transaction(storeNames, 'readwrite');

    // Clear existing
    storeNames.forEach((s) => {
      if (s !== 'settings') tx.objectStore(s).clear();
    });

    // Populate imported
    data.accounts.forEach((item) => tx.objectStore('accounts').put(item));
    data.categories.forEach((item) => tx.objectStore('categories').put(item));
    data.transactions.forEach((item) => tx.objectStore('transactions').put(item));
    (data.budgets || []).forEach((item) => tx.objectStore('budgets').put(item));
    (data.savingsGoals || []).forEach((item) => tx.objectStore('savingsGoals').put(item));
    (data.recurring || []).forEach((item) => tx.objectStore('recurring').put(item));
    (data.udhars || []).forEach((item) => tx.objectStore('udhars').put(item));
    (data.bills || []).forEach((item) => tx.objectStore('bills').put(item));

    if (data.settings) {
      tx.objectStore('settings').put({ key: 'appSettings', value: data.settings });
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async resetToDefaults(): Promise<void> {
    const db = await this.getDB();
    const storeNames = [
      'accounts',
      'categories',
      'transactions',
      'budgets',
      'savingsGoals',
      'recurring',
      'udhars',
      'bills',
      'settings',
    ];

    const tx = db.transaction(storeNames, 'readwrite');
    storeNames.forEach((s) => tx.objectStore(s).clear());

    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });

    await this.populateDefaults(db);
  }
}

export const dbService = new IndexedDBStorage();
