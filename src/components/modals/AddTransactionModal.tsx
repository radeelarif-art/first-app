import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft, Calendar, Tag, UserCheck, Wallet } from 'lucide-react';
import { Account, Category, Transaction, TransactionType, FamilyTag } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { formatPKR } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction, editOldTx?: Transaction) => Promise<void>;
  editTransaction?: Transaction | null;
  accounts: Account[];
  categories: Category[];
  language: Language;
  defaultAccountId: string;
}

export const AddTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editTransaction,
  accounts,
  categories,
  language,
  defaultAccountId,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [familyMember, setFamilyMember] = useState<FamilyTag>('household');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmount(editTransaction.amount.toString());
        setAccountId(editTransaction.accountId);
        setTargetAccountId(editTransaction.targetAccountId || '');
        setCategoryId(editTransaction.categoryId);
        setDate(editTransaction.date);
        setNote(editTransaction.note);
        setFamilyMember(editTransaction.familyMember || 'household');
      } else {
        setType('expense');
        setAmount('');
        const initialAcc = defaultAccountId || (accounts.length > 0 ? accounts[0].id : '');
        setAccountId(initialAcc);
        const secondAcc = accounts.find((a) => a.id !== initialAcc);
        setTargetAccountId(secondAcc ? secondAcc.id : '');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
        setFamilyMember('household');

        // default category
        const defaultCat = categories.find((c) => c.type === 'expense');
        setCategoryId(defaultCat ? defaultCat.id : (categories[0]?.id || ''));
      }
      setError('');
    }
  }, [isOpen, editTransaction, accounts, categories, defaultAccountId]);

  // Adjust category when type changes
  useEffect(() => {
    if (!editTransaction) {
      const match = categories.find((c) => c.type === (type === 'income' ? 'income' : 'expense'));
      if (match) {
        setCategoryId(match.id);
      }
    }
  }, [type, categories, editTransaction]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => {
    if (type === 'transfer') return true;
    return c.type === type;
  });

  const handleQuickAdd = (increment: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + increment).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError(isUrdu ? 'براہ کرم درست رقم درج کریں' : 'Please enter a valid amount.');
      return;
    }
    if (!accountId) {
      setError(isUrdu ? 'براہ کرم اکاؤنٹ منتخب کریں' : 'Please select an account.');
      return;
    }
    if (type === 'transfer' && (!targetAccountId || targetAccountId === accountId)) {
      setError(isUrdu ? 'براہ کرم دوسرا وصول کنندہ اکاؤنٹ منتخب کریں' : 'Please select a different recipient account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const txData: Transaction = {
        id: editTransaction ? editTransaction.id : `tx-${Date.now()}`,
        type,
        amount: parsedAmount,
        accountId,
        targetAccountId: type === 'transfer' ? targetAccountId : undefined,
        categoryId: type === 'transfer' ? (categoryId || 'cat-other-exp') : categoryId,
        date: date || new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        note: note.trim() || (isUrdu ? (type === 'income' ? 'آمدن' : type === 'expense' ? 'خرچ' : 'ٹرانسفر') : type),
        familyMember,
        createdAt: editTransaction ? editTransaction.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(txData, editTransaction || undefined);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === accountId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {editTransaction ? t.edit : t.addTransaction}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Type Segmented Buttons */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>{t.addExpense}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{t.addIncome}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'transfer'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{t.transfer}</span>
            </button>
          </div>

          {/* Amount Input with Quick Chips */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.amount} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                ₨
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Increment Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[500, 1000, 2000, 5000, 10000, 25000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Account & Target Account Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                <span>{type === 'transfer' ? t.fromAccount : t.account} *</span>
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {isUrdu ? acc.nameUrdu : acc.name} ({formatPKR(acc.balance, 'standard', language)})
                  </option>
                ))}
              </select>
              {selectedAccount && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {isUrdu ? 'موجودہ بیلنس:' : 'Available:'}{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatPKR(selectedAccount.balance, 'standard', language)}
                  </span>
                </div>
              )}
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-sky-500" />
                  <span>{t.toAccount} *</span>
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{isUrdu ? '-- وصول کنندہ منتخب کریں --' : '-- Select Target --'}</option>
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {isUrdu ? acc.nameUrdu : acc.name} ({formatPKR(acc.balance, 'standard', language)})
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.category} *</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isUrdu ? cat.nameUrdu : cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Date & Family Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.date} *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>{t.familyMember}</span>
              </label>
              <select
                value={familyMember}
                onChange={(e) => setFamilyMember(e.target.value as FamilyTag)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="household">{t.tagHousehold}</option>
                <option value="self">{t.tagSelf}</option>
                <option value="spouse">{t.tagSpouse}</option>
                <option value="kids">{t.tagKids}</option>
                <option value="parents">{t.tagParents}</option>
                <option value="other">{t.tagOther}</option>
              </select>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.note} ({t.optional})
            </label>
            <input
              type="text"
              placeholder={isUrdu ? 'مثلاً: امتیاز سے راشن خریدا، پیٹرول ڈلوایا' : 'e.g. Weekly Groceries, Fuel, Doctor visit'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition disabled:opacity-50 ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              {isSubmitting ? 'Saving...' : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
