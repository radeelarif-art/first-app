import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { UdharRecord, Account } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: UdharRecord | null;
  accounts: Account[];
  onRecordPayment: (
    recordId: string,
    amount: number,
    date: string,
    note: string,
    accountId?: string
  ) => Promise<void>;
  language: Language;
}

export const RecordUdharPaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  record,
  accounts,
  onRecordPayment,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [syncWithAccount, setSyncWithAccount] = useState(true);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !record) return null;

  const remaining = Math.max(0, record.initialAmount - record.paidAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setIsSubmitting(true);
    try {
      await onRecordPayment(
        record.id,
        val,
        date,
        note.trim(),
        syncWithAccount ? accountId : undefined
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
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.recordPayment}
            </h2>
            <div className="text-xs text-slate-500">
              {record.personName} ({formatPKR(remaining, 'standard', language)}{' '}
              {isUrdu ? 'باقی' : 'remaining'})
            </div>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.amount} (PKR) *
              </label>
              <button
                type="button"
                onClick={() => setAmount(remaining.toString())}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {isUrdu ? 'مکمل رقم ادا کریں' : 'Full Settle'}
              </button>
            </div>
            <input
              type="number"
              step="any"
              required
              max={remaining}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.date}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.note}
            </label>
            <input
              type="text"
              placeholder={isUrdu ? 'مثلاً: ایزی پیسہ کے ذریعے وصول ہوئی' : 'e.g. Paid via Cash or JazzCash'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={syncWithAccount}
                onChange={(e) => setSyncWithAccount(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>
                {record.type === 'receivable'
                  ? isUrdu
                    ? 'وصول شدہ رقم والٹ/اکاؤنٹ میں جمع کریں'
                    : 'Add received money to account balance'
                  : isUrdu
                  ? 'ادا شدہ رقم والٹ/اکاؤنٹ سے کاٹیں'
                  : 'Deduct paid money from account balance'}
              </span>
            </label>

            {syncWithAccount && (
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
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
