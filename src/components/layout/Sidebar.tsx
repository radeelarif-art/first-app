import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  Target,
  Handshake,
  Zap,
  BarChart3,
  Settings,
} from 'lucide-react';
import { translations, Language } from '../../locales/translations';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  unpaidBillsCount?: number;
  pendingUdharCount?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  language,
  unpaidBillsCount = 0,
  pendingUdharCount = 0,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'transactions', label: t.navTransactions, icon: Receipt },
    { id: 'accounts', label: t.navAccounts, icon: Wallet },
    { id: 'budgets', label: t.navBudgets, icon: PieChart },
    { id: 'savings', label: t.navSavings, icon: Target },
    {
      id: 'udhar',
      label: t.navUdhar,
      icon: Handshake,
      badge: pendingUdharCount > 0 ? pendingUdharCount : undefined,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'bills',
      label: t.navBills,
      icon: Zap,
      badge: unpaidBillsCount > 0 ? unpaidBillsCount : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    { id: 'reports', label: t.navReports, icon: BarChart3 },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <aside className="hidden sm:flex flex-col w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-3 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
