/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from './db/indexedDB';
import {
  Account,
  Category,
  Transaction,
  Budget,
  SavingsGoal,
  UdharRecord,
  BillReminder,
  AppSettings,
  AppExportData,
  TransactionType,
  UdharType,
} from './types/finance';
import { DEFAULT_SETTINGS } from './db/initialData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { AccountsView } from './components/views/AccountsView';
import { BudgetsView } from './components/views/BudgetsView';
import { SavingsView } from './components/views/SavingsView';
import { UdharView } from './components/views/UdharView';
import { BillsView } from './components/views/BillsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddAccountModal } from './components/modals/AddAccountModal';
import { AddBudgetModal } from './components/modals/AddBudgetModal';
import { AddSavingsGoalModal } from './components/modals/AddSavingsGoalModal';
import { GoalDepositModal } from './components/modals/GoalDepositModal';
import { AddUdharModal } from './components/modals/AddUdharModal';
import { RecordUdharPaymentModal } from './components/modals/RecordUdharPaymentModal';
import { AddBillModal } from './components/modals/AddBillModal';
import { PayBillModal } from './components/modals/PayBillModal';
import { DeployGuideModal } from './components/modals/DeployGuideModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [udhars, setUdhars] = useState<UdharRecord[]>([]);
  const [bills, setBills] = useState<BillReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isAddSavingsGoalOpen, setIsAddSavingsGoalOpen] = useState(false);
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | null>(null);

  const [isGoalDepositOpen, setIsGoalDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const [isAddUdharOpen, setIsAddUdharOpen] = useState(false);
  const [editingUdhar, setEditingUdhar] = useState<UdharRecord | null>(null);
  const [defaultUdharType, setDefaultUdharType] = useState<UdharType>('receivable');

  const [isRecordUdharPaymentOpen, setIsRecordUdharPaymentOpen] = useState(false);
  const [selectedUdharForPayment, setSelectedUdharForPayment] = useState<UdharRecord | null>(null);

  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillReminder | null>(null);

  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [selectedBillToPay, setSelectedBillToPay] = useState<BillReminder | null>(null);

  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Load all data from IndexedDB
  const loadData = useCallback(async () => {
    try {
      const [
        savedSettings,
        loadedAccounts,
        loadedCategories,
        loadedTransactions,
        loadedBudgets,
        loadedSavingsGoals,
        loadedUdhars,
        loadedBills,
      ] = await Promise.all([
        dbService.getSettings(),
        dbService.getAll<Account>('accounts'),
        dbService.getAll<Category>('categories'),
        dbService.getAll<Transaction>('transactions'),
        dbService.getAll<Budget>('budgets'),
        dbService.getAll<SavingsGoal>('savingsGoals'),
        dbService.getAll<UdharRecord>('udhars'),
        dbService.getAll<BillReminder>('bills'),
      ]);

      setSettings(savedSettings);
      setAccounts(loadedAccounts);
      setCategories(loadedCategories);
      setTransactions(loadedTransactions);
      setBudgets(loadedBudgets);
      setSavingsGoals(loadedSavingsGoals);
      setUdhars(loadedUdhars);
      setBills(loadedBills);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync RTL and Dark Mode with DOM
  useEffect(() => {
    const isUrdu = settings.language === 'ur';
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    document.documentElement.lang = isUrdu ? 'ur' : 'en';

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.language, settings.theme]);

  // Settings update handler
  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await dbService.saveSettings(newSettings);
  };

  const handleToggleLanguage = async () => {
    const nextLang = settings.language === 'ur' ? 'en' : 'ur';
    await handleUpdateSettings({ ...settings, language: nextLang });
  };

  const handleToggleTheme = async () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    await handleUpdateSettings({ ...settings, theme: nextTheme });
  };

  // Transaction Handlers
  const handleSaveTransaction = async (txData: Transaction, oldTx?: Transaction) => {
    if (oldTx) {
      const result = await dbService.updateTransaction(oldTx, txData);
      setTransactions((prev) => prev.map((t) => (t.id === txData.id ? txData : t)));
      setAccounts(result.accounts);
    } else {
      const result = await dbService.addTransaction(txData);
      setTransactions((prev) => [txData, ...prev]);
      setAccounts(result.accounts);
    }
  };

  const handleDeleteTransaction = async (tx: Transaction) => {
    const result = await dbService.deleteTransaction(tx);
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    setAccounts(result.accounts);
  };

  // Account Handlers
  const handleSaveAccount = async (account: Account) => {
    await dbService.put('accounts', account);
    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === account.id);
      return exists ? prev.map((a) => (a.id === account.id ? account : a)) : [...prev, account];
    });
  };

  const handleDeleteAccount = async (accountId: string) => {
    await dbService.delete('accounts', accountId);
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
  };

  // Budget Handlers
  const handleSaveBudget = async (budget: Budget) => {
    await dbService.put('budgets', budget);
    setBudgets((prev) => {
      const exists = prev.some((b) => b.id === budget.id);
      return exists ? prev.map((b) => (b.id === budget.id ? budget : b)) : [...prev, budget];
    });
  };

  const handleDeleteBudget = async (budgetId: string) => {
    await dbService.delete('budgets', budgetId);
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
  };

  // Savings Goal Handlers
  const handleSaveSavingsGoal = async (goal: SavingsGoal) => {
    await dbService.put('savingsGoals', goal);
    setSavingsGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id);
      return exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, goal];
    });
  };

  const handleDeleteSavingsGoal = async (goalId: string) => {
    await dbService.delete('savingsGoals', goalId);
    setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleDepositOrWithdraw = async (
    goalId: string,
    amount: number,
    action: 'deposit' | 'withdraw',
    accountId?: string
  ) => {
    const targetGoal = savingsGoals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const delta = action === 'deposit' ? amount : -amount;
    const newCurrent = Math.max(0, targetGoal.currentAmount + delta);
    const updatedGoal: SavingsGoal = {
      ...targetGoal,
      currentAmount: newCurrent,
      isCompleted: newCurrent >= targetGoal.targetAmount,
    };

    await dbService.put('savingsGoals', updatedGoal);
    setSavingsGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));

    // Sync with account if requested
    if (accountId) {
      const isUrdu = settings.language === 'ur';
      const actionName =
        action === 'deposit'
          ? isUrdu
            ? `بچت ہدف (${targetGoal.titleUrdu || targetGoal.title}) میں رقم جمع`
            : `Deposit to Goal: ${targetGoal.title}`
          : isUrdu
          ? `بچت ہدف (${targetGoal.titleUrdu || targetGoal.title}) سے رقم نکلوائی`
          : `Withdrawal from Goal: ${targetGoal.title}`;

      const syncTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: action === 'deposit' ? 'expense' : 'income',
        amount,
        accountId,
        categoryId: 'cat-kameti',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        note: actionName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await dbService.addTransaction(syncTx);
      setTransactions((prev) => [syncTx, ...prev]);
      setAccounts(result.accounts);
    }
  };

  // Udhar Handlers
  const handleSaveUdhar = async (record: UdharRecord) => {
    await dbService.put('udhars', record);
    setUdhars((prev) => {
      const exists = prev.some((u) => u.id === record.id);
      return exists ? prev.map((u) => (u.id === record.id ? record : u)) : [record, ...prev];
    });
  };

  const handleDeleteUdhar = async (recordId: string) => {
    await dbService.delete('udhars', recordId);
    setUdhars((prev) => prev.filter((u) => u.id !== recordId));
  };

  const handleRecordUdharPayment = async (
    recordId: string,
    amount: number,
    date: string,
    note: string,
    accountId?: string
  ) => {
    const targetUdhar = udhars.find((u) => u.id === recordId);
    if (!targetUdhar) return;

    const newPaid = targetUdhar.paidAmount + amount;
    const isSettled = newPaid >= targetUdhar.initialAmount;
    const payment = {
      id: `p-${Date.now()}`,
      amount,
      date,
      note,
    };

    const updatedUdhar: UdharRecord = {
      ...targetUdhar,
      paidAmount: newPaid,
      status: isSettled ? 'settled' : 'partially_paid',
      payments: [...targetUdhar.payments, payment],
    };

    await dbService.put('udhars', updatedUdhar);
    setUdhars((prev) => prev.map((u) => (u.id === recordId ? updatedUdhar : u)));

    // Sync with account
    if (accountId) {
      const isUrdu = settings.language === 'ur';
      const isReceivable = targetUdhar.type === 'receivable';

      const txNote = isReceivable
        ? isUrdu
          ? `${targetUdhar.personName} سے ادھار کی وصولی`
          : `Khata loan received from ${targetUdhar.personName}`
        : isUrdu
        ? `${targetUdhar.personName} کو ادھار کی واپسی`
        : `Khata loan returned to ${targetUdhar.personName}`;

      const syncTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: isReceivable ? 'income' : 'expense',
        amount,
        accountId,
        categoryId: isReceivable ? 'cat-other-inc' : 'cat-other-exp',
        date,
        time: new Date().toTimeString().slice(0, 5),
        note: `${txNote} ${note ? `(${note})` : ''}`,
        udharId: recordId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await dbService.addTransaction(syncTx);
      setTransactions((prev) => [syncTx, ...prev]);
      setAccounts(result.accounts);
    }
  };

  const handleMarkUdharSettled = async (recordId: string) => {
    const targetUdhar = udhars.find((u) => u.id === recordId);
    if (!targetUdhar) return;

    const updatedUdhar: UdharRecord = {
      ...targetUdhar,
      paidAmount: targetUdhar.initialAmount,
      status: 'settled',
    };

    await dbService.put('udhars', updatedUdhar);
    setUdhars((prev) => prev.map((u) => (u.id === recordId ? updatedUdhar : u)));
  };

  // Bill Handlers
  const handleSaveBill = async (bill: BillReminder) => {
    await dbService.put('bills', bill);
    setBills((prev) => {
      const exists = prev.some((b) => b.id === bill.id);
      return exists ? prev.map((b) => (b.id === bill.id ? bill : b)) : [bill, ...prev];
    });
  };

  const handleDeleteBill = async (billId: string) => {
    await dbService.delete('bills', billId);
    setBills((prev) => prev.filter((b) => b.id !== billId));
  };

  const handlePayBill = async (
    billId: string,
    accountId: string,
    amount: number,
    date: string
  ) => {
    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill) return;

    const isUrdu = settings.language === 'ur';

    // 1. Mark bill as paid
    const updatedBill: BillReminder = {
      ...targetBill,
      status: 'paid',
      paidDate: date,
      accountId,
    };
    await dbService.put('bills', updatedBill);
    setBills((prev) => prev.map((b) => (b.id === billId ? updatedBill : b)));

    // 2. Create expense transaction
    const catMatch =
      categories.find((c) =>
        targetBill.billName.toLowerCase().includes('electricity') ||
        targetBill.provider.toLowerCase().includes('lesco') ||
        targetBill.provider.toLowerCase().includes('electric')
          ? c.id === 'cat-electricity'
          : targetBill.billName.toLowerCase().includes('gas') ||
            targetBill.provider.toLowerCase().includes('gas')
          ? c.id === 'cat-gas'
          : targetBill.billName.toLowerCase().includes('internet') ||
            targetBill.provider.toLowerCase().includes('nayatel') ||
            targetBill.provider.toLowerCase().includes('ptcl')
          ? c.id === 'cat-internet'
          : c.id === 'cat-other-exp'
      ) || categories.find((c) => c.type === 'expense') || categories[0];

    const billTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'expense',
      amount,
      accountId,
      categoryId: catMatch ? catMatch.id : 'cat-other-exp',
      date,
      time: new Date().toTimeString().slice(0, 5),
      note: isUrdu
        ? `${targetBill.billNameUrdu || targetBill.billName} کی آن لائن ادائیگی`
        : `Bill Paid: ${targetBill.billName} (${targetBill.provider})`,
      billId,
      familyMember: 'household',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await dbService.addTransaction(billTx);
    setTransactions((prev) => [billTx, ...prev]);
    setAccounts(result.accounts);
  };

  // Backup & Restore
  const handleExportBackup = async () => {
    const data = await dbService.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MyFinancePK_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = async (data: AppExportData) => {
    await dbService.importAllData(data);
    await loadData();
  };

  const handleResetDatabase = async () => {
    await dbService.resetToDefaults();
    await loadData();
  };

  // Badge counts
  const unpaidBillsCount = bills.filter((b) => b.status === 'unpaid').length;
  const pendingUdharCount = udhars.filter((u) => u.status !== 'settled').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black animate-pulse">
            ₨
          </div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {settings.language === 'ur' ? 'میرا فنانس پی کے لوڈ ہو رہا ہے...' : 'Loading My Finance PK...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        settings={settings}
        onToggleLanguage={handleToggleLanguage}
        onToggleTheme={handleToggleTheme}
        onOpenAddTx={() => {
          setEditingTx(null);
          setIsAddTxOpen(true);
        }}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          language={settings.language}
          unpaidBillsCount={unpaidBillsCount}
          pendingUdharCount={pendingUdharCount}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              accounts={accounts}
              categories={categories}
              transactions={transactions}
              budgets={budgets}
              bills={bills}
              udhars={udhars}
              settings={settings}
              onOpenAddTx={(type) => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
              onOpenPayBill={(bill) => {
                setSelectedBillToPay(bill);
                setIsPayBillOpen(true);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              settings={settings}
              onOpenAddTx={() => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
              onEditTx={(tx) => {
                setEditingTx(tx);
                setIsAddTxOpen(true);
              }}
              onDeleteTx={handleDeleteTransaction}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              settings={settings}
              onOpenAddAccount={() => {
                setEditingAccount(null);
                setIsAddAccountOpen(true);
              }}
              onEditAccount={(acc) => {
                setEditingAccount(acc);
                setIsAddAccountOpen(true);
              }}
              onDeleteAccount={handleDeleteAccount}
              onOpenTransfer={() => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              categories={categories}
              transactions={transactions}
              settings={settings}
              onOpenAddBudget={() => {
                setEditingBudget(null);
                setIsAddBudgetOpen(true);
              }}
              onEditBudget={(b) => {
                setEditingBudget(b);
                setIsAddBudgetOpen(true);
              }}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsView
              goals={savingsGoals}
              accounts={accounts}
              settings={settings}
              onOpenAddGoal={() => {
                setEditingSavingsGoal(null);
                setIsAddSavingsGoalOpen(true);
              }}
              onEditGoal={(g) => {
                setEditingSavingsGoal(g);
                setIsAddSavingsGoalOpen(true);
              }}
              onDeleteGoal={handleDeleteSavingsGoal}
              onOpenDeposit={(g) => {
                setSelectedGoal(g);
                setIsGoalDepositOpen(true);
              }}
            />
          )}

          {activeTab === 'udhar' && (
            <UdharView
              udhars={udhars}
              settings={settings}
              onOpenAddUdhar={(type) => {
                setEditingUdhar(null);
                if (type) setDefaultUdharType(type);
                setIsAddUdharOpen(true);
              }}
              onEditUdhar={(item) => {
                setEditingUdhar(item);
                setIsAddUdharOpen(true);
              }}
              onDeleteUdhar={handleDeleteUdhar}
              onOpenRecordPayment={(item) => {
                setSelectedUdharForPayment(item);
                setIsRecordUdharPaymentOpen(true);
              }}
              onMarkSettled={handleMarkUdharSettled}
            />
          )}

          {activeTab === 'bills' && (
            <BillsView
              bills={bills}
              settings={settings}
              onOpenAddBill={() => {
                setEditingBill(null);
                setIsAddBillOpen(true);
              }}
              onEditBill={(b) => {
                setEditingBill(b);
                setIsAddBillOpen(true);
              }}
              onDeleteBill={handleDeleteBill}
              onOpenPayBill={(b) => {
                setSelectedBillToPay(b);
                setIsPayBillOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              transactions={transactions}
              categories={categories}
              accounts={accounts}
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetDatabase={handleResetDatabase}
              onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddTx={() => {
          setEditingTx(null);
          setIsAddTxOpen(true);
        }}
        language={settings.language}
      />

      {/* Offline Toast Indicator */}
      <OfflineIndicator language={settings.language} />

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onSave={handleSaveTransaction}
        editTransaction={editingTx}
        accounts={accounts}
        categories={categories}
        language={settings.language}
        defaultAccountId={settings.defaultAccountId}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSave={handleSaveAccount}
        editAccount={editingAccount}
        language={settings.language}
      />

      <AddBudgetModal
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
        onSave={handleSaveBudget}
        editBudget={editingBudget}
        categories={categories}
        language={settings.language}
      />

      <AddSavingsGoalModal
        isOpen={isAddSavingsGoalOpen}
        onClose={() => setIsAddSavingsGoalOpen(false)}
        onSave={handleSaveSavingsGoal}
        editGoal={editingSavingsGoal}
        language={settings.language}
      />

      <GoalDepositModal
        isOpen={isGoalDepositOpen}
        onClose={() => setIsGoalDepositOpen(false)}
        goal={selectedGoal}
        accounts={accounts}
        onDepositOrWithdraw={handleDepositOrWithdraw}
        language={settings.language}
      />

      <AddUdharModal
        isOpen={isAddUdharOpen}
        onClose={() => setIsAddUdharOpen(false)}
        onSave={handleSaveUdhar}
        editRecord={editingUdhar}
        defaultType={defaultUdharType}
        language={settings.language}
      />

      <RecordUdharPaymentModal
        isOpen={isRecordUdharPaymentOpen}
        onClose={() => setIsRecordUdharPaymentOpen(false)}
        record={selectedUdharForPayment}
        accounts={accounts}
        onRecordPayment={handleRecordUdharPayment}
        language={settings.language}
      />

      <AddBillModal
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        onSave={handleSaveBill}
        editBill={editingBill}
        language={settings.language}
      />

      <PayBillModal
        isOpen={isPayBillOpen}
        onClose={() => setIsPayBillOpen(false)}
        bill={selectedBillToPay}
        accounts={accounts}
        onPayBill={handlePayBill}
        language={settings.language}
      />

      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
        language={settings.language}
      />
    </div>
  );
}
