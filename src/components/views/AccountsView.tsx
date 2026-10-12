import React, { useState } from 'react';
import { Plus, ArrowRightLeft, Edit2, Trash2, Wallet, Building2, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { Account, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';

interface Props {
  accounts: Account[];
  settings: AppSettings;
  onOpenAddAccount: () => void;
  onEditAccount: (account: Account) => void;
  onDeleteAccount: (accountId: string) => Promise<void>;
  onOpenTransfer: () => void;
}

export const AccountsView: React.FC<Props> = ({
  accounts,
  settings,
  onOpenAddAccount,
  onEditAccount,
  onDeleteAccount,
  onOpenTransfer,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return <Banknote className="w-5 h-5 text-emerald-500" />;
      case 'wallet':
        return <Smartphone className="w-5 h-5 text-purple-500" />;
      case 'savings':
        return <CreditCard className="w-5 h-5 text-amber-500" />;
      default:
        return <Building2 className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.navAccounts}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {accounts.length} {isUrdu ? 'اکاؤنٹس اور والٹس' : 'Active Accounts & Wallets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{t.transferFunds}</span>
          </button>
          <button
            onClick={onOpenAddAccount}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewAccount}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Balance Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-lg flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {t.totalAccounts}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {formatPKR(totalBalance, settings.numberFormat, settings.language, settings.currencySymbol)}
          </div>
        </div>
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
          <Wallet className="w-7 h-7" />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md group relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: acc.color || '#10b981' }}
            />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${acc.color || '#10b981'}15` }}
                  >
                    {getAccountIcon(acc.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isUrdu ? acc.nameUrdu : acc.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {acc.type === 'cash'
                        ? t.cashInHand
                        : acc.type === 'wallet'
                        ? t.mobileWallet
                        : t.bankAccount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEditAccount(acc)}
                    className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {accounts.length > 1 && (
                    <button
                      onClick={() => setDeleteId(acc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {acc.accountNumber && (
                <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md inline-block">
                  •••• {acc.accountNumber}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">{t.currentBalance}</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatPKR(acc.balance, settings.numberFormat, settings.language)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-rose-600 mb-2">{t.delete}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {isUrdu
                ? 'کیا آپ واقعی اس اکاؤنٹ کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this account?'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={async () => {
                  await onDeleteAccount(deleteId);
                  setDeleteId(null);
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
