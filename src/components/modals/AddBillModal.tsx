import React, { useState, useEffect } from 'react';
import { X, FileText, Zap, Flame, Wifi, Home, GraduationCap } from 'lucide-react';
import { BillReminder } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: BillReminder) => Promise<void>;
  editBill?: BillReminder | null;
  language: Language;
}

const COMMON_PROVIDERS = [
  { name: 'LESCO', label: 'LESCO (Lahore Electric)' },
  { name: 'K-Electric', label: 'K-Electric (Karachi)' },
  { name: 'IESCO', label: 'IESCO (Islamabad Electric)' },
  { name: 'MEPCO', label: 'MEPCO (Multan Electric)' },
  { name: 'SNGPL', label: 'SNGPL (Sui Northern Gas)' },
  { name: 'SSGC', label: 'SSGC (Sui Southern Gas)' },
  { name: 'PTCL', label: 'PTCL Flash Fiber / Landline' },
  { name: 'Nayatel', label: 'Nayatel Fiber' },
  { name: 'StormFiber', label: 'StormFiber' },
  { name: 'WASA', label: 'WASA Water & Sanitation' },
  { name: 'School', label: 'School / College Fees' },
  { name: 'Rent', label: 'House / Shop Rent' },
];

export const AddBillModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editBill,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [billName, setBillName] = useState('');
  const [billNameUrdu, setBillNameUrdu] = useState('');
  const [provider, setProvider] = useState('LESCO');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'bi-monthly' | 'yearly' | 'one-time'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editBill) {
        setBillName(editBill.billName);
        setBillNameUrdu(editBill.billNameUrdu || editBill.billName);
        setProvider(editBill.provider || 'LESCO');
        setConsumerNumber(editBill.consumerNumber || '');
        setAmount(editBill.amount.toString());
        setDueDate(editBill.dueDate);
        setFrequency(editBill.frequency || 'monthly');
      } else {
        setBillName('');
        setBillNameUrdu('');
        setProvider('LESCO');
        setConsumerNumber('');
        setAmount('');
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        setDueDate(nextWeek.toISOString().split('T')[0]);
        setFrequency('monthly');
      }
    }
  }, [isOpen, editBill]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!billName.trim() || !val || val <= 0) return;

    setIsSubmitting(true);
    try {
      const billData: BillReminder = {
        id: editBill ? editBill.id : `bill-${Date.now()}`,
        billName: billName.trim(),
        billNameUrdu: billNameUrdu.trim() || billName.trim(),
        provider,
        consumerNumber: consumerNumber.trim() || undefined,
        amount: val,
        dueDate,
        frequency,
        status: editBill ? editBill.status : 'unpaid',
      };
      await onSave(billData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span>{editBill ? t.edit : t.addBill}</span>
          </h2>
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
              {t.provider}
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                if (!billName) {
                  setBillName(`${e.target.value} Bill`);
                  setBillNameUrdu(`${e.target.value} کا بل`);
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              {COMMON_PROVIDERS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.billName} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. LESCO Electricity Bill"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.amount} (PKR) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.dueDate} *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.consumerNumber} ({t.optional})
            </label>
            <input
              type="text"
              placeholder="e.g. 24 11223 3445501 U"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
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
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition"
            >
              {isSubmitting ? 'Saving...' : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
