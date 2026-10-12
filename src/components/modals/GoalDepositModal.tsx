import React, { useState } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { SavingsGoal, Account } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  accounts: Account[];
  onDepositOrWithdraw: (
    goalId: string,
    amount: number,
    action: 'deposit' | 'withdraw',
    accountId?: string
  ) => Promise<void>;
  language: Language;
}

export const GoalDepositModal: React.FC<Props> = ({
  isOpen,
  onClose,
  goal,
  accounts,
  onDepositOrWithdraw,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [deductFromAccount, setDeductFromAccount] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setIsSubmitting(true);
    try {
      await onDepositOrWithdraw(
        goal.id,
        val,
        action,
        deductFromAccount ? accountId : undefined
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {isUrdu ? goal.titleUrdu : goal.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setAction('deposit')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                action === 'deposit'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>{t.depositFunds}</span>
            </button>
            <button
              type="button"
              onClick={() => setAction('withdraw')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                action === 'withdraw'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>{t.withdrawFunds}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.amount} (PKR) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deductFromAccount}
                onChange={(e) => setDeductFromAccount(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>
                {action === 'deposit'
                  ? isUrdu
                    ? 'بینک یا والٹ اکاؤنٹ سے رقم منہا کریں'
                    : 'Deduct from Account balance'
                  : isUrdu
                  ? 'بینک یا والٹ اکاؤنٹ میں رقم جمع کریں'
                  : 'Deposit back to Account balance'}
              </span>
            </label>

            {deductFromAccount && (
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {isUrdu ? acc.nameUrdu : acc.name} ({formatPKR(acc.balance, 'standard', language)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition"
            >
              {isSubmitting ? 'Saving...' : t.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
