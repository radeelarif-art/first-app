import React, { useState, useEffect } from 'react';
import { X, Building2, Smartphone, Banknote, CreditCard } from 'lucide-react';
import { Account, AccountType } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => Promise<void>;
  editAccount?: Account | null;
  language: Language;
}

const PRESET_COLORS = [
  '#10b981', // emerald
  '#0284c7', // sky
  '#16a34a', // green
  '#dc2626', // red
  '#ea580c', // orange
  '#8b5cf6', // purple
  '#0d9488', // teal
  '#4f46e5', // indigo
];

export const AddAccountModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editAccount,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#0284c7');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editAccount) {
        setName(editAccount.name);
        setNameUrdu(editAccount.nameUrdu || editAccount.name);
        setType(editAccount.type);
        setBankName(editAccount.bankName || '');
        setAccountNumber(editAccount.accountNumber || '');
        setBalance(editAccount.balance.toString());
        setColor(editAccount.color || '#0284c7');
      } else {
        setName('');
        setNameUrdu('');
        setType('bank');
        setBankName('');
        setAccountNumber('');
        setBalance('0');
        setColor('#0284c7');
      }
    }
  }, [isOpen, editAccount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const accData: Account = {
        id: editAccount ? editAccount.id : `acc-${Date.now()}`,
        name: name.trim(),
        nameUrdu: nameUrdu.trim() || name.trim(),
        type,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        balance: parseFloat(balance) || 0,
        color,
        icon:
          type === 'cash'
            ? 'Banknote'
            : type === 'wallet'
            ? 'Smartphone'
            : type === 'savings'
            ? 'CreditCard'
            : 'Building2',
        createdAt: editAccount ? editAccount.createdAt : new Date().toISOString(),
      };

      await onSave(accData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editAccount ? t.edit : t.addNewAccount}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.accountType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('bank')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition ${
                  type === 'bank'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{isUrdu ? 'بینک' : 'Bank'}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('wallet')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition ${
                  type === 'wallet'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{isUrdu ? 'والٹ' : 'Wallet'}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('cash')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition ${
                  type === 'cash'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>{isUrdu ? 'نقد کیش' : 'Cash'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.accountName} (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Meezan Islamic / EasyPaisa / Wallet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isUrdu ? 'اکاؤنٹ کا اردو نام (اختیاری)' : 'Account Urdu Name (Optional)'}
            </label>
            <input
              type="text"
              placeholder="مثلاً: میزان بینک / ایزی پیسہ / نقد رقم"
              value={nameUrdu}
              onChange={(e) => setNameUrdu(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.currentBalance} (PKR)
              </label>
              <input
                type="number"
                step="any"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.accountNumber}
              </label>
              <input
                type="text"
                placeholder="e.g. 7860 or 0300"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Color palette */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {isUrdu ? 'رنگ منتخب کریں' : 'Theme Color'}
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    color === c ? 'border-white ring-2 ring-emerald-500 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
