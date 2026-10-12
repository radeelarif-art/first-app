import React from 'react';
import {
  Wallet,
  Languages,
  Moon,
  Sun,
  Plus,
  BookOpen,
} from 'lucide-react';
import { AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface Props {
  settings: AppSettings;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenAddTx: () => void;
  onOpenDeployGuide: () => void;
}

export const Header: React.FC<Props> = ({
  settings,
  onToggleLanguage,
  onToggleTheme,
  onOpenAddTx,
  onOpenDeployGuide,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-sm font-black text-sm">
            ₨
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                {isUrdu ? 'میرا فنانس پی کے' : 'My Finance PK'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PKR
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              {t.offlineReady}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton language={settings.language} />

          {/* Guide Button */}
          <button
            onClick={onOpenDeployGuide}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1"
            title={isUrdu ? 'گائیڈ اور ڈپلائمنٹ' : 'Run & Deploy Guide'}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline">{isUrdu ? 'گائیڈ' : 'Guide'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold flex items-center gap-1"
            title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
          >
            <Languages className="w-4 h-4 text-sky-500" />
            <span className="text-xs uppercase">{isUrdu ? 'EN' : 'اردو'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={settings.theme === 'dark' ? t.lightTheme : t.darkTheme}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-500" />
            )}
          </button>

          {/* Add Transaction Primary Button */}
          <button
            onClick={onOpenAddTx}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addTransaction}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
