import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Calendar,
  Trash2,
  Edit2,
  Tag,
  Wallet,
} from 'lucide-react';
import {
  Account,
  Category,
  Transaction,
  TransactionType,
  FamilyTag,
  AppSettings,
} from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR, formatDate, downloadCSV } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface Props {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  settings: AppSettings;
  onOpenAddTx: (type?: TransactionType) => void;
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (tx: Transaction) => Promise<void>;
}

export const TransactionsView: React.FC<Props> = ({
  transactions,
  accounts,
  categories,
  settings,
  onOpenAddTx,
  onEditTx,
  onDeleteTx,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth'>('thisMonth');
  const [deleteConfirmTx, setDeleteConfirmTx] = useState<Transaction | null>(null);

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type
      if (selectedType !== 'all' && tx.type !== selectedType) return false;
      // Category
      if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) return false;
      // Account
      if (selectedAccount !== 'all' && tx.accountId !== selectedAccount && tx.targetAccountId !== selectedAccount)
        return false;
      // Family
      if (selectedFamily !== 'all' && tx.familyMember !== selectedFamily) return false;
      // Date filter
      if (dateFilter === 'thisMonth' && !tx.date?.startsWith(currentMonthStr)) return false;
      if (dateFilter === 'lastMonth' && !tx.date?.startsWith(lastMonthStr)) return false;
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const cat = categories.find((c) => c.id === tx.categoryId);
        const acc = accounts.find((a) => a.id === tx.accountId);
        const matchNote = tx.note?.toLowerCase().includes(query);
        const matchCat = cat?.name?.toLowerCase().includes(query) || cat?.nameUrdu?.includes(query);
        const matchAcc = acc?.name?.toLowerCase().includes(query) || acc?.nameUrdu?.includes(query);
        const matchAmt = tx.amount.toString().includes(query);
        if (!matchNote && !matchCat && !matchAcc && !matchAmt) return false;
      }
      return true;
    }).sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
  }, [
    transactions,
    selectedType,
    selectedCategory,
    selectedAccount,
    selectedFamily,
    dateFilter,
    search,
    currentMonthStr,
    lastMonthStr,
    categories,
    accounts,
  ]);

  // Aggregate stats
  const totalFilteredIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netFiltered = totalFilteredIncome - totalFilteredExpense;

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Type',
      'Amount (PKR)',
      'Account',
      'Target Account',
      'Category',
      'Date',
      'Time',
      'Note',
      'Family Tag',
    ];

    const rows = filteredTransactions.map((tx) => {
      const acc = accounts.find((a) => a.id === tx.accountId);
      const targetAcc = accounts.find((a) => a.id === tx.targetAccountId);
      const cat = categories.find((c) => c.id === tx.categoryId);

      return [
        tx.id,
        tx.type,
        tx.amount,
        `"${acc?.name || ''}"`,
        `"${targetAcc?.name || ''}"`,
        `"${cat?.name || ''}"`,
        tx.date,
        tx.time || '',
        `"${(tx.note || '').replace(/"/g, '""')}"`,
        tx.familyMember || '',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = `MyFinancePK_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Header and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.navTransactions}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredTransactions.length} {isUrdu ? 'ریکارڈز ملے' : 'transactions found'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsv}</span>
          </button>
          <button
            onClick={() => onOpenAddTx()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addTransaction}</span>
          </button>
        </div>
      </div>

      {/* Filter Stats Bar */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">{t.totalIncome}</div>
          <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatPKR(totalFilteredIncome, 'standard', settings.language)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">{t.totalExpenses}</div>
          <div className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {formatPKR(totalFilteredExpense, 'standard', settings.language)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">{t.netSavings}</div>
          <div
            className={`text-sm sm:text-base font-black mt-0.5 ${
              netFiltered >= 0 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-500'
            }`}
          >
            {formatPKR(netFiltered, 'standard', settings.language)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Date Range Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setDateFilter('thisMonth')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                dateFilter === 'thisMonth'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.thisMonth}
            </button>
            <button
              onClick={() => setDateFilter('lastMonth')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                dateFilter === 'lastMonth'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.lastMonth}
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                dateFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.allTime}
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.filterByType}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.all}</option>
              <option value="income">{t.addIncome}</option>
              <option value="expense">{t.addExpense}</option>
              <option value="transfer">{t.transfer}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.filterByCategory}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.all}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {isUrdu ? c.nameUrdu : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.filterByAccount}
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.all}</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {isUrdu ? a.nameUrdu : a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t.filterByFamily}
            </label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.all}</option>
              <option value="household">{t.tagHousehold}</option>
              <option value="self">{t.tagSelf}</option>
              <option value="spouse">{t.tagSpouse}</option>
              <option value="kids">{t.tagKids}</option>
              <option value="parents">{t.tagParents}</option>
              <option value="other">{t.tagOther}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / Cards List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {t.noTransactionsYet}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const acc = accounts.find((a) => a.id === tx.accountId);
              const targetAcc = accounts.find((a) => a.id === tx.targetAccountId);

              return (
                <div
                  key={tx.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${cat?.color || '#10b981'}20`,
                        color: cat?.color || '#10b981',
                      }}
                    >
                      {getCategoryIcon(cat?.icon || 'HelpCircle', 'w-5 h-5')}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.note}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {isUrdu ? cat?.nameUrdu : cat?.name}
                        </span>
                        <span>•</span>
                        <span>{isUrdu ? acc?.nameUrdu : acc?.name}</span>
                        {tx.type === 'transfer' && targetAcc && (
                          <span>→ {isUrdu ? targetAcc.nameUrdu : targetAcc.name}</span>
                        )}
                        <span>•</span>
                        <span>{formatDate(tx.date, settings.language)}</span>
                        {tx.familyMember && (
                          <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                            {t[`tag${tx.familyMember.charAt(0).toUpperCase() + tx.familyMember.slice(1)}` as keyof typeof t] || tx.familyMember}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-xs sm:text-sm font-black ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : tx.type === 'expense'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                        {formatPKR(tx.amount, 'standard', settings.language)}
                      </div>
                    </div>

                    {/* Quick Edit & Delete icons */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title={t.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-rose-600 mb-2">{t.delete}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {isUrdu
                ? 'کیا آپ واقعی اس لین دین کو حذف کرنا چاہتے ہیں؟ اس سے اکاؤنٹ کا بیلنس خودکار طور پر بحال ہو جائے گا۔'
                : 'Are you sure you want to delete this transaction? The account balance will be restored accordingly.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmTx(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={async () => {
                  await onDeleteTx(deleteConfirmTx);
                  setDeleteConfirmTx(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
