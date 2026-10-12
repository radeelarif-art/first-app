import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  Settings,
  Handshake,
  Wallet,
  Zap,
} from 'lucide-react';
import { translations, Language } from '../../locales/translations';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddTx: () => void;
  language: Language;
}

export const MobileNav: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenAddTx,
  language,
}) => {
  const t = translations[language];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navDashboard}</span>
        </button>

        <button
          onClick={() => onSelectTab('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navTransactions}</span>
        </button>

        {/* Floating Center Action Button */}
        <div className="flex items-center justify-center px-1">
          <button
            onClick={onOpenAddTx}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center -translate-y-2 active:scale-95 transition"
            title={t.addTransaction}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <button
          onClick={() => onSelectTab('udhar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'udhar'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Handshake className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navUdhar}</span>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'settings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navSettings}</span>
        </button>
      </div>
    </nav>
  );
};
