export type TransactionType = 'income' | 'expense' | 'transfer';

export type AccountType = 'cash' | 'bank' | 'wallet' | 'savings';

export type FamilyTag = 'self' | 'spouse' | 'parents' | 'kids' | 'household' | 'other';

export interface Account {
  id: string;
  name: string;
  nameUrdu: string;
  type: AccountType;
  bankName?: string;
  accountNumber?: string;
  balance: number;
  color: string;
  icon: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  targetAccountId?: string; // used for transfer
  categoryId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note: string;
  familyMember?: FamilyTag;
  tags?: string[];
  billId?: string; // linked bill reminder
  udharId?: string; // linked udhar record
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  limitAmount: number;
  alertThreshold: number; // percentage (e.g. 80)
}

export interface SavingsGoal {
  id: string;
  title: string;
  titleUrdu: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  category: string;
  icon: string;
  color: string;
  notes?: string;
  isCompleted?: boolean;
  createdAt: string;
}

export interface RecurringTransaction {
  id: string;
  title: string;
  titleUrdu: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string; // YYYY-MM-DD
  isActive: boolean;
  autoProcess?: boolean;
}

export type UdharType = 'receivable' | 'payable'; // receivable: mujhe lene hain, payable: mujhe dene hain
export type UdharStatus = 'pending' | 'partially_paid' | 'settled';

export interface UdharPayment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface UdharRecord {
  id: string;
  type: UdharType;
  personName: string;
  phoneNumber?: string;
  initialAmount: number;
  paidAmount: number;
  dueDate?: string;
  note: string;
  status: UdharStatus;
  payments: UdharPayment[];
  createdAt: string;
}

export interface BillReminder {
  id: string;
  billName: string;
  billNameUrdu: string;
  provider: string; // e.g. LESCO, K-Electric, SNGPL, PTCL, StormFiber
  consumerNumber?: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  frequency: 'monthly' | 'bi-monthly' | 'yearly' | 'one-time';
  status: 'unpaid' | 'paid';
  paidDate?: string;
  accountId?: string;
}

export interface AppSettings {
  language: 'en' | 'ur';
  theme: 'light' | 'dark' | 'system';
  currencySymbol: 'Rs.' | '₨' | 'PKR';
  numberFormat: 'standard' | 'lakh'; // standard: Rs. 150,000 | lakh: 1.5 Lakh / لاکھ
  defaultAccountId: string;
}

export interface AppExportData {
  version: string;
  exportDate: string;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  recurring: RecurringTransaction[];
  udhars: UdharRecord[];
  bills: BillReminder[];
  settings: AppSettings;
}
