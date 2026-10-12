import React, { useState } from 'react';
import { X, CheckCircle, Zap } from 'lucide-react';
import { BillReminder, Account } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bill: BillReminder | null;
  accounts: Account[];
  onPayBill: (billId: string, accountId: string, amount: number, date: string) => Promise<void>;
  language: Language;
}

export const PayBillModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bill,
  accounts,
  onPayBill,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState(bill ? bill.amount.toString() : '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || !accountId) return;

    setIsSubmitting(true);
    try {
      await onPayBill(bill.id, accountId, val, date);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isUrdu ? bill.billNameUrdu : bill.billName}</span>
            </h2>
            <div className="text-xs text-slate-500">{bill.provider}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isUrdu ? 'ادا کردہ رقم (روپے)' : 'Amount Paid (PKR)'} *
            </label>
            <input
              type="number"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isUrdu ? 'کس اکاؤنٹ سے ادا کیا گیا' : 'Paid From Account'} *
            </label>
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
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isUrdu ? 'ادائیگی کی تاریخ' : 'Payment Date'}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
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
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing...' : isUrdu ? 'بل ادا کریں' : 'Confirm Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
