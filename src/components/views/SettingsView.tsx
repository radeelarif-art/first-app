import React, { useRef, useState } from 'react';
import {
  Settings,
  Languages,
  Moon,
  Sun,
  Coins,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Smartphone,
} from 'lucide-react';
import { AppSettings, AppExportData } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => Promise<void>;
  onExportBackup: () => Promise<void>;
  onImportBackup: (data: AppExportData) => Promise<void>;
  onResetDatabase: () => Promise<void>;
  onOpenDeployGuide: () => void;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onResetDatabase,
  onOpenDeployGuide,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLanguageChange = async (lang: Language) => {
    await onUpdateSettings({ ...settings, language: lang });
  };

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    await onUpdateSettings({ ...settings, theme });
  };

  const handleNumberFormatChange = async (numberFormat: 'standard' | 'lakh') => {
    await onUpdateSettings({ ...settings, numberFormat });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as AppExportData;
      await onImportBackup(parsed);
      setNotification(t.restoreSuccess);
      setTimeout(() => setNotification(''), 4000);
    } catch {
      alert(isUrdu ? 'بیک اپ فائل درست نہیں ہے' : 'Invalid backup file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t.settingsTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isUrdu ? 'زبان، ڈارک موڈ، بیک اپ فائل اور ڈپلائمنٹ کی معلومات' : 'Language, themes, JSON backups, and deployment instructions'}
        </p>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Guide & Deploy Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <span>{t.guideAndDeploy}</span>
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            {t.guideDescription}
          </p>
        </div>
        <button
          onClick={onOpenDeployGuide}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-extrabold shadow-sm hover:bg-emerald-50 transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          {isUrdu ? 'گائیڈ دیکھیں' : 'View Instructions'}
        </button>
      </div>

      {/* Preferences Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          {isUrdu ? 'ترجیحات و ظاہری شکل' : 'Preferences & Appearance'}
        </h2>

        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.languageSelect}
              </div>
              <div className="text-[11px] text-slate-500">
                {isUrdu ? 'اردو یا انگلش (RTL سپورٹ)' : 'Urdu & English with RTL layout'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleLanguageChange('ur')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.language === 'ur'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              اردو (Urdu)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.language === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.themeSelect}
              </div>
              <div className="text-[11px] text-slate-500">
                {isUrdu ? 'لائٹ یا ڈارک موڈ' : 'Light or dark theme'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.theme === 'dark'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t.darkTheme}</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.theme === 'light'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t.lightTheme}</span>
            </button>
          </div>
        </div>

        {/* Number Notation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.currencyFormat}
              </div>
              <div className="text-[11px] text-slate-500">
                {isUrdu ? 'لاکھ اور کروڑ کا پاکستانی فارمیٹ' : 'Standard or Pakistani Lakhs / Crores'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleNumberFormatChange('standard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.numberFormat === 'standard'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.standardFormat}
            </button>
            <button
              onClick={() => handleNumberFormatChange('lakh')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.numberFormat === 'lakh'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.lakhFormat}
            </button>
          </div>
        </div>
      </div>

      {/* Backup and Restore Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          {t.backupAndRestore}
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          {t.backupDescription}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportJson}</span>
          </button>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessing ? 'Restoring...' : t.importJson}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>{isUrdu ? 'ڈیٹا ری سیٹ کرنا' : 'Reset Demo Records'}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {isUrdu
            ? 'اگر آپ شروع سے شروع کرنا چاہتے ہیں یا ابتدائی پاکستانی ڈیمو ڈیٹا دوبارہ لوڈ کرنا چاہتے ہیں تو نیچے کلک کریں۔'
            : 'Reset the IndexedDB database back to initial Pakistani default sample records.'}
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetData}</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-rose-600 mb-2">{t.resetData}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {t.resetConfirm}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={async () => {
                  await onResetDatabase();
                  setShowResetConfirm(false);
                  setNotification(isUrdu ? 'ڈیٹا کامیابی سے ری سیٹ ہو گیا!' : 'Data reset successfully!');
                  setTimeout(() => setNotification(''), 4000);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
